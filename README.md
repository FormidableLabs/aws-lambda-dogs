AWS Lambda Dogs REST API
========================

A simple REST API for our beloved [formidadogs][] using [json-server][] and [serverless][].

## Usage

The infrastructure, deployment, and operational parts of this project are identical to [aws-lambda-serverless-reference][]. Follow the entire guide there.

## Development

Run in memory with persistence to local disk.

```sh
# nodemon (`.db-localdev-lambda.json`): http://localhost:3000
$ yarn node:localdev

# serverless-offline (`.db-localdev-node.json`): http://localhost:3001
$ yarn lambda:localdev
```

## API

These examples use `node:localdev` at `http://localhost:3000` but you can adjust them easily for `lambda:localdev` or the real API at `yarn lambda:info`:

```sh
# All teh doggos
$ curl "http://localhost:3000/dogs"

# 5 doggos
$ curl "http://localhost:3000/dogs?_start=0&_end=4"

# Just Rusty by ID
$ curl "http://localhost:3000/dogs/cLnG8C2d_"

# Searches for Rusty
$ curl "http://localhost:3000/dogs?name=Rusty"
$ curl "http://localhost:3000/dogs?q=rust"

# Update Rusty's name
$ curl -X PATCH "http://localhost:3000/dogs/cLnG8C2d_" \
  --data name="Rustinus B. Rutherford"

# Reset the database back to original state
$ curl -X POST "http://localhost:3000/reset"
```

Some sample Lambda workflows (for `sandbox` environment, which may get nuked/recreated at any time):

```sh
# All teh doggos
$ curl "https://elei8f5o59.execute-api.us-east-1.amazonaws.com/sandbox/dogs"

# Just Rusty by ID
$ curl "https://elei8f5o59.execute-api.us-east-1.amazonaws.com/sandbox/dogs/cLnG8C2d_"

# Update Rusty's name
$ curl -X PATCH "https://elei8f5o59.execute-api.us-east-1.amazonaws.com/sandbox/dogs/cLnG8C2d_" \
  --data name="Rustinus B. Rutherford"

# Reset the database back to original state
$ curl -X POST "https://elei8f5o59.execute-api.us-east-1.amazonaws.com/sandbox/reset"
```

[formidadogs]: https://github.com/FormidableLabs/dogs
[json-server]: https://github.com/typicode/json-server
[serverless]: https://serverless.com/
[serverless-http]: https://github.com/dougmoscrop/serverless-http
[aws-lambda-serverless-reference]: https://github.com/FormidableLabs/aws-lambda-serverless-reference
