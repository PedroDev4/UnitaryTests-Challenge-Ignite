import { AppError } from "@shared/errors/AppError";

export namespace TransferToUserError {
    export class UserNotFound extends AppError {
        constructor() {
            super("User not found", 404); // Acessando o construtor da classe base
        }
    }

    export class InsufficientFunds extends AppError {
        constructor() {
            super("Insufficient funds", 400);
        }
    }

    export class UserReceiverNotFound extends AppError {
        constructor() {
            super("Invalid receiving user", 404);
        }
    }
}