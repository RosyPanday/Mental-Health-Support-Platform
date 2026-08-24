import axios from "axios";

import { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import { PaymentRepository } from "#src/repositories/paymentRepository.js";
import { RequestConsultationRepository } from "#src/repositories/requestConsultationRepository.js";
import {
  frontendUrl,
  khaltiBaseUrl,
  khaltiReturnUrl,
  khaltiSecretKey,
} from "#src/config/index.js";

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private requestConsultationRepository: RequestConsultationRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.requestConsultationRepository = new RequestConsultationRepository();
  }

  public async initiateKhaltiPayment({
    requestConsultationId,
    patientId,
  }: {
    requestConsultationId: number;
    patientId: number;
  }): Promise<{
    pidx: string;
    paymentUrl: string;
  }> {
    const requestConsultation =
      await this.requestConsultationRepository.findOne({
        where: {
          id: requestConsultationId,
          patientId,
        },
        include: [
          {
            association: "therapist",
            attributes: ["rate", "name"],
          },
        ],
        raw: true,
        nest: true,
      });

    if (!requestConsultation) {
      throw new Error("Consultation not found");
    }

    if (
      requestConsultation.status !== RequestConsultationStatusEnum.confirmed
    ) {
      throw new Error("Only confirmed consultations can be paid for");
    }

    const existingPayment = await this.paymentRepository.findByConsultationId(
      requestConsultationId,
    );

    if (existingPayment?.status === "PAID") {
      throw new Error("This consultation has already been paid");
    }
    const therapist = requestConsultation.therapist;

    if (!therapist?.rate) {
      throw new Error("Consultation price not found");
    }

    const amount = therapist.rate * 100;

    const khaltiResponse = await axios.post(
      `${khaltiBaseUrl}/epayment/initiate/`,
      {
        return_url: khaltiReturnUrl,
        website_url: frontendUrl,
        amount: amount ,
        purchase_order_id: `CONSULTATION-${requestConsultationId}`,
        purchase_order_name: "Therapy Consultation",
      },
      {
        headers: {
          Authorization: `Key ${khaltiSecretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { pidx, payment_url: paymentUrl } = khaltiResponse.data;

    if (!pidx || !paymentUrl) {
      throw new Error("Failed to initiate Khalti payment");
    }

    if (existingPayment) {
      await this.paymentRepository.update({
        input: {
          amount,
          provider: "KHALTI",
          status: "PENDING",
          pidx,
          transactionId: null,
        },
        where: {
          id: existingPayment.id,
        },
      });
    } else {
      await this.paymentRepository.create({
        requestConsultationId,
        provider: "KHALTI",
        amount,
        status: "PENDING",
        pidx,
        transactionId: null,
      });
    }

    return {
      pidx,
      paymentUrl,
    };
  }

  //verification of payment
  public async verifyKhaltiPayment({
    pidx,
    patientId,
  }: {
    pidx: string;
    patientId: number;
  }): Promise<{ status: string }> {
    const payment = await this.paymentRepository.findOne({
      where: {
        pidx,
      },
     raw:true,
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    const requestConsultation =await this.requestConsultationRepository.findByPk(
      payment.requestConsultationId,
    );

    if (!requestConsultation) {
      throw new Error("Consultation not found");
    }

    if (requestConsultation.patientId !== patientId) {
      throw new Error("You are not authorized to verify this payment");
    }

    if (payment.status === "PAID") {
      return {
        status: "PAID",
      };
    }

    const response = await axios.post(
      `${khaltiBaseUrl}/epayment/lookup/`,
      {
        pidx,
      },
      {
        headers: {
          Authorization: `Key ${khaltiSecretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const khaltiPayment = response.data;

    if (khaltiPayment.status !== "Completed") {
      await this.paymentRepository.update({
        input: {
          status: "FAILED",
        },
        where: {
          id: payment.id,
        },
      });

      throw new Error(
        `Payment was not completed. Status: ${khaltiPayment.status}`,
      );
    }

    if (khaltiPayment.total_amount !== payment.amount) {
      throw new Error("Payment amount does not match");
    }

    await this.paymentRepository.update({
      input: {
        status: "PAID",
        transactionId: khaltiPayment.transaction_id ?? null,
      },
      where: {
        id: payment.id,
      },
    });

    return {
      status: "PAID",
    };
  }
}
