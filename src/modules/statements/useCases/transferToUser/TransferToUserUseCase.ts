import { OperationType, Statement } from "@modules/statements/entities/Statement";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject } from "tsyringe";
import { TransferToUserError } from "./TransferToUserErrors";


interface IRequest {

    amount: number;
    description: string;
    user_from: string;
    user_receiver: string;

}

interface IResponse {
    statementDetailed: {
        statement: Statement,
        sender_id: string
    }
}

class TransferToUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("StatementsRepository")
        private statementsRepository: IStatementsRepository
    ) { }

    async execute({ amount, description, user_from, user_receiver }: IRequest): Promise<IResponse> {

        const userSender = await this.usersRepository.findById(user_from);

        const { balance } = await this.statementsRepository.getUserBalance({
            user_id: userSender.id,
            with_statement: false
        });

        if (balance < amount) {
            throw new TransferToUserError.InsufficientFunds();
        }

        // Recuperando usuário que vai receber transferencia
        const userReceiverExists = this.usersRepository.findById(user_receiver);

        if (!userReceiverExists) {
            throw new TransferToUserError.UserReceiverNotFound();
        }

        const statement = await this.statementsRepository.create({
            user_id: userSender.id,
            amount,
            description,
            type: OperationType.TRANSFER,
            sender_id: userSender.id
        });

        return {
            statementDetailed: {
                statement,
                sender_id: userSender.id
            }
        }

    }

}


export { TransferToUserUseCase };