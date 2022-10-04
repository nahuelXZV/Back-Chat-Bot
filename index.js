const {
  logError,
  errorHandler,
  boomErrorHandler,
} = require('./middleware/errorHandler');
const mainRouter = require('./network/mainRouter'); // Load mainRouter
const corsOptions = require('./libs/cors');
const config = require('./config/config');
const express = require('express'); // Load Express
const bodyParser = require('body-parser'); // Load body-parser
const cors = require('cors');
const mongoose = require('./libs/mongoose'); // Load mongoose

const app = express();
const port = config.PORT;

mongoose(); // Connect to database

// Rutas
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors(corsOptions)); // Enable CORS

//require('./libs/auth'); // Load auth
app.get('/', (req, res) => res.send('The chat bot is working correctly!'));
mainRouter(app); // Load mainRouter

// Middlewares
app.use(logError);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`${config.APP_NAME} listening on port ${config.APP_URL}`)
);


