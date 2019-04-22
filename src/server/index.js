"use strict";

const fs = require("fs");
const { promisify } = require("util");
const { resolve } = require("path");
const jsonServer = require("json-server");
const dogs = require("dogs/dogs.json");

const existsP = promisify(fs.exists);
const writeFileP = promisify(fs.writeFile);

const ORIG_DATA = { dogs };
const DEFAULT_PORT = 3000;
const JSON_INDENT = 2;
const PORT = parseInt(process.env.SERVER_PORT || DEFAULT_PORT, 10);
const HOST = process.env.SERVER_HOST || "0.0.0.0";
const STAGE = process.env.STAGE || "localdev";
const { SERVICE_NAME, AWS_REGION } = process.env;
const isLocaldev = STAGE === "localdev";
const remoteFile = "db.json";
const remoteBucket = `tf-fmd-${SERVICE_NAME}-${STAGE}-${AWS_REGION}-data`;

const localDbPath = ({ isLambda }) =>
  resolve(`.db-${STAGE}-${isLambda ? "lambda" : "node"}.json`);

const { log } = console;

const ensureLocalDb = async ({ isLambda, reset }) => {
  const localDb = localDbPath({ isLambda });

  // Check if already exists.
  if (!reset) {
    const localExists = await existsP(localDb);
    if (localExists) {
      log({ msg: `Found existing local db at: ${localDb}` });
      return localDb;
    }
  }

  // Otherwise, create from scratch.
  log({ msg: `Writing fresh local db at: ${localDb}` });
  await writeFileP(localDb, JSON.stringify(ORIG_DATA, null, JSON_INDENT));
  return localDb;
};

const getAdapter = async ({ isLambda }) => {
  if (isLocaldev) {
    return await ensureLocalDb({ isLambda });
  }

  const AwsAdapter = require("lowdb-adapter-aws-s3"); // eslint-disable-line global-require
  const storage = new AwsAdapter(remoteFile, {
    defaultValue: ORIG_DATA,
    aws: { bucketName: remoteBucket }
  });

  const low = require("lowdb"); // eslint-disable-line global-require
  return await low(storage);
};

let app;
const createApp = async ({ isLambda }) => {
  // Memoize.
  if (app) { return app; }

  // The base app + configuration.
  app = jsonServer.create();
  app.set("json spaces", JSON_INDENT);
  app.use(jsonServer.defaults({ }));

  // Pass through initial untouched dogs object for debugging ease
  app.use("/dogs.json", (req, res) => res.json(dogs));

  // Create router / internal db, configure, and enable.
  const adapter = await getAdapter({ isLambda });
  const router = jsonServer.router(adapter);
  router.db._.id = "key";
  app.use(router);

  // Reset data to initial state
  app.use("/reset", async (req, res) => {
    // Set persistent storage (only needed on local disk).
    if (isLocaldev) {
      await ensureLocalDb({ isLambda, reset: true });
    }

    // Reset in-memory database.
    await router.db.setState(ORIG_DATA);
    res.json({ msg: "Database reset" });
  });

  return app;
};

// LAMBDA: Export handler for lambda use.
let handler;
module.exports.handler = async (event, context) => {
  if (!handler) {
    await createApp({ isLambda: true });
    handler = require("serverless-http")(app); // eslint-disable-line global-require
  }

  return handler(event, context);
};

// DOCKER/DEV/ANYTHING: Start the server directly.
if (require.main === module) {
  (async () => {
    await createApp({ isLambda: false });
    const server = app.listen({ port: PORT, host: HOST }, () => {
      const { address, port } = server.address();
      log(`Server started at http://${address}:${port}`);
    });
  })();
}
