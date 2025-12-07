import dotenv from "dotenv";
dotenv.config({
  quiet: true,
  override: true,
  path: ".env",
  debug: process.env.NODE_ENV === "development",
});

const node_env: string = process.env.NODE_ENV!;
const pg_uri: string = process.env.PG_URI!;
const port: number = +process.env.SERVER_PORT!;
const max_requests: number = +process.env.MAX_REQUESTS!;

const max_requests_window: number = +process.env.MAX_REQUESTS_WINDOW!;
const clinetWhiteList: string[] =
  process.env.CLIENT_WHITELIST?.split(",") || [];
const accessTokenSecret: string = process.env.JWT_ACCESS_TOKEN_SECRET!;
const accessTokenExpiresIn: number = parseInt(
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "3600",
  10
);

const secret = {
  node_env,
  pg_uri,
  port,
  max_requests,
  max_requests_window,
  clinetWhiteList,
  jwt: {
    accessTokenSecret,
    accessTokenExpiresIn,
  },
};

export default secret;
