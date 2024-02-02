---
title: "Use AWS CLI SSO Login"
date: 2022-09-19
draft: false
tags: [shell, aws, til]
url: login-using-aws-sso
summary: this is a sample summary, This creates the NamedProfile if it did not already exist. An entry should be added to your
---

Use the AWS CLI to manage login credentials for SSO-managed accounts. You no longer have to update access keys several times a day.

To get started, log in using SSO and navigate to the AWS SSO Portal. Make note of the SSO portal URL, which looks similar too:

```shell
https://d-123abcd4e6.awsapps.com/start
```

Create an [AWS Named Profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) for each account you want to configure. Use the `--profile` flag or export the `AWS_PROFILE` environment variable:

```shell
export AWS_PROFILE=work-dev-profile
```

Use the [configure command to setup SSO](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html) access for the Named Profile:

```shell
aws configure sso
```

This creates the NamedProfile if it did not already exist. An entry should be added to your `~/.aws/config`:

```shell
[profile work-dev-profile]
sso_start_url = https://d-123abcd4e6.awsapps.com/start
sso_region = us-east-1
sso_account_id = 123456789012
sso_role_name = Work-Dev-SSO
region = us-east-1
```

Log in, using:

```shell
aws sso login
```

Validate your connection details have been configured properly by running:

```shell
aws sts caller-identity
```

Repeat for other accounts.
