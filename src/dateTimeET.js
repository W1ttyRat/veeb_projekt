const dateNowFormattedET = function(){
	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"] ;
	const dayNamesET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"]
	//const now = new Date();
	return dayNamesET[new Date().getDay()] + " " + new Date().getDate() + ". " + monthNamesET[new Date().getMonth()] + " " + new Date().getFullYear();
}

const timeNowFormattedET = function(){
	return new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
}

const partOfDay = function(){
	let dayPart = "suvaline aeg";
	let hourNow = new Date().getHours();
	if(hourNow <= 6){
		dayPart = "varahommik";
	} else if (hourNow < 12) {
		dayPart = "hommik";
	} else if (hourNow == 12) {
		dayPart = "keskpäev";
	}
	return dayPart;
}

/*const pickOneSentence(rawText) = function(){
	//jagan teksti ";" järgi massiiviks, listiks
	let oldWisdomList = rawText.split(";");
	//console.log(oldWisdomList);
	let wisdomCount = oldWisdomList.length;
	//console.log(wisdomCount);
	
	//loosin ja väljastan ühe vanasõna
	let wisdomOfTheDay = oldWisdomList[Math.round(Math.random() * (wisdomCount - 1))];
	console.log(wisdomOfTheDay);
} */

/*const listWisdom(rawData) = function(){
	let folkWisdom = rawData.split(";");
	for (let i = 0; i < folkWisdom.length; i++){
		console.log((i + 1) + ") " + folkWisdom[i]);
	}
} */

/*const readTextFile() = function(){
	fs.readFile(textRef, "utf8", (err, data) => {
		if(err){
			console.log(err);
		} else {
			//console.log(data);
			listWisdom(data);
		}
	});
} */





//ekspordin kõik vajaliku
//module.exports = {fullDate: dateNowFormattedET, fullTime: timeNowFormattedET, partOfDay: partOfDay, someWisdom: listWisdom};
module.exports = {fullDate: dateNowFormattedET, fullTime: timeNowFormattedET, partOfDay: partOfDay};
