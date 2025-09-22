const http = require("http");
const dateEt = require("./src/dateTimeET");
const pageHead = '<!DOCTYPE html><html lang="et"><head><meta charset="utf-8"><title>Tanel Metshein</title></head><body>';
const pageBody = '<h1>Tanel Metshein, veebiprogrammeerimine</h1><p>See leht on loodud aastal 2025 <a href="https://www.tlu.ee">Tallina Ülikoolis</a></p><hr><p>Üleval peaks olema õuna pilt, aga see on ära võetud</p><hr><p></p><hr>';
const pageFoot = '</body></html>';


http.createServer(function(req, res){
	res.writeHead(200, {"Content-type": "text/html"});
	//res.write("Ongi nii");
	res.write(pageHead);
	res.write(pageBody);
	res.write("<p>Täna on " + dateEt.fullDate() + ".</p>");
	res.write("<p>Kell on " + dateEt.fullTime() + "</p>");
	res.write("<p>" + dateEt.partOfDay() + "</p>");
	res.write(pageFoot);
	return res.end();
}).listen(5108);