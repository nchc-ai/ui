// ----------------  Variable  ----------------------//
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const queryString = require('query-string');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const config = require('./webpack.config.dev');

const app = express();


const isDev = process.env.NODE_ENV !== 'production';
let port;
let host;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('superSecret', 'daydream');
app.use(bodyParser.json());
app.use(methodOverride());
app.use(morgan('dev')); // 把每個請求都顯示在 console
app.use(cookieParser()); // 認證需要用到

// -------------------  Mode Selection  -------------------------//
if (isDev) {
	host = '0.0.0.0';
	port = 3010;
} else {
	host = '127.0.0.1';
	port = 80;
}
// -------------------  DB Connection  -------------------------//
require('./db')(app);
// 1. 套用express應用程式
app.use(morgan('dev'));  // 把每個請求都顯示在 console
app.use(cookieParser()); // 認證需要用到

// -------------------  Use middleware  -------------------------//

// app.use('/api', require('./routers/apiRoutes'));
// app.use('/', require('./routers/payment'));
app.use('/', require('./routers/website'));
// app.use('/', require('./routers/mailer'));
// app.use('/auth', require('./routers/auth'));
// app.use('/admin', require('./routers/admin'));

// -------------------  DEV vs RELEASE  -------------------------//

if (isDev) {
	const compiler = webpack(config);
	const middleware = webpackMiddleware(compiler, {
		publicPath: config.output.publicPath,
		contentBase: 'src',
		stats: 'errors-only',
	});
	app.use(express.static('public'));
	app.use(middleware);
	app.use(webpackHotMiddleware(compiler));
	app.get('*', (req, res) => {
		res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'build/index.html')));
		res.end();
	});
} else {
	app.use(express.static('public'));
	app.use(express.static(`${__dirname}/app/dist`));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'app/dist/index.html'));
	});
}
// -------------------  Error Handler -------------------------//
app.use((req, res) => {
	res.status(404);
	res.render('404.ejs', { title: '404: File Not Found' });
});
app.use((error, req, res) => {
	res.status(400);
	res.render('500.ejs', { title: '500: Internal Server Error', error });
});
// -------------------  Server  -------------------------//

app.listen(port, host, (err) => {
	if (err) {
		throw err;
	}
	console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});



// var express = require('express');
// var app = express();

// // set the port of our application
// // process.env.PORT lets the port be set by Heroku
// var port = process.env.PORT || 8080;

// // set the view engine to ejs
// app.set('view engine', 'ejs');

// // make express look in the public directory for assets (css/js/img)
// app.use(express.static(__dirname + '/public'));

// // set the home page route
// app.get('/', function(req, res) {

// 	// ejs render automatically looks in the views folder
// 	res.render('index');
// });

// app.get('/result', function(req, res) {

// 	// ejs render automatically looks in the views folder
// 	res.render('result');
// });

// app.listen(port, function() {
// 	console.log('Our app is running on http://localhost:' + port);
// });