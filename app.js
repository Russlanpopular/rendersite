var express = require('express');
var app = express();

var templating = require('consolidate');
app.engine('html', templating.handlebars);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
// parse application/json
app.use(bodyParser.json())

var request = require('request');
var urlutils = require('url');
var cheerio = require('cheerio');

app.get('/', function(req, res){
	res.render('hello', {
		header: 'Заполните форму для Новостей.'
	});
});

app.post('/', function(req, res){
	if(req.body.site == "segodnya"){
		var data = request({
			method: "POST",
			uri: "http://www.segodnya.ua/",
			form:{key: 'value'},
		},function(error, response, body){
			if(error){
				res.render('hello', {
					news: 'error.'
				});
			} else {
				var $ = cheerio.load(body);
				var array = [];
				var i = 0;
				var element = $(".black").text();

				$(".black").each(function(i, element){
					if(i==req.body.how_many) {
						return false;
					}
					array.push($(element).text());
					

					i++;
				});
				
					res.render('hello',{
						news: array
					});
			}
		});
	} else{
		var data = request({
			method: "POST",
			uri: "https://mail.ru/",
			form:{key: 'value'},
		},function(error, response, body){
			if(error){
				res.render('hello', {
					news: 'error.'
				});
			} else {
				var $ = cheerio.load(body);
				var array = [];
				var i = 0;
				var element = $(".black").text();

				$(".news__list__item__link__text").each(function(i, element){
					if(i==req.body.how_many) {
						return false;
					}
					array.push($(element).text());
					

					i++;
				});
				
					res.render('hello',{
						news: array
					});
			}
		});
	}


});
app.listen(8080);
console.log('Express server listening on port 8080');