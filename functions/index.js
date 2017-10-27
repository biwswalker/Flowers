const functions = require("firebase-functions");

exports.httpMailGun = functions.https.onRequest((req, res) => {
  let api_key = 'key-20b037c15421f85bea6d6d0a2e9315c0';
  let domain = 'sandbox9e1a705e25bd48fc9cbad3d9d02edbab.mailgun.org';
  let mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

  var data = {
    from: 'Mail Gun TutsDaddy <postmaster@sandbox9e1a705e25bd48fc9cbad3d9d02edbab.mailgun.org>',
    to: 'jannarong.san@gmail.com',
    subject: 'WTF',
    text: 'Test WTF THIS Is.'
  }

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
});
