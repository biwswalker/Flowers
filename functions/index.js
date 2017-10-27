const functions = require('firebase-functions');

// const sendgrid = require('sendgrid')
// const client = sendgrid("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")

const sendgrid = require('sendgrid')(
  process.env.SENDGRID_API_KEY || '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'
);

function parseBody(body) {
  var helper = sendgrid.mail;
  var fromEmail = new helper.Email(body.from);
  var toEmail = new helper.Email(body.to);
  var subject = body.subject;
  var content = new helper.Content('text/html', body.content);
  var mail = new helper.Mail(fromEmail, subject, toEmail, content);
  return mail.toJSON();
}

exports.httpEmail = functions.https.onRequest((req, res) => {
  res.send("GGWP");
  res.send(req.body);
  // return Promise.resolve()
  //   .then(() => {
  //     console.log(req.method);
  //     if (req.method !== 'POST') {
  //       const error = new Error('Only POST requests are accepted');
  //       error.code = 405;
  //       throw error;
  //     }

  //     const request = client.emptyRequest({
  //       method: 'POST',
  //       path: '/v3/mail/send',
  //       body: parseBody(req.body)
  //     });

  //     return client.API(request);
  //   }).then((response) => {
  //     if (response.body) {
  //       res.send(response.body);
  //     } else {
  //       res.end();
  //     }
  //   }).catch((err) => {
  //     console.error(err);
  //     return Promise.reject(err);
  //   })
})




function sendMail() {
  const mailRequest = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [{
        to: [{ email: 'jannarong.san@gmail.com' }],
        subject: 'Greenwich Test'
      }],
      from: { email: 'noreply@flowers-flow.firebaseapp.com' },
      content: [{
        type: 'text/plain',
        value: 'Hello Joe! Can you hear me! Is the line still getting through?'
      }]
    }
  });

  sg.API(mailRequest, function (error, response) {
    if (error) {
      console.log('Mail not sent; see error message below.');
    } else {
      console.log('Mail sent successfully!');
    }
    console.log(response);
  });
}
