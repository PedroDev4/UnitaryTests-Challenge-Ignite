import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersReposiotory: InMemoryUsersRepository;

describe("Should be able to list all authenticated users profile", () => {
  beforeEach(() => {
    inMemoryUsersReposiotory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersReposiotory);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersReposiotory);
  });

  it("should be able to list a user profile", async () => {

    const user = await createUserUseCase.execute({
      name: "User Name",
      email: "User Email",
      password: "User Password",
    });

    //console.log(user);

    const userFinded = await showUserProfileUseCase.execute(user.id);

    expect(userFinded).toHaveProperty("id");
    expect(userFinded).toHaveProperty("name");
    expect(userFinded).toHaveProperty("email");
    expect(userFinded).toHaveProperty("password");
  });

  it("Should not be able to show profile of a non-exinsting user", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User Name",
        email: "User Email",
        password: "User Password",
      });

      await showUserProfileUseCase.execute("fakeId");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

});
