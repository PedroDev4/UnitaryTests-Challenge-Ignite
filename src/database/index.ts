import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "localhost"): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions();
    return createConnection(
        Object.assign(defaultOptions, {
            database: process.env.NODE_ENV === "test" ? "finapi_test" : defaultOptions.database
        })
    )
}