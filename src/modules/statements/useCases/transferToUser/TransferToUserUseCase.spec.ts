import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { TransferToUserUseCase } from "./TransferToUserUseCase";


let transferToUserUseCase: TransferToUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository
describe("Transfer to user", () => {

    beforeEach(() => {

        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        transferToUserUseCase = new TransferToUserUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

    });

    it("Should be able to make a transfer statement to another user", async () => {

        const userFrom = await inMemoryUsersRepository.create({
            name: "User Sender Name Test",
            email: "usertest@test.com",
            password: "1234"
        });
        const userReceiver = await inMemoryUsersRepository.create({
            name: "User Name Receiver Test",
            email: "usertestReceiver@test.com",
            password: "123"
        });

        await inMemoryStatementsRepository.create({
            amount: 50,
            description: "Freelancer Job",
            type: OperationType.DEPOSIT,
            user_id: userFrom.id,
            sender_id: null
        });

        await inMemoryStatementsRepository.create({
            amount: 20,
            description: "First money",
            type: OperationType.DEPOSIT,
            user_id: userReceiver.id,
            sender_id: null
        });

        const transferStatement = await transferToUserUseCase.execute({
            amount: 30,
            description: "Barber Shop",
            user_from: userFrom.id,
            user_receiver: userReceiver.id
        });

        expect(transferStatement.statementDetailed.statement).toHaveProperty("id");
    });

});