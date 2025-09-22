const firstName = "Tanel" ;
const lastName = "Metshein" ;
let oneRandomNumber = 0 ;


function tellAuthorsName(){
	console.log("Programmi autor on " + firstName + " " + lastName) ;
}

function generateNumberValue(){
	let newNumber = Math.round(Math.random()*100) ;
	return newNumber ;
}

function dateNowFormattedET(){
	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"] ;
	const dayNamesET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"]
	const now = new Date();
	return dayNamesET[now.getDay()] + " " + now.getDate() + ". " + monthNamesET[now.getMonth()] + " " + now.getFullYear();
}

function timeNowFormattedET(){
	return new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
}


tellAuthorsName() ;
oneRandomNumber = generateNumberValue() ;
console.log("genereerisin juhusliku arvu " + oneRandomNumber) ;
console.log("Täna on " + dateNowFormattedET()) ;
console.log("Kell on " + timeNowFormattedET()) ;