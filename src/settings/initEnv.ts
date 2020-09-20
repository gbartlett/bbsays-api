import * as dotenv from "dotenv";
import * as fs from "fs";
import path from "path";

const projectRoot = path.resolve(__dirname, "../..");

if (fs.existsSync(".env")) {
	// eslint-disable-next-line no-console
	console.log("Using local env file");
	dotenv.config({ path: ".env", debug: true });
} else if (fs.existsSync(path.dirname(`${projectRoot}/.env.example`))) {
	dotenv.config({ path: `${projectRoot}/.env.example` });
} else {
	throw new Error("No .env file found");
}

if (!process.env.HOST) {
	process.env.HOST = "0.0.0.0";
}

if (!process.env.PORT) {
	process.env.PORT = "8081";
}

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = "development";
}

const CUSTOM_ENV_VARS_REQ = [
	"HOST",
	"PORT",
	"DB_USER",
	"DB_HOST",
	"DB_DATABASE",
	"DB_PASSWORD",
	"DB_PORT",
	"JWT_SECRET",
];

const missingVars: string[] = CUSTOM_ENV_VARS_REQ.reduce((missing, envVar) => {
	if (!process.env[envVar]) {
		missing.push(envVar);
	}
	return missing;
}, [] as string[]);

if (missingVars.length) {
	throw new Error(`Env vars missing: ${missingVars.join(", ")}`);
}
