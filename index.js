const express = require("express");
require("dotenv").config();
const fs = require("fs");
const bodyparser = require("body-parser");
const mysql = require("mysql2/promise");
const session = require("express-session");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../VP2025config");
const textRef = "public/txt/vanasonad.txt";
const loginCheck = require("./src/checkLogin");
const pool = require("./src/dbPool");
const app = express();

//määran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");
//määran ühe päris kataloogi avalikult kättesaadavaks
app.use(express.static("public"));
//parsime päringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyparser.urlencoded({extended: true}));


//app.use(session({secret: dbInfo.configData.sessionSecret, saveUninitialized: true, resave: false}));
app.use(session({secret: process.env.SES_SECRET, saveUninitialized: true, resave: false}));
app.set("view engine", "ejs");
app.use(express.static("public"));
//kui tuleb vormist ainult text, siis false, muidu true
app.use(bodyparser.urlencoded({extended: true}));



const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};



app.get("/", async (req, res)=>{
	//let conn;
	try {
		//conn = await mysql.createConnection(dbConf);
		let sqlReq = `SELECT filename, alttext FROM galleryphotos_ta WHERE id= (SELECT MAX(id) FROM galleryphotos_ta WHERE privacy=? AND deleted IS NULL)`;
		const privacy = 3
		//const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		const [rows, fields] = await pool.execute(sqlReq, [privacy]);
		console.log(rows);
		let imgAlt = "Avalik foto";
		if(rows[0].alttext != ""){
			imgAlt = rows[0].alttext;
		}
		res.render("index", {imgFile: "gallery/normal/" + rows[0].filename, imgAlt: imgAlt});
	}
	catch(err){
		console.log(err)
		//res.render("index");
		res.render("index", {imgFile: "images/otsin_pilte.jpg", imgAlt: "Tunnen end, kui pilti otsiv lammas ..."});
	}
	finally {
		/*if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud")
		}*/
	}
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateEt.fullTime();
	const dateNow = dateEt.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});
});

app.get("/genericlist", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			res.render("genericlist", {heading: "Valik Eesti vanasonu", listData: ["Ei leidnud ühtegi vanasõna!"]});
		}
		else {
			folkWisdom = data.split(";");
			wisdomCount = folkWisdom.length;
			wisdomOfTheDay = folkWisdom[Math.round(Math.random() * (wisdomCount -1))];
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

//sisselogitud kasutajate avaleht
app.get("/home", loginCheck.isLogin, (req, res)=>{
	console.log("Sisse logis kasutaja: " + req.session.userId);
	res.render("home", {user: req.session.firstName + ' ' + req.session.lastName});
});

app.get("/logout", (req, res)=>{
	req.session.destroy();
	console.log("Välja logitud");
	res.redirect("/");
});

//eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/Eestifilm", eestifilmRouter);

//Galerii fotode üleslaadimine
const photoupRouter = require("./routes/photoupRoutes");
app.use("/galleryphotupload", photoupRouter);

//Galerii marsruudid
const galleryRouter = require("./routes/galleryRoutes");
app.use("/gallery", galleryRouter);

//Konto loomise marsruudid
const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);

//sisselogimise marsruudid
const signinRouter = require("./routes/signinRoutes");
app.use("/signin", signinRouter);



app.listen(5108);