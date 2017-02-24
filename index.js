var koa = require('koa');
var app = koa();
var weather = require('./middleware').weather();
var config = require('./config');
var router = require('koa-router');
var log = require('koa-logger')();

app.use(all);

function * all(next) {
	yield weather.getLocation(this, weather.getWeather(this, next));
}

var xtplApp = require('xtpl/lib/koa');

xtplApp(app, {
	views: './views'
});

// app.get('/simple', function *() {
// 	yield this.render('simple', {title: 'xtemplate'});
// })

app.use(function * (next) {
	if (this.path === '/') {
		yield this.render('index', {lat: this.request.header.location.lat, lon: this.request.header.location.lon, temp: this.request.header.weather.main.temp, temp_min: this.request.header.weather.main.temp_min, temp_max: this.request.header.weather.main.temp_max});
	} else {
		yield next;
	}
})

// app.use(router(app));

app.use(log);

app.listen(config.port);