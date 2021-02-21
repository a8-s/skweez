/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require("firebase-admin");
admin.initializeApp({
  databaseURL: 'https://skweez.firebaseio.com/',
});
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const db = admin.app().database("https://skweez.firebaseio.com/");
// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Skweez Alerts';

// [START sendWelcomeEmail]
/**
 * Sends a welcome email to new user.
 */
// [START onCreateTrigger]
exports.sendWelcomeEmail = functions.database.instance("skweez").ref("/reports/{something}").onCreate(event => {
// [END onCreateTrigger]
  // [START eventAttributes]
  functions.logger.log(event);
  var time = Date.now();

  db.ref(event._path).update({"timestamp":time.toString()});

  const email = getMasterEmail();
  const displayName = getUserName(event);

  return sendWelcomeEmail(email, displayName);
});
// [END sendWelcomeEmail]

async function getUserName(event){
  var userID = await db.ref("/devices/"+ event._data.device + "/associated-user").once("value").then(data => {return data.val();});
  var displayName = await db.ref("/users/" + userID + "/name").once("value").then(data => {return data.val();});
  return displayName;
}
async function getMasterEmail(){
  var email = await db.ref("/config/alert-email").once("value").then(data => {return data.val();});
  return email;
}

// Sends a welcome email to the given user.
async function sendWelcomeEmail(recp, displayName) {
  var recp = await recp;
  var displayName = await displayName;

  const mailOptions = {
    from: `${APP_NAME} <skweezapp2021@gmail.com>`,
    to: `${recp}`,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `A User has sent a Skweez Report!`;
  mailOptions.text = `User ${displayName || ''} has sent a Skweez report! Log in to the Skweez Dashboard to view recent reports!`;
  await mailTransport.sendMail(mailOptions);
  console.log('email', recp);
  return null;
}

