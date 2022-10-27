const config = require('../config/config');
const cors = require('cors');

const whiteList = [config.FRONTEND_URL]; // Whitelist

/*const corsOptions = {
  origin: (origin, callback) => {
    const existe = whiteList.some((dominio) => dominio === origin);
    if (existe || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido'));
    }
  },
};*/

const corsOptions = {
  origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

module.exports = corsOptions;
