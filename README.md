# Compound Monitor

Liquidation sucks. Avoid liquidation using Compound Monitor.
<br>
<br>Compound Monitor is an [AWS Lambda](https://aws.amazon.com/lambda/) function that monitors [Compound Finance](https://compound.finance/) utilization and sends an alert email once the utilization threshold percentage has been reached.

## Installation

```bash
git clone https://github.com/amperry/compound-monitor.git
npm install
```

## Configuration

- Create a new AWS Lambda function named 'compound-monitor' with a basic [execution role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html) (access to CloudWatch logs optional) and the necessary environment variables.
- Configure an [Amazon EventBridge Rule](https://docs.aws.amazon.com/eventbridge/latest/userguide/create-eventbridge-scheduled-rule.html) to trigger function at regular interval (suggested: every 5 minutes).

## Deployment

The repo includes npm scripts for packaging and deploy:

```bash
npm run package
npm run deploy
```

## Environment Variables

Include the following environment variables when creating your AWS Lambda function:

```text
WALLET_ADDRESS=0x...
ALERT_THRESHOLD_PERCENTAGE=75
GMAIL_USER=
GMAIL_PW=
```

- #### WALLET_ADDRESS
  > The wallet address holding a compound finance position that is to be monitored.
- #### ALERT_THRESHOLD_PERCENTAGE
  > The utilization percentage that when exceeded, will trigger an alert email once per function invocation.
- #### GMAIL_USER / GMAIL_PW
  > Gmail credentails used by nodemailer to send the email.

## License

[MIT](https://choosealicense.com/licenses/mit/)
