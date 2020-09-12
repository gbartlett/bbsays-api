import * as dotenv from "dotenv";
import * as fs from "fs";
import path from "path";

if (fs.existsSync(path.dirname(".env"))) {
  dotenv.config({ path: ".env" });
} else if (fs.existsSync(path.dirname(".env.example"))) {
  dotenv.config({ path: ".env.example" });
} else {
  throw new Error("No .env file found");
}

if (!process.env.HOST) {
  process.env.HOST = "0.0.0.0";
}

if (!process.env.PORT) {
  process.env.PORT = "8080";
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

const CUSTOM_ENV_VARS_REQ = ["HOST", "PORT"];
const missingVars: string[] = CUSTOM_ENV_VARS_REQ.reduce((missing, envVar) => {
  if (!process.env[envVar]) {
    missing.push(envVar);
  }
  return missing;
}, [] as string[]);

if (missingVars.length) {
  throw new Error(`Env vars missing: ${missingVars.join(", ")}`);
}
