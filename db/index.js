const config = require('config');
const r = require('rethinkdbdash')({
  servers: [
    config.get('rethinkdb'),
  ],
});

module.exports = r;
