import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";


let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Getting Statement Operation of user", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("Should be able to Get a statement operation of an user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Name Test",
      email: "User Email Test",
      password: "User Password test",
    });

    const statement1_Object: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 150.0,
      description: "Description Test"
    }
    const statement = await createStatementUseCase.execute(statement1_Object);

    const statement_operation = await statementsRepositoryInMemory.findStatementOperation({
      user_id: user.id as string,
      statement_id: statement.id,
    });

    expect(statement_operation).toHaveProperty("id");
    expect(statement_operation).toHaveProperty("user_id");
    expect(statement_operation).toHaveProperty("amount");
    expect(statement_operation).toHaveProperty("description");
    expect(statement_operation).toHaveProperty("type");
  });

  it("Should NOT be able to get a Statement Operation with a non-exinsting statement", () => {

    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User Name Test",
        email: "User Email Test",
        password: "User Password test",
      });

      await statementsRepositoryInMemory.findStatementOperation({
        user_id: user.id as string,
        statement_id: "statement id test",
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);

  });

  it("Should NOT be able to get a Statement Operation with a non-exinsting user", () => {
    expect(async () => {
      await statementsRepositoryInMemory.findStatementOperation({
        user_id: "user_id test",
        statement_id: "statement id test",
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);

  });

});
