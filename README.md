# Soilwatch Backend

This repo contains all Google Cloud related functions.

This repo is weirdly a bunch of repos. These are all Google Cloud Functions. They are awesome little npm packages that are quick to deploy.

## get-devices

This is an endpoint that gets all the registered devices and their data such as room-id, battery, firmware, last-watered, and other great data.

## get-room

This is just a quick endpoint to get a rooms data.

## process-measures

This is a PubSub trigger that then texts me about average room temperature and then writes the data to Datastore.

## pub-endpoint

This endpoint puts each message into PubSub. The reason I went with PubSub instead of directly writing to the DB, was to possibly allow for a worker to handle more dataprocessing, then write to the DB. It's an idea that's not fully flushed out yet...

## Todo:
* oAuth. Make every request secure, safe, and user specifc.
* Better error handling
* Implement worker for better data processing.
=======
# slurp-backend
