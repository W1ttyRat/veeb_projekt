const http = require("http");
<<<<<<< HEAD
const dateEt = require("./src/dateTimeET");
=======
const fs = require("fs");
const dateEt = require("./src/dateTimeET");
const url = require("url");
const textRef = "txt/vanasonad.txt";
const testOne = require("./class_3_1");
>>>>>>> b8c3660 (lisatud hobi pilt ja uus address)
const pageHead = '<!DOCTYPE html><html lang="et"><head><meta charset="utf-8"><title>Tanel Metshein</title></head><body>';
const pageBody = '<h1>Tanel Metshein, veebiprogrammeerimine</h1><p>See leht on loodud aastal 2025 <a href="https://www.tlu.ee">Tallina Ülikoolis</a></p><hr><p>Üleval peaks olema õuna pilt, aga see on ära võetud</p><hr><p></p><hr>';
const pageFoot = '</body></html>';


http.createServer(function(req, res){
	res.writeHead(200, {"Content-type": "text/html"});
<<<<<<< HEAD
	//res.write("Ongi nii");
	res.write(pageHead);
	res.write(pageBody);
	res.write("<p>Täna on " + dateEt.fullDate() + ".</p>");
	res.write("<p>Kell on " + dateEt.fullTime() + "</p>");
	res.write("<p>" + dateEt.partOfDay() + "</p>");
	res.write(pageFoot);
	return res.end();
=======
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
	});
>>>>>>> b8c3660 (lisatud hobi pilt ja uus address)
}).listen(5108);