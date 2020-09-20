import * as pg from "pg";

const pool = new pg.Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncQuery = <R extends pg.QueryResultRow = any, I extends any[] = any[]>(
	queryTextOrConfig: string,
	values: I
) => Promise<pg.QueryResult<R>>;

interface HalpPoolClient {
	lastQuery?: {
		text: string;
	};
	query: AsyncQuery;
	release(err?: Error | boolean): void;
}

type DB = {
	query: AsyncQuery;
	getClient: () => Promise<{
		client: HalpPoolClient;
		release: (err?: Error | boolean) => void;
	}>;
};

pool.on("error", (err) => {
	// eslint-disable-next-line no-console
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

export const DB: DB = {
	query: async (text, values) => {
		const result = await pool.query(text, values);
		return result;
	},
	getClient: async () => {
		const client = (await pool.connect()) as HalpPoolClient;
		const query = client.query;
		const done = client.release;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const monkeyPatchedQuery = (text: string, values: any[]) => {
			client.lastQuery = { text };
			return query.apply(client, [text, values]);
		};
		client.query = monkeyPatchedQuery as AsyncQuery;

		const timeout = setTimeout(() => {
			// eslint-disable-next-line no-console
			console.error("A client has been checked out for more than 5 seconds!");
			// eslint-disable-next-line no-console
			console.error(
				`The last executed query on this client was: ${client.lastQuery}`
			);
		}, 5000);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const release = (error?: Error | boolean) => {
			done(error);
			clearTimeout(timeout);
			client.query = query;
		};

		return { client, release };
	},
};
