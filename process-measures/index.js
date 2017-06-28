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

  var eventId = event.eventId

  var data = JSON.parse(Buffer.from(event.data.data, 'base64').toString())
  if (data.shouldText) {
    sendAvgTempMessage(data.avgTemp)
  }

  // handle room data
  //TODO: make everything camel case

  var kind = 'room_measure'
  var name = eventId
  var taskKey = datastore.key([kind, name]);

  var task = {
    key: taskKey,
    data: {
      room_id: data.room_id,
      room_nickname: data.room_nickname,
      timestamp: data.timestamp,
      avg_temp: data.avgTemp,
      ip: data.ip
    }
  };

  console.log('ready to to write room info')

  datastore.save(task)
    .then(() => {
      console.log(`Saved ${task.key.name}`);
    });

  kind = 'device_measure'
  data.readings.map(function(reading, index) {

    name = eventId + reading.major;
    taskKey = datastore.key([kind, name]);
    task = {
      key: taskKey,
      data: {
        major: reading.major,
        minor: reading.minor,
        celcius: reading.celcius,
        fahrenheit: reading.fahrenheit,
        moisture: reading.moisture,
        lastWatered: reading.lastWatered,
        watered: reading.watered,
        timestamp: data.timestamp,
        room_id: data.room_id,
        device_nickname: reading.device_nickname
      }
    };

    console.log('ready to to write device info')

    datastore.save(task)
    .then(() => {
      console.log(`Saved ${task.key.name}`);
      });

    // if (watered) {
    //   // need to update last_watered
    // }

    // if lastWatered was an hour ago
    // and if the plant did not reach its max
    // increase watering time by x minutes

    // water-length || device_id || min || max || last_watered

  })





  callback();
}
