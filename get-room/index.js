// gcloud beta functions deploy getRoom --stage-bucket slurpme --trigger-http

const Datastore = require('@google-cloud/datastore');
const projectId = 'slurp-165217';
const datastore = Datastore({
  projectId: projectId
});

exports.getRoom = function getDevices (req, res) {
  let room = parseInt(req.query.room) || 'test_garage';

  const query = datastore.createQuery('room_measure')
  .filter('room_id', room)
  .order('timestamp', {
    descending: true
  })
  .limit(1);

  datastore.runQuery(query)

  .then((results) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(results)
  });

}
