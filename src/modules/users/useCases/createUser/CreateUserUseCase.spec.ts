import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user", async () => {
    const user = {
      name: "User Test",
      email: "User Email",
      password: "User password",
    };

    await createUserUseCase.execute(user);

    const userCreated = await inMemoryUsersRepository.findByEmail(
      user.email
    );

    expect(userCreated).toHaveProperty("id");
  });

  it("Should not ne able to crete a new user with an existing email", async () => {
    const user = {
      name: "User Test",
      email: "User Email",
      password: "User password",
    };

    await createUserUseCase.execute(user);
    await expect(createUserUseCase.execute(user)).rejects.toBeInstanceOf(CreateUserError);
  });
});