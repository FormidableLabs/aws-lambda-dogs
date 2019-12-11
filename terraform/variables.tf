variable "region" {
  description = "The deploy target region in AWS"
  default     = "us-east-1"
}

variable "stage" {
  description = "The stage/environment to deploy to. Suggest: `sandbox`, `development`, `staging`, `production`."
  default     = "development"
}

variable "service_name" {
  description = "Name of service / application"
}

locals {
  data_bucket_name     = "tf-fmd-${var.service_name}-${var.stage}-${var.region}-data"

  tags = "${map(
    "Service", "${var.service_name}",
    "Stage", "${var.stage}",
  )}"
}
