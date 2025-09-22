const fs = require("fs");
//impordime oma kuupäeva mooduli
const dateEt = require("./src/dateTimeET");
const textRef = "txt/vanasonad.txt";

function pickOneSentence(rawText){
	//jagan teksti ";" järgi massiiviks, listiks
	let oldWisdomList = rawText.split(";");
	//console.log(oldWisdomList);
	let wisdomCount = oldWisdomList.length;
	//console.log(wisdomCount);
	
	//loosin ja väljastan ühe vanasõna
	let wisdomOfTheDay = oldWisdomList[Math.round(Math.random() * (wisdomCount - 1))];
	console.log(wisdomOfTheDay);
}

function listWisdom(rawData){
	let folkWisdom = rawData.split(";");
	for (let i = 0; i < folkWisdom.length; i++){
		console.log((i + 1) + ") " + folkWisdom[i]);
	}
}

function readTextFile(){
	fs.readFile(textRef, "utf8", (err, data) => {
		if(err){
			console.log(err);
		} else {
			//console.log(data);
			listWisdom(data);
		}
	});
}


console.log("Täna on " + dateEt.fullDate());
console.log("Kell on " + dateEt.fullTime());
console.log("On " + dateEt.partOfDay() + ".");
console.log("Tänane vanasõna on:");
readTextFile();