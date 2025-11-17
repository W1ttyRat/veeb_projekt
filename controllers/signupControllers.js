const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const dbInfo = require("../../VP2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_tanemets"
};

const signupPage = (req, res) =>{
    res.render("signup", {notice: "Ootan andmeid"});
};

const signupPagePost = async (req, res) =>{
    let conn;
    //andmete valideerimine
    if(
        !req.body.firstNameInput ||
        !req.body.lastNameInput ||
        !req.body.birthDateInput ||
        !req.body.genderInput ||
        !req.body.emailInput ||
        req.body.passwordInput.length < 8 ||
        req.body.passwordInput !== req.body.confirmPasswordInput
    ){
        let notice = "Andmeid puudulikud või vigased";
        console.log(notice);
        return res.render("signup", {notice: notice});
    }
    try {
        //krüpteerime parooli
        const pwdHash = await argon2.hash(req.body.passwordInput);
        //console.log(pwdHash);
        //console.log(pwdHash.length);
        conn = await mysql.createConnection(dbConf);
        let sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await conn.execute(sqlReq, [
            req.body.firstNameInput,
            req.body.lastNameInput,
            req.body.birthDateInput,
            req.body.genderInput,
            req.body.emailInput,
            pwdHash
        ]);
        console.log("Salvestati kasutaja: " + result.insertId);
        res.render("signup");
        }
        catch(err) {
            console.log(err)
            res.render("signup");
        }
        finally {
            if(conn){
                await conn.end();
                console.log("Andmebaasiühendus on suletud!");
            }
        }
};

module.exports = {
    signupPage,
    signupPagePost
};