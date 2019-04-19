"use strict";

const express = require("express");

const DEFAULT_PORT = 3000;
const PORT = parseInt(process.env.SERVER_PORT || DEFAULT_PORT, 10);
const HOST = process.env.SERVER_HOST || "0.0.0.0";

// The base app for any use...
const app = express();

// Settings
app.set("json spaces", 2); // eslint-disable-line no-magic-numbers

// Root.
// Ex: http://127.0.0.1:3000/hello.json
// => `{"hello":"static REST world!"}`
app.use("/hello.json", (req, res) => {
  res.json({
    msg: "Simple reference serverless app!"
  });
});
app.use("*", (req, res) => {
  res.send(`
<html>
  <body>
    <h1>Doggos!</h1>
    <p>A simple REST API.</p>
  </body>
</html>
  `);
});

// LAMBDA: Export handler for lambda use.
let handler;
module.exports.handler = (event, context, callback) => {
  // Lazy require `serverless-http` to allow non-Lambda targets to omit.
  // eslint-disable-next-line global-require
  handler = handler || require("serverless-http")(app);
  return handler(event, context, callback);
};

// DOCKER/DEV/ANYTHING: Start the server directly.
if (require.main === module) {
  const server = app.listen({
    port: PORT,
    host: HOST
  }, () => {
    const { address, port } = server.address();

    // eslint-disable-next-line no-console
    console.log(`Server started at http://${address}:${port}`);
  });
}
