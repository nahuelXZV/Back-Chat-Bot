require('dotenv').config();

const config = {
  APP_NAME: process.env.APP_NAME || 'API Express',
  APP_PROD: process.env.APP_PROD || 'false',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  PORT: process.env.PORT || 3000,

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:8080',

  KEY_FACEBOOK: process.env.KEY_FACEBOOK || 'key',
  KEY_VALIDATION: process.env.KEY_VALIDATION || 'key',
  TOKEN_POST: process.env.TokenPost || 'key',

  PROYECT_ID: process.env.PROYECT_ID || '',
  GOOGLE_APPLICATION_CREDENTIALS:
    process.env.GOOGLE_APPLICATION_CREDENTIALS || '',

  DB_URL: process.env.DB_URL || '',

  API_KEY: process.env.API_KEY || '',
  JWT_AUTH: process.env.JWT_AUTH || '',
  JWT_RECOVERY: process.env.JWT_RECOVERY || '',

  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || '',
  SMTP_EMAIL: process.env.SMTP_EMAIL || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
};

module.exports = config;
