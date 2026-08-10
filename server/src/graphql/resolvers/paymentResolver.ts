import { RoleEnum } from "#src/enums/roleEnum.js";
import type {
  ContextInterface,
  GraphqlResponseInterface,
} from "#src/interfaces/index.js";

import { PaymentService } from "#src/services/paymentService.js";
import { GraphqlResponse } from "#src/utils/graphqlResponse.js";
import { Guard } from "#src/utils/guard.js";
import { requireRole } from "#src/utils/roleChecker.js";

export const PaymentResolver = {
  Mutation: {
    initiateKhaltiPayment: async (
      parent: ParentNode,
      args: {
        input: {
          requestConsultationId: number;
        };
      },
      contextValue: ContextInterface,
    ): Promise<
      GraphqlResponseInterface<{
        pidx: string;
        paymentUrl: string;
      }>
    > => {
      requireRole(contextValue.role, [RoleEnum.patient]);
      const patientId = await Guard.grantPatient(contextValue.id);
      const payment = await new PaymentService().initiateKhaltiPayment({
        requestConsultationId: args.input.requestConsultationId,
        patientId: patientId,
      });

      return GraphqlResponse.send<{
        pidx: string;
        paymentUrl: string;
      }>({
        message: "Khalti payment initiated successfully",
        data: payment,
      });
    },


    verifyKhaltiPayment: async (
      parent: ParentNode,
      args: {
        input: {
          pidx: string;
        };
      },
      contextValue: ContextInterface,
    ): Promise<
      GraphqlResponseInterface<{
        status: string;
      }>
    > => {
      requireRole(contextValue.role, [RoleEnum.patient]);
      const patientId = await Guard.grantPatient(contextValue.id);
      const payment = await new PaymentService().verifyKhaltiPayment({
        pidx: args.input.pidx,
        patientId,
      });
      return GraphqlResponse.send<{
        status: string;
      }>({
        message: "Khalti payment verified successfully",
        data: payment,
      });
    },
  },
};
