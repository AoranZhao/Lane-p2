var app = Weather.prototype;
var config = require('../config');
var request = require('koa-request');

module.exports = Weather;

function Weather() {
	if (!(this instanceof Weather)) return new Weather;
}

function getClientIp (that) {
	var ip_str = that.req.headers['x-real-ip'] || that.req.headers['x-forwarded-for'] || that.req.connection.remoteAddress || that.req.socket.remoteAddress || that.req.connection.socket.remoteAddress;
	temp_ip = ip_str.split(':').pop();
	var c_ip = (temp_ip == 1) ? config.default_ip : temp_ip;
	console.log("Ip address is " + c_ip);
	return c_ip;
}

app.getLocation = function * (that, next) {
	console.log("getL");
	options = {
		url: 'http://ip-api.com/json/' + getClientIp(that),
		headers: { 'User-Agent': 'request' }
	};

	response = yield request(options);
	that.request.header.location = JSON.parse(response.body);

	yield next;
}

app.getWeather = function * (that, next) {
	console.log("getW");
	location = that.request.header.location;
	if (location) {
		var options = {
			url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + location.lat + '&lon=' + location.lon + '&appid=' + config.weather_api,
			headers: {'User-Agent': 'request'}
		};

		response = yield request(options);
		that.request.header.weather = JSON.parse(response.body);
	}
	that.body = JSON.stringify(that.request);
	yield next;
}