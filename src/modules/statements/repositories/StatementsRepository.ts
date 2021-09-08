import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type,

    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<{ balance: number } | { balance: number, statement: Statement[] }> {

    // Recuperando statements do usuario
    const statement = await this.repository.find({
      where: { user_id }
    });

    // Operacionando valores
    // ACC: valor anterior percorrido do array
    // operation: valor atual no array
    const balance = statement.reduce((prevValue, currentStatement) => {

      if (currentStatement.type === 'deposit') {
        return prevValue + currentStatement.amount;

      } else if (currentStatement.type === 'transfer' && currentStatement.sender_id === user_id) {

        return Number(prevValue - currentStatement.amount);

      } else if (currentStatement.type === 'transfer' && currentStatement.user_id === user_id) {

        return Number(prevValue + currentStatement.amount);

      } else {
        return prevValue - currentStatement.amount;
      }

    }, 0)

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }
}
