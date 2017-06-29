// gcloud beta functions deploy getDevices --stage-bucket slurpme --trigger-http

const Datastore = require('@google-cloud/datastore');
const projectId = 'slurp-165217';
const datastore = Datastore({
  projectId: projectId
});

exports.getDevices = function getDevices (req, res) {
  let room = parseInt(req.query.room) || 'test_garage';

  const query = datastore.createQuery('device_measure')
  .filter('room_id', room)
  .order('timestamp', {
    descending: true
  })
  .limit(8);

  datastore.runQuery(query)

  .then((results) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(results)
  });

}
