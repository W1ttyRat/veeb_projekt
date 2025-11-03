//asünkroonne lähenemine
//promise kasutamine

const fs = require("fs").promises;
const textRef = "txt/vanasonad.txt";

fs.readFile(textRef, "utf8")
	.then((data)=>console.log(data))
	.catch((err)=>console.log("Viga!"));
