let download = require('download')
let Promise = require('bluebird');
let fs = require('fs');
let path = require('path');

let urls = fs.readFileSync('./_list', 'utf-8').split('\r\n');
let length = urls.length;
let errs = [];

Promise.mapSeries(urls, (url, idx) => {
	if(idx < 0) return Promise.resolve();

	return download('http://app.cache.kairisei-ma.jp/p197515/Android/patch/'+url, path.dirname('patch/'+url), { proxy: 'http://127.0.0.1:1080' })
	.then(() => console.log(Date(), idx+1, length, url))
	.catch((err) => {
		console.log(Date(), idx+1, length, url, err.statusCode || err.code);
		errs.push([idx+1, length, url, err.statusCode || err.code]);
	});
})
.then(() => fs.writeFileSync('dist-err.json', JSON.stringify(errs, null, '\t')));