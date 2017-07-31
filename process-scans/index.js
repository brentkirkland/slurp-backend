// gcloud beta functions deploy processScans --stage-bucket slurpme --trigger-topic processScans
const Datastore = require('@google-cloud/datastore');
const twilio = require('twilio');
const projectId = 'slurp-165217';
const ignores = require('./ignores')

var client = new twilio(ignores.accountSid, ignores.authToken);

const datastore = Datastore({
  projectId: projectId
});


exports.processScans = function processMeasures(event, callback) {

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
  var d = new Date()
  if (data.shouldText && d.getMinutes() < 11 && d.getHours() > 7 && d.getHours() < 23) {
    sendAvgTempMessage((parseInt(data.avgTemp)*9/5 + 32).toFixed(2))
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
      timestamp: data.timestamp,
      avg_temp: (parseInt(data.avgTemp)*9/5 + 32).toFixed(2),
      ip: data.ip
    }
  };

  console.log('ready to to write room info')

  datastore.save(task)
    .then(() => {
      console.log(`Saved ${task.key.name}`);
    });

  kind = 'device_scan'
  data.readings.map(function(reading, index) {

    name = eventId + reading.mac;
    taskKey = datastore.key([kind, name]);
    task = {
      key: taskKey,
      data: {
        temperature: reading.temperature,
        moisture: reading.moisture,
        light: reading.light,
        conductivity: reading.conductivity,
        battery: reading.battery,
        fw: reading.fw,
        timestamp: data.timestamp,
        room_id: data.room_id,
      }
    };

    console.log('ready to to write device info')

    datastore.save(task)
    .then(() => {
      console.log(`Saved ${task.key.name}`);
      });

  })

  callback();
}
