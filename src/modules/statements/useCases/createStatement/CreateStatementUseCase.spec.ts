import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from '@modules/statements/entities/Statement';
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { CreateStatementError } from "./CreateStatementError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementsUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Creating a user Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementsUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory,
    );
  });

  it("should not be able to create a statement to a non-existing user", () => {
    expect(async () => {
      const statement: ICreateStatementDTO = {
        user_id: "user ID Test",
        type: OperationType.DEPOSIT,
        amount: 150.0,
        description: "Description Test"
      }

      await createStatementsUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should be able to create a statement to a exsiting user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Name Test",
      email: "User Email Test",
      password: "User Password test",
    });

    const statement: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 150.0,
      description: "Description Test"
    }

    const userStatement = await createStatementsUseCase.execute(statement);

    expect(userStatement).toHaveProperty("id");
  });

  it("should be able to create a new withdraw to user", async () => {

    const user = await createUserUseCase.execute({
      name: "User Name Test",
      email: "User Email Test",
      password: "User Password test",
    });

    const statement: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 150.0,
      description: "Description Test"
    }
    await createStatementsUseCase.execute(statement);

    const statementWithdraw: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 100.0,
      description: "Description Test"
    }

    const userStatementWithdraw = await createStatementsUseCase.execute(statementWithdraw);

    expect(userStatementWithdraw).toHaveProperty("id");
  });

  it("should NOT be able to create a new withdraw to user with insuficient funds", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User Name Test",
        email: "User Email Test",
        password: "User Password test",
      });

      const statement: ICreateStatementDTO = {
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 100.0,
        description: "Description Test"
      }
      await createStatementsUseCase.execute(statement);

      const statementWithdraw: ICreateStatementDTO = {
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 150.0,
        description: "Description Test"
      }

      await createStatementsUseCase.execute(statementWithdraw);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

});
