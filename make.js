let fs = require('fs');
let crc = require('crc');
let txt = fs.readFileSync('./catalog/197515.unity3d', 'utf-8');
let txtArr = txt.split('\n');
let L = console.log;

let size = 0;

let outputList = [];
let outputVers = ['<version>, '+txtArr.shift().split(',')[1].trim()];

for(let line of txtArr) {
	let arr = line.split(',');

	if(arr[0] != '<b>') { continue; }

	let same = 0;

	outputVers.push('<bundle_ver>, '+arr[1].trim()+', 0, '+arr[2].trim());

	try {
		let crc32 = ('00000000'+ crc.crc32(fs.readFileSync('./files/patch/'+arr[1])).toString(16).toUpperCase()).slice(-8);

		if(crc32 == arr[2]) {
			same = 1;
		}
		else {
			L('不匹配', arr[1], arr[2], arr[3], arr[10], crc32);
			outputList.push(arr[1]);
		}
	}
	catch(error) {
		L('不存在', arr[1], arr[2], arr[3], arr[10]);
		outputList.push(arr[1]);
	}

	if(!same) {
		size += ~~arr[4];
	}
}

fs.writeFileSync('./_list', outputList.join('\r\n'));
fs.writeFileSync('./_vers', outputVers.join('\r\n'));

L('-------D的分割线-------');
L(outputList.length + ' Files');
L((size) + ' B');
L((size/1024).toFixed(2) + ' KB');
L((size/1024/1024).toFixed(2) + ' MB');
L((size/1024/1024/1024).toFixed(2) + ' GB');
