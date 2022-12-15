const config = require('../config/config');
const db = require('mongoose');

db.Promise = global.Promise;

async function connect() {
  await db
    .connect(config.DB_URL, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('[db] Conectada con éxito');
    })
    .catch((err) => {
      console.error('[db] Could not connect to MongoDB');
      console.error(err);
    });
}

module.exports = connect;
