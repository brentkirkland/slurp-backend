// gcloud beta functions deploy pubEndpoint --stage-bucket slurpme --trigger-http


const PubSub = require('@google-cloud/pubsub');
const projectId = 'slurp-165217';

const pubsub = PubSub({
  projectId: projectId,
  retries: 5
});

function publishMessage (topicName, data) {

  // References an existing topic, e.g. "my-topic"
  const topic = pubsub.topic(topicName);

  return topic.publish(data)
    .then((results) => {
      const messageIds = results[0];
      console.log(`Message ${messageIds[0]} published.`);
      return messageIds;
    });
}

exports.pubEndpoint = function pubEndpoint (req, res) {

  // look for external ip!
  console.log('req', req)

  let topic = req.query.topic || undefined;
  let data = req.body || undefined;

  res.setHeader('Access-Control-Allow-Origin', '*')

  // TODO: Better error handling
  if (topic === undefined || data === undefined) {
    res.send('bad')
  } else {
    publishMessage(topic, data)
    res.send('ok')
  }

}
