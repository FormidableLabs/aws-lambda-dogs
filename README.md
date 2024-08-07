[![AWS Lambda Dogs REST API — Formidable, We build the modern web](https://raw.githubusercontent.com/FormidableLabs/aws-lambda-dogs/main/aws-lambda-dogs-Hero.png)](https://formidable.com/open-source/)

[![Maintenance Status][maintenance-image]](#maintenance-status)

A simple REST API for our beloved [formidadogs][] using [json-server][] and [serverless][].

## Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Usage](#usage)
- [Development](#development)
- [API](#api)
  - [Authentication](#authentication)
  - [Examples](#examples)
    - [Localdev](#localdev)
    - [Staging](#staging)
    - [Production](#production)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage

The infrastructure, deployment, and operational parts of this project are identical to [aws-lambda-serverless-reference][]. Follow the entire guide there.

> _Note_: When packaging/deploying the serverless application you'll not only need the normal `STAGE`, etc. environment variables in that guide but will also need a `API_KEY_SECRET` value.

## Development

Run in memory with persistence to local disk.

```sh
# nodemon (`.db-localdev-lambda.json`): http://localhost:3000
$ yarn node:localdev

# serverless-offline (`.db-localdev-node.json`): http://localhost:3001/localdev/
# We use a temp value for API_KEY_SECRET (can pick anything).
$ API_KEY_SECRET=localdev yarn lambda:localdev
```

## API

### Authentication

To prevent miscreants entering mean information about our doggos, we require an API key header to mutate the underlying mutable, persistent data. Without this key, only `GET` requests are supported against the **original** unchanged dogs data.

To switch to "read-write + persistent" mode, add this header to all requests `x-dogs-api-key: <key>`. For Formidables, the key for each environment (sandbox, development, staging, production) is stored in our 1Password IC vault under the entry `aws-lambda-dogs keys`.

A new key can be generated by running the command `openssl rand -hex 16`.

The key needs to be provided during deployment in the API_KEY_SECRET environment variable.

```sh
$ STAGE=sandbox \
  API_KEY_SECRET=<sandbox key> \
  aws-vault exec FIRST.LAST-developer --no-session -- \
  yarn lambda:deploy
```

### Examples

#### Localdev

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
  --header "x-dogs-api-key: <key>"

$ curl "http://localhost:3000/dogs/cLnG8C2d_" \
  --header "x-dogs-api-key: <key>"

# Reset the read-write datastore back to original state.
$ curl -X POST "http://localhost:3000/reset" \
  --header "x-dogs-api-key: <key>"
```

#### Staging

Some sample Lambda workflows (for `sandbox` environment, which may get nuked/recreated at any time):

```sh
# First, check the Sandbox info (currently `30lxcuxu8d`)
$ STAGE=sandbox \
  aws-vault exec FIRST.LAST-developer --no-session -- \
  yarn lambda:info

# All the doggos
$ curl "https://30lxcuxu8d.execute-api.us-east-1.amazonaws.com/sandbox/dogs"

# Just Rusty by ID
$ curl "https://30lxcuxu8d.execute-api.us-east-1.amazonaws.com/sandbox/dogs/cLnG8C2d_"

# Update Rusty's name in read-write datastore.
$ curl -X PATCH "https://30lxcuxu8d.execute-api.us-east-1.amazonaws.com/sandbox/dogs/cLnG8C2d_" \
  --data name="Rustinus B. Rutherford" \
  --header "x-dogs-api-key: <key>"

$ curl "https://30lxcuxu8d.execute-api.us-east-1.amazonaws.com/sandbox/dogs/cLnG8C2d_" \
  --header "x-dogs-api-key: <key>"

# Reset the read-write datastore back to original state.
$ curl -X POST "https://30lxcuxu8d.execute-api.us-east-1.amazonaws.com/sandbox/reset" \
  --header "x-dogs-api-key: <key>"
```

#### Production

For production, we have a custom mapping of `https://HASH.execute-api.us-east-1.amazonaws.com/production/` to `https://dogs.formidable.dev/`.

```sh
# All the doggos
$ curl "https://dogs.formidable.dev/dogs"

# Just Rusty by ID
$ curl "https://dogs.formidable.dev/dogs/cLnG8C2d_"

# Update Rusty's name in read-write datastore.
$ curl -X PATCH "https://dogs.formidable.dev/dogs/cLnG8C2d_" \
  --data name="Rustinus B. Rutherford" \
  --header "x-dogs-api-key: <key>"

$ curl "https://dogs.formidable.dev/dogs/cLnG8C2d_" \
  --header "x-dogs-api-key: <key>"

# Reset the read-write datastore back to original state.
$ curl -X POST "https://dogs.formidable.dev/reset" \
  --header "x-dogs-api-key: <key>"
```

Also note to deploy, you will need a privileged user. Please talk to the ops team to make sure you've got the right credentials.

[formidadogs]: https://github.com/FormidableLabs/dogs
[json-server]: https://github.com/typicode/json-server
[serverless]: https://serverless.com/
[serverless-http]: https://github.com/dougmoscrop/serverless-http
[aws-lambda-serverless-reference]: https://github.com/FormidableLabs/aws-lambda-serverless-reference


## Maintenance Status

**Archived:** This project is no longer maintained by Formidable. We are no longer responding to issues or pull requests unless they relate to security concerns. We encourage interested developers to fork this project and make it their own!

[maintenance-image]: https://img.shields.io/badge/maintenance-archived-red.svg
