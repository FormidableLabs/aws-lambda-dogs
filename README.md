AWS Lambda Dogs REST API
========================

A simple REST API for our beloved [formidadogs][] using [json-server][] and [serverless][].

## Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
- [Development](#development)
- [API](#api)
  - [Authentication](#authentication)
  - [Examples](#examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

### Authentication

To prevent miscreants entering mean information about our doggos, we require an API key header to mutate the underlying mutable, persistent data. Without this key, only `GET` requests are supported against the **original** unchanged dogs data.

To switch to "read-write + persistent" mode, add this header to all requests `x-dogs-api-key: 534d2ce3c021f7eb0a3eff708b981a40`. (_Note_: for simplicity, we've hardcoded a dummy value that we could change later).

### Examples

These examples use `node:localdev` at `http://localhost:3000` but you can adjust them easily for `lambda:localdev` or the real API at `yarn lambda:info`:

```sh
# All the doggos
$ curl "http://localhost:3000/dogs"

# 5 doggos
$ curl "http://localhost:3000/dogs?_start=0&_end=4"

# Just Rusty by ID
$ curl "http://localhost:3000/dogs/cLnG8C2d_"

# Searches for Rusty
$ curl "http://localhost:3000/dogs?name=Rusty"
$ curl "http://localhost:3000/dogs?q=rust"

# Update Rusty's name in read-write datastore.
$ curl -X PATCH "http://localhost:3000/dogs/cLnG8C2d_" \
  --data name="Rustinus B. Rutherford" \
  --header "x-dogs-api-key: 534d2ce3c021f7eb0a3eff708b981a40"

$ curl "http://localhost:3000/dogs/cLnG8C2d_" \
  --header "x-dogs-api-key: 534d2ce3c021f7eb0a3eff708b981a40"

# Reset the read-write datastore back to original state.
$ curl -X POST "http://localhost:3000/reset" \
  --header "x-dogs-api-key: 534d2ce3c021f7eb0a3eff708b981a40"
```

Some sample Lambda workflows (for `sandbox` environment, which may get nuked/recreated at any time):

```sh
# All the doggos
$ curl "https://elei8f5o59.execute-api.us-east-1.amazonaws.com/sandbox/dogs"

# Just Rusty by ID
$ curl "https://elei8f5o59.execute-api.us-east-1.amazonaws.com/sandbox/dogs/cLnG8C2d_"

# Update Rusty's name in read-write datastore.
$ curl -X PATCH "https://elei8f5o59.execute-api.us-east-1.amazonaws.com/sandbox/dogs/cLnG8C2d_" \
  --data name="Rustinus B. Rutherford" \
  --header "x-dogs-api-key: 534d2ce3c021f7eb0a3eff708b981a40"

$ curl "https://elei8f5o59.execute-api.us-east-1.amazonaws.com/sandbox/dogs/cLnG8C2d_" \
  --header "x-dogs-api-key: 534d2ce3c021f7eb0a3eff708b981a40"

# Reset the read-write datastore back to original state.
$ curl -X POST "https://elei8f5o59.execute-api.us-east-1.amazonaws.com/sandbox/reset" \
  --header "x-dogs-api-key: 534d2ce3c021f7eb0a3eff708b981a40"
```

[formidadogs]: https://github.com/FormidableLabs/dogs
[json-server]: https://github.com/typicode/json-server
[serverless]: https://serverless.com/
[serverless-http]: https://github.com/dougmoscrop/serverless-http
[aws-lambda-serverless-reference]: https://github.com/FormidableLabs/aws-lambda-serverless-reference
