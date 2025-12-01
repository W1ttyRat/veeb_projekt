const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const validator = require("validator");
//const dbInfo = require("../../VP2025config");
const pool = require("../src/dbPool");

/*const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};*/

const signupPage = (req, res) =>{
    res.render("signup", {notice: "Ootan andmeid"});
};

const signupPagePost = async (req, res) =>{
    let conn;
    let notice = "";
    //andmete valideerimine
    /*if(
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
    }*/

    //puhastame andmed
    const firstName = validator.escape(req.body.firstNameInput.trim());
    const lastName = validator.escape(req.body.lastNameInput.trim());
    const birthDate = req.body.birthDateInput;
    const gender = req.body.genderInput;
    const email = req.body.emailInput.trim();
    const password = req.body.passwordInput;
    const confirmPassword = req.body.confirmPasswordInput;

    //kas kõik oluline on olemas
    if(!firstName || !lastName || !birthDate || !gender || !email || !password || !confirmPassword){
        notice = "Andmeid on puudu või miski on vigane!";
        return res.render("signup", {notice: notice})
    }

    //kas email on korras
    if (!validator.isEmail(email)) {
        notice = "Email on vigane!";
        return res.render("signup", {notice: notice})
    }

    //kas parool on piisavalt tugev
    const passwordOptions = {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    };
    if (!validator.isStrongPassword(password, passwordOptions)) {
        notice = "Parool on liiga nõrk!";
        return res.render("signup", {notice: notice})
    }

    //kas paroolid klapivad
    if (password !== confirmPassword) {
        notice = "Paroolid ei klapi!";
        return res.render("signup", {notice: notice})
    }

    //kas sünnikuupäev on korrektne
    if (!validator.isDate(birthDate) || validator.isAfter(birthDate)) {
        notice = "Sünnikuupäev ei ole reaalne!";
        return res.render("signup", {notice: notice})
    }

    try {
        //conn = await mysql.createConnection(dbConf);
        //kontrollin ega sellist juba pole
        let sqlReq = "SELECT id FROM users WHERE email=?";
        const [users] = await pool.execute(sqlReq, [req.body.emailInput]);
        if (users.length > 0) {
            notice = "Selline kasutaja on juba olemas!";
            console.log(notice);
            return res.render("signup", {notice: notice});
        }

        //krüpteerime parooli
        const pwdHash = await argon2.hash(req.body.passwordInput);
        //console.log(pwdHash);
        //console.log(pwdHash.length);
        
        sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await pool.execute(sqlReq, [
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
            /*if(conn){
                await conn.end();
                console.log("Andmebaasiühendus on suletud!");
            }*/
        }
};

module.exports = {
    signupPage,
    signupPagePost
};