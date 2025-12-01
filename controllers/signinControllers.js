const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const dbInfo = require("../../VP2025config");
const pool = require("../src/dbPool");

/*const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};*/

const signinPage = (req, res) =>{
    return res.render("signin", {notice: "Sisesta oma kasutajatunnus ning parool"});
};

const signinPagePost = async (req, res) =>{
    //let conn;
    console.log(req.body);
    //andmete valideerimine
    if(
        !req.body.emailInput ||
        !req.body.passwordInput
    ){
        let notice = "Sisselogimise andmed on puudulikud või vigased";
        console.log(notice);
        return res.render("signin", {notice: notice});
    }
    try {
        //conn = await mysql.createConnection(dbConf);
        let sqlReq = "SELECT id, password FROM users WHERE email=?";
        //const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
        const [users] = await pool.execute(sqlReq, [req.body.emailInput]);
        //kas sellise emailiga kasutaja leiti
        if (users.length === 0) {
            return res.render("signin", {notice: "Kasutajatunnus ja/või parool on vale!"});
        }

        const user = users[0];
        //parooli kontrollimine
        const match = await argon2.verify(user.password, req.body.passwordInput);
        if(match) {
            //logisime sisse
            //return res.render("signin", {notice: "Olete edukalt sisse logitud!"});
            //return res.redirect("/home");
            req.session.userId = user.id;
            sqlReq = "SELECT first_name, last_name FROM users WHERE id=?";
            //const [users] = await conn.execute(sqlReq, [req.session.userId]);
            const [users] = await pool.execute(sqlReq, [req.session.userId]);
            req.session.firstName = users[0].first_name;
            req.session.lastName = users[0].last_name;
            return res.redirect('/home');

        } else {
            //parool oli vale
            console.log("Vale parool");
            return res.render("signin", {notice: "Kasutajatunnus ja/või parool on vale!"});
        }

        }
    catch(err) {
        console.log(err)
        res.render("signin");
    }
    finally {
        /*if(conn){
            await conn.end();
            console.log("Andmebaasiühendus on suletud!");
        }*/
    }
};

module.exports = {
    signinPage,
    signinPagePost
};