provider "aws" {
  region = "${var.region}"
}

terraform {
  backend "s3" {
    key = "terraform.tfstate"
  }
}

module "serverless" {
  source = "FormidableLabs/serverless/aws"

  region       = "${var.region}"
  service_name = "${var.service_name}"
  stage        = "${var.stage}"
}
