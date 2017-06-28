// gcloud beta functions deploy postMeasures --stage-bucket slurpme --trigger-topic slurpBoxMeasures
const Datastore = require('@google-cloud/datastore');
const PubSub = require('@google-cloud/pubsub');
const twilio = require('twilio');
const projectId = 'slurp-165217';
const ignores = require('./ignores')

var client = new twilio(ignores.accountSid, ignores.authToken);

const datastore = Datastore({
  projectId: projectId
});

function sendMessage (body) {

  // client.messages.create({
  //         to: ignores.customer_num,
  //         from: ignores.twilio_num,
  //         body: body
  // })
  // .then((message) => console.log(message));

  client.messages.create({
          to: ignores.admin_num,
          from: ignores.twilio_num,
          body: body
  })
  .then((message) => console.log(message));
}


exports.postMeasures = function postMeasures (event, callback) {
  console.log(event.data)

  sendMessage('sup!')

  callback();
}
