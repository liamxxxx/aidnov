const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const globalErrorHandler = require('./controllers/errorController');
const cors = require('cors');


const app = express();


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serving static files

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Parse data to the cookies
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// ROUTES REQUIRES
const campagne = require('./routes/campagne');
const comment = require('./routes/commentaire');
const donateur = require('./routes/donateur');
const users = require('./routes/utlisateur');
const views = require('./routes/view');

// ROUTES 
app.use('/', views);
app.use('/api/v1/campagnes', campagne);
app.use('/api/v1/comments', comment);
app.use('/api/v1/donation', donateur);
app.use('/api/v1/users', users);

app.all('*', (req, res) => {
  res.redirect('/')
});

app.use(globalErrorHandler);



module.exports = app;

