// gcloud beta functions deploy processMeasures --stage-bucket slurpme --trigger-topic processMeasures
const Datastore = require('@google-cloud/datastore');
const twilio = require('twilio');
const projectId = 'slurp-165217';
const ignores = require('./ignores')

var client = new twilio(ignores.accountSid, ignores.authToken);

const datastore = Datastore({
  projectId: projectId
});


exports.processMeasures = function processMeasures(event, callback) {

  function sendMessage(body) {

    client.messages.create({
        to: ignores.customer_num,
        from: ignores.twilio_num,
        body: body
      })
      .then((message) => console.log(message));

    client.messages.create({
        to: ignores.admin_num,
        from: ignores.twilio_num,
        body: body
      })
      .then((message) => console.log(message));
  }

  function sendAvgTempMessage(calcAvgTemp) {
    if (calcAvgTemp < 70) {
      sendMessage('room temp: ' + calcAvgTemp.toString() + ' 🤤');
    } else if (calcAvgTemp > 70 && calcAvgTemp < 80) {
      sendMessage('room temp: ' + calcAvgTemp.toString() + ' 😎');
    } else if (calcAvgTemp > 80 && calcAvgTemp < 90) {
      sendMessage('room temp: ' + calcAvgTemp.toString() + ' 😳');
    } else {
      sendMessage('room temp: ' + calcAvgTemp.toString() + ' 😡');
    }
  }
  // need to get event id
  console.log(event);
  var data = JSON.parse(Buffer.from(event.data.data, 'base64').toString())
  if (data.shouldText) {
    sendAvgTempMessage(data.avgTemp)
  }
  callback();
}
