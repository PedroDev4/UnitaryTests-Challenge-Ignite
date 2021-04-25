import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { IGetBalanceDTO } from "@modules/statements/useCases/getBalance/IGetBalanceDTO";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementsUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Getting Balance of an user", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementsUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("Should be able to get balance of user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Name Test",
      email: "User Email Test",
      password: "User Password test",
    });

    const statement1: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 150.0,
      description: "Description Test"
    }
    await createStatementsUseCase.execute(statement1);

    const statement2: ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 50.0,
      description: "Description Test"
    }
    await createStatementsUseCase.execute(statement2);

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    })

    expect(balance.statement.length).toBe(2);
    expect(balance.balance).toEqual(statement1.amount - statement2.amount);
  });

  it("Should NOT be able to get balance of a non existing user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "user_id example"
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });


})
