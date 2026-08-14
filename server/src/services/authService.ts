import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { jwtSecret } from "#src/config/index.js";
import { Database } from "#src/database/connection.js";
import { RoleEnum } from "#src/enums/roleEnum.js";
import type {
  InputLoginInterface,
  InputSignupInterface,
} from "#src/interfaces/authInterface.js";
import {
  PatientRepository,
  TherapistRepository,
  UserRepository,
} from "#src/repositories/index.js";

export class AuthService {
  private userRepository: UserRepository;
  private patientRepository: PatientRepository;
  private therapistRepository: TherapistRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.patientRepository = new PatientRepository();
    this.therapistRepository = new TherapistRepository();
  }

  public async validateUniqueFields(
    username: string,
    email: string,
    phoneNumber: string,
  ): Promise<void> {
    const [existingEmail, existingUsername, existingPhone] = await Promise.all([
      this.userRepository.findByEmail(email),
      this.userRepository.findByUsername(username),
      this.userRepository.findByPhoneNumber(phoneNumber),
    ]);
    if (existingUsername) {
      throw new Error("username is already taken.");
    }
    if (existingEmail) {
      throw new Error("Email belongs to another user.");
    }
    if (existingPhone) {
      throw new Error("Contact number belongs to another user.");
    }
  }

  public async signup(
    input: InputSignupInterface,
  ): Promise<{ token: string; userId: number }> {
    let userId;
    const hashedPassword = await bcrypt.hash(input.password, 10);
    await Database.sequelize.transaction(async (transaction) => {
      const user = await this.userRepository.create(
        {
          username: input.username,
          password: hashedPassword,
          email: input.email,
          phoneNumber: input.phoneNumber,
          role: input.role,
        },
        { transaction: transaction },
      );
      if (input.role === RoleEnum.patient) {
        await this.patientRepository.create(
          {
            userId: user.id,
            name: input.name,
            age: input.age!,
            issues: input.issues,
            language: input.language,
          },
          { transaction: transaction },
        );
      } else {
        const {
          rate,
          educationDegree,
          specialization,
          yearsOfExperience,
        } = input;

        if (
          rate === undefined ||
          educationDegree === undefined ||
          specialization === undefined ||
          yearsOfExperience === undefined
        ) {
          throw new Error("Therapist signup requires all professional details.");
        }

        await this.therapistRepository.create(
          {
            userId: user.id,
            name: input.name,
            language: input.language,
            rate,
            educationDegree,
            specialization,
            yearsOfExperience,
          },
          { transaction: transaction },
        );
      }
      userId = user.id;
    });
    //token creation
    const token = jwt.sign(
      {
        id: userId,
        role: input.role,
      },
      jwtSecret,
      {
        expiresIn: "2h", // Token expiration time setup
      },
    );
    return { token: token, userId: userId! };
  }

  public async checkLoginCredentialsAndSignToken(
    input: InputLoginInterface,
  ): Promise<{ token: string; userId: number }> {
    const existingUser = await this.userRepository.findOne({
      where: {
        username: input.username,
      },
    });
    if (!existingUser) {
      throw new Error("Please signup before logging in.");
    }
    if (existingUser.role !== input.role) {
      throw new Error(`User has not signed up ${input.role}`);
    }
    const isPasswordMatched = await bcrypt.compare(
      input.password,
      existingUser.password,
    );
    if (!isPasswordMatched) {
      throw new Error("Incorrect username or password");
    }
    const token = jwt.sign(
      {
        id: existingUser.id,
        role: existingUser.role,
      },
      jwtSecret,
      {
        expiresIn: "2h",
      },
    );
    return { token, userId: existingUser.id };
  }
}
