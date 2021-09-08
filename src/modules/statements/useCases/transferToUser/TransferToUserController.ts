import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferToUserUseCase } from "./TransferToUserUseCase";


class TransferToUserController {

    async handle(request: Request, response: Response): Promise<Response> {

        const { user_id: user_receiver } = request.query;
        const { id: user_from } = request.user;
        const { amount, description } = request.body;

        const transferToUserUseCase = container.resolve(TransferToUserUseCase);

        const transferStatement = await transferToUserUseCase.execute({
            amount,
            description,
            user_from,
            user_receiver: user_receiver as string
        });

        return response.json(transferStatement);

    }

}

export { TransferToUserController };