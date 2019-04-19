"use strict";

const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const JSON_INDENT = 2;
const { log } = console;

// Adapted from:
// https://github.com/nicekiwi/lowdb-adapter-aws-s3/blob/master/src/main.js
class AwsAdapter {
  constructor({ remoteFile, remoteBucket, data }) {
    this.remoteFile = remoteFile;
    this.remoteBucket = remoteBucket;
    this.origData = data;
  }

  read() {
    // eslint-disable-next-line promise/avoid-new
    return new Promise((resolve, reject) => {
      log({
        msg: "Getting data",
        remoteBucket: this.remoteBucket,
        remoteFile: this.remoteFile
      });
      s3.getObject({
        Bucket: this.remoteBucket,
        Key: this.remoteFile
      })
        .promise()
        .then((data) => resolve(JSON.parse(data.Body)))
        .catch((err) => {
          if (err.code === "NoSuchKey") {
            log({
              msg: "No data. Writing fresh data.",
              remoteBucket: this.remoteBucket,
              remoteFile: this.remoteFile
            });

            // eslint-disable-next-line promise/no-nesting
            return this.write(this.origData)
              .then(() => resolve(this.origData))
              .catch(reject);
          }

          return reject(err);
        });
    });
  }

  write(data) {
    log({
      msg: "Writing data.",
      remoteBucket: this.remoteBucket,
      remoteFile: this.remoteFile
    });
    return s3.putObject({
      Body: JSON.stringify(data, null, JSON_INDENT),
      Bucket: this.remoteBucket,
      Key: this.remoteFile,
      ContentType: "application/json",
      ACL: "private"
    }).promise();
  }
}

module.exports = AwsAdapter;
