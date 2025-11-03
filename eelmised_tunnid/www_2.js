const http = require("http");
const fs = require("fs");
const dateEt = require("./src/dateTimeET");
const url = require("url");
//failitee haldamiseks moodul
const path = require("path");
const textRef = "txt/vanasonad.txt";
const testOne = require("./class_3_1");
const pageHead = '<!DOCTYPE html><html lang="et"><head><meta charset="utf-8"><title>Tanel Metshein</title></head><body>';
const pageBanner = '<img src= "vp_banner_2025_TA.jpg" alt = "kursuse bänner">';
const pageBody = '<h1>Tanel Metshein, veebiprogrammeerimine</h1><p>See leht on loodud aastal 2025 <a href="https://www.tlu.ee">Tallina Ülikoolis</a></p><hr><p>Üleval peaks olema õuna pilt, aga see on ära võetud</p><hr><p></p><hr>';
const pageLink = '\n\t<p>Vaata <a href="/vanasonad">vanasõnasid</a>.</p> \n\t<p>Vaata <a href="/hobid">minu hobisid</a>.</p>';
const pageFoot = '</body></html>';


http.createServer(function(req, res){
	//parsin URL-i
	console.log("Päring: " + req.url);
	let currentUrl = url.parse(req.url, true);
	console.log("Pärsituna: " + currentUrl.pathname);
	
	if(currentUrl.pathname === "/"){
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write("<p>Täna on " + dateEt.fullDate() + ".</p>");
		res.write("<p>Kell on " + dateEt.fullTime() + "</p>");
		res.write("<p>" + dateEt.partOfDay() + "</p>");
		//res.write("\n\t<h2>Valik Eesti vanasõnu</h2>")
		//res.write(folkWisdomOutput);
		res.write(pageLink);
		res.write(pageFoot);
		return res.end();
	}
	
	else if(currentUrl.pathname === "/vanasonad"){
		fs.readFile(textRef, "utf8", (err, data) => {
		let folkWisdom = data.split(";");
			let folkWisdomOutput = "\n\t<ol>";
			for (let i = 0; i < folkWisdom.length; i ++){
				folkWisdomOutput += "\n\t\t<li>" + folkWisdom[i] + "</li>";
			}
		folkWisdomOutput += "\n\t</ol>";
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write("<p>Täna on " + dateEt.fullDate() + ".</p>");
		res.write("<p>Kell on " + dateEt.fullTime() + "</p>");
		res.write("<p>" + dateEt.partOfDay() + "</p>");
		res.write("\n\t<h2>Valik Eesti vanasõnu</h2>")
		res.write(folkWisdomOutput);
		res.write(pageFoot);
		return res.end();
		});
	}
	
	else if(currentUrl.pathname === "/hobid"){
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write("<p>Mul oli hobiks laskmine" + ".</p>");
		res.write('<img src="laskmine.jpg" alt = "hobi pilt" width="400" length="300">');
		res.write(pageFoot);
		return res.end();
	}
	
	else if (currentUrl.pathname === "/laskmine.jpg"){
		let imgPath = path.join(__dirname, "img");
		fs.readFile(imgPath + currentUrl.pathname, (err, data) => {
			if (err) {
				throw(err);
			} else {
				res.writeHead(200, {"Content-type": "image/jpeg"});
				res.end(data);
			}
		});
	}
	
	
	else if(currentUrl.pathname === "/vp_banner_2025_TA.jpg"){
		//liidame muidu kättesaamatu piltide kausta meie veebi failiteega
		let bannerPath = path.join(__dirname, "img");
		fs.readFile(bannerPath + currentUrl.pathname, (err, data) => {
			if(err){
				throw(err);
			} else {
				res.writeHead(200, {"Content-type": "image/jpeg"});
				res.end(data);
			}
		});
	}
	/* res.writeHead(200, {"Content-type": "text/html"});
	fs.readFile(textRef, "utf8", (err, data) => {
		if(err){
			res.write(pageHead);
			res.write(pageBody);
			res.write("<p>testing #15" + "</p>");
			res.write(pageFoot);
			return res.end();
		} else {
			let folkWisdom = data.split(";");
			let folkWisdomOutput = "\n\t<ol>";
			for (let i = 0; i < folkWisdom.length; i ++){
				folkWisdomOutput += "\n\t\t<li>" + folkWisdom[i] + "</li>";
			}
		folkWisdomOutput += "\n\t</ol>";
		res.write(pageHead);
		res.write(pageBody);
		res.write("<p>Täna on " + dateEt.fullDate() + ".</p>");
		res.write("<p>Kell on " + dateEt.fullTime() + "</p>");
		res.write("<p>" + dateEt.partOfDay() + "</p>");
		res.write("\n\t<h2>Valik Eesti vanasõnu</h2>")
		res.write(folkWisdomOutput);
		res.write(pageFoot);
		return res.end();
		}
	}); */
	else {
		res.end("Viga 404, ei leia sellist lehte!");
	}
}).listen(5108);

//http://greeny.cs.tlu.ee:5108/