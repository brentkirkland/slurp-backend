// gcloud beta functions deploy postMeasures --stage-bucket slurpme --trigger-topic slurpBoxMeasures
const Datastore = require('@google-cloud/datastore');
const PubSub = require('@google-cloud/pubsub');
const projectId = 'slurp-165217';
import { admin_num, customer_num, twilio_num, accountSid, authToken } from './ignores'

var client = new twilio(accountSid, authToken);


const datastore = Datastore({
  projectId: projectId
});

function sendMessage (body) {

  // client.messages.create({
  //         to: customer_num,
  //         from: twilio_num,
  //         body: body
  // })
  // .then((message) => console.log(message));
  client.messages.create({
          to: admin_num,
          from: twilio_num,
          body: body
  })
  .then((message) => console.log(message));
}


exports.postMeasures = function postMeasures (event, callback) {
  console.log(event.data)

  sendMessage('sup!')

  callback();
}
