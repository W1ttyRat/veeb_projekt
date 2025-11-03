//asünkroonne lähenemine
//async funktsioonid

const fs = require("fs").promises;
const textRef = "txt/vanasonad.txt";

function pickOneSentence(rawText){
	//jagan teksti ";" järgi massiiviks, listiks
	let oldWisdomList = rawText.split(";");
	//console.log(oldWisdomList);
	
	let wisdomCount = oldWisdomList.length;
	//console.log(wisdomCount);
	
	//loosin ja väljastan ühe vanasõna
	let wisdomOfTheDay = oldWisdomList[Math.round(Math.random() * (oldWisdomList.length - 1))];
	//console.log(wisdomOfTheDay);
	return wisdomOfTheDay;
}


//defineerime asünkroonse funktsiooni
const readTextFile = async function(){
	//try osas käsud, mida üritatakse täita
	try {
		//await paneb funktsiooni ootele kuni operatsioon täidetud
		const data = await fs.readFile(textRef, "utf8");
		console.log(data);
		const todaysWisdom = await pickOneSentence(data);
		console.log(todaysWisdom);
		
	}
	//catch osas veahaldus
	catch {
		console.log("Viga");
	}
	finally {
		console.log("Lõpetasin");
	}
}

console.log("Alustasin");
readTextFile();

