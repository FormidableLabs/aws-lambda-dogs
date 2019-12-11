resource "aws_s3_bucket" "data" {
  bucket = "${local.data_bucket_name}"
  acl    = "private"
  tags   = "${local.tags}"
}

data "aws_iam_policy_document" "data_access" {
  statement {
    actions = [
      "s3:ListBucketVersions",
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:DeleteObject",
    ]

    resources = [
      "${aws_s3_bucket.data.arn}",
      "${aws_s3_bucket.data.arn}/*",
    ]
  }
}

resource "aws_iam_policy" "data_access" {
  name   = "${local.data_bucket_name}"
  path   = "/"
  policy = "${data.aws_iam_policy_document.data_access.json}"
}

resource "aws_iam_role_policy_attachment" "data_access" {
  role       = "${module.serverless.lambda_role_name}"
  policy_arn = "${aws_iam_policy.data_access.arn}"
}
