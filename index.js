require('dotenv').config();
const axios = require('axios');
const nodemailer = require('nodemailer');

const handler = async () => {
  try {
    // validate env
    const walletAddress = process.env.WALLET_ADDRESS;
    const alertThreshold = Number(process.env.ALERT_THRESHOLD_PERCENTAGE);
    if (!walletAddress || alertThreshold < 0 || alertThreshold > 100) {
      console.error('environment configured incorrectly');
      return;
    } else {
      console.log(`Alert Threshold: ${alertThreshold}%`);
    }
    // query Compound API
    let response = await axios.get(
      `https://api.compound.finance/api/v2/account?addresses=${process.env.WALLET_ADDRESS}`
    );
    // ensure account accuracy
    const account = response.data.accounts[0];
    if (
      account.address.toUpperCase() != process.env.WALLET_ADDRESS.toUpperCase()
    ) {
      console.error('Account not found');
      return;
    }
    // calculate utilization
    const borrowValue = account.total_borrow_value_in_eth.value;
    const collateralValue = account.total_collateral_value_in_eth.value;
    const utilization = ((borrowValue / collateralValue) * 100).toFixed(2);
    if (utilization < alertThreshold) {
      console.log(`Utilization Okay: ${utilization}%`);
    } else {
      sendAlertMail(utilization);
    }
  } catch (err) {
    console.error(JSON.stringify(err));
  }
};

const sendAlertMail = (utilization) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PW,
    },
  });
  var mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: '!!COMPOUND ALERT!!',
    text: `UTILIZATION: ${utilization}%`,
    headers: {
      priority: 'high',
    },
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

handler();
