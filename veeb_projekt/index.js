const express = require("express");
const fs = require("fs");
//päringu lahtiharutaja POST jaoks
const bodyparser = require("body-parser");
//const mysql = require("mysql2")
//kuna kasutame asünki, siis impordime mysql2.promise mooduli
//const mysql = require("mysql2/promise");
const dateEt = require("./src/dateTimeET");
//const dbInfo = require("../VP2025config");
const textRef = "./txt/vanasonad.txt";
//käivitan express.js funktsiooni ja annan talle nimeks "app"
const app = express();
//määran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");
//määran ühe päris kataloogi avalikult kättesaadavaks
app.use(express.static("public"));
//parsime päringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//loon andmebaasiühenduse
/* const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_tanemets"
}); */



app.get("/", (req, res)=>{
	//res.send("Express.js läks käima ja serveerib veebi!");
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateEt.fullTime();
	const dateNow = dateEt.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});
});

app.get("/genericlist", (req, res)=>{
	//const oneWisdom = dateEt.listWisdom();
	//const oneSentence = dateEt.pickOneSentence();
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka väljastame veebilehe, lihtsalt vanasõnu pole ühtegi
			res.render("genericlist", {heading: "Valik Eesti vanasonu", listData: ["Ei leidnud ühtegi vanasõna!"]});
		}
		else {
			folkWisdom = data.split(";");
			wisdomCount = folkWisdom.length;
			wisdomOfTheDay = folkWisdom[Math.round(Math.random() * (wisdomCount -1))];
			//console.log(wisdomOfTheDay);
			//console.log(folkWisdom[3]);
			res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: folkWisdom, wisdomOfTheDay: wisdomOfTheDay});
		}
	});
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("./public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.fullDate() + " kell " + dateEt.fullTime() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitregistered", (req, res)=>{
	let listData = [];
	fs.readFile("./public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			res.render("visitregistered", {heading: "Registreeritud külastused", listData: ["Ei leidnud ühtegi külastust!"]});
		}
		else {
			listData = data.split(";");
			let correctListData = [];
			for(let i = 0; i < listData.length - 1; i ++){
				correctListData.push(listData[i]);
			}
			res.render("visitregistered", {heading: "registreeritud külastused", listData: correctListData});
		}
	});
});

//eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/Eestifilm", eestifilmRouter);




app.listen(5108);