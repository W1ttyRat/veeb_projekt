const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../VP2025config");
const watermarkFile = ".public/images/vp_logo_small.png";

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_tanemets"
};

const photouploadPage = (req, res) =>{
    res.render("galleryphotoupload");
};

const photouploadPagePost = async (req, res) =>{
    let conn;
    console.log(req.body);
    console.log(req.file);
    try {
        const FileName = "vp_" + Date.now() + ".jpg";
        console.log(FileName);
        await fs.rename(req.file.path, req.file.destination + FileName);
            const watermarkSettings = [{
                input: watermarkFile,
                gravity: "southeast"
            }];
            if (!await fs.access(watermarkFile).then(() => true).catch(() => false)) {
                console.log("Vesimärgi faili ei leitud!");
                //tühjendame seaded, et vesimärk ei prooviks lisada
                watermarkSettings.length = 0;
            }
                console.log("Muudan suurust: 800X600");
                //loon normaalmõõdus foto (800X600)
                //await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
                let normalImageProcessor = await sharp(req.file.destination + FileName).resize(800, 600).jpeg({quality: 90});
            console.log("Lisan vesimärgi" + watermarkSettings.length)
            if (watermarkSettings.length > 0) {
                normalImageProcessor = await normalImageProcessor.composite(watermarkSettings);
            }
                await normalImageProcessor.toFile("./public/gallery/normal/" + FileName);
            //loon thumbnail pildi 100X100
            await sharp(req.file.destination + FileName).resize(100, 100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + FileName);
            conn = await mysql.createConnection(dbConf);
            let sqlReq = "INSERT INTO galleryphotos_ta (filename, origname, alttext, privacy, userid) VALUES(?,?,?,?,?)";
            //kuna kasutajakontosid veel ei ole siis määrame userid = 1
            const userId = req.session.userId;
            const [result] = await conn.execute(sqlReq, [FileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
            console.log("Salvestati kirje: " + result.insertId);
            res.render("galleryphotoupload");
        }
        catch(err) {
            console.log(err)
            res.render("galleryphotoupload");
        }
        finally {
            if(conn){
                await conn.end();
                console.log("Andmebaasiühendus on suletud!");
            }
        }
};

module.exports = {
    photouploadPage, photouploadPagePost
};