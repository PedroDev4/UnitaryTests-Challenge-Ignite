import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("Should not be able to authenticate a non-existing user", async () => {
    await expect(authenticateUserUseCase.execute({
      email: "user Email",
      password: "User passWord test",
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should be able to authenticate an exsisting user", async () => {
    const user = {
      name: "User Test2",
      email: "User Email2",
      password: "User password2",
    };

    await createUserUseCase.execute(user);

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(userAuthenticated).toHaveProperty("token");
    expect(userAuthenticated.user).toHaveProperty("id");
  });

  it("Should not be able to authenticate a user with an invalid password", async () => {
    const user = {
      name: "User Test",
      email: "User Email",
      password: "User password",
    };

    await createUserUseCase.execute(user);

    await expect(authenticateUserUseCase.execute({
      email: user.email,
      password: '321',
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});