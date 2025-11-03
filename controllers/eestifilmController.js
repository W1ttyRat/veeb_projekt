const mysql = require("mysql2/promise");
const dbInfo = require("../../VP2025config");


const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_tanemets"
};

//@desc home page for Estonian film section
//@route GET /Eestifilm
//@access public


//app.get("/Eestifilm", (req, res)=>{
const eestifilm = (req, res)=>{
	res.render("eestifilm");
};



//@desc home page for people involved in estonian film industry
//@route GET /Eestifilm/inimesed
//@access public

//app.get("/Eestifilm/inimesed", async (req, res)=>{
const inimesed = async (req, res) => {
	let conn;
	const sqlReq = "SELECT * FROM person";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("andmebaasiühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("eestifilminimesed", {personList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
	}
	finally {
		if(conn){
			await conn.end();
			console.log("andmebaasiühendus on suletud");
		}
	}
};


//@desc home page for adding people involved in estonian film industry
//@route GET /Eestifilm/inimesed_add
//@access public


//app.get("/Eestifilm/inimesed_add", (req, res)=>{
const inimesedAdd = (req, res) => {
	res.render("eestifilminimesed_add", {notice: "Ootan sisestust"});
};


//@desc home page for adding people involved in estonian film industry
//@route POST /Eestifilm/inimesed_add
//@access public


//app.post("/Eestifilm/inimesed_add", async (req, res) =>{
const inimesedAddPost = async (req, res) => {
	let conn;
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	if( !req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
		res.render("eestifilminimesed_add", {notice: "Osa andmeid on puudu või ebakorrektsed"});
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("andmebaasiühendus loodud!");
			console.log(req.body.firstNameInput);
			let deceasedDate = null;
			if(req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje: " + result.insertId);
			}
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("eestifilminimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
		}
		finally {
			if(conn){
				await conn.end();
				console.log("andmebaasiühendus on suletud");
			}
		}
	}
	
};

const positsionAdd = async (req, res) => {
	res.render("eestifilmpositsion_add", {notice: "Ootan sisestust"});
};
/*
const inimesedPositsionAdd = async (req, res) => {
	let conn;
	let sqlReq = "INSERT INTO position (position_name, description) VALUES (?,?)";
	
	if (!req.body.positionNameInput || !req.body.descriptionInput){
		res.render("eestifilmpositsion_add", {notice: "Osa andmeid on puudu või ebakorrektsed"});
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("andmebaasiühendus loodud!");
			//const [result] = await conn.execute(sqlReq, [req.body,positionNameInput, req.body.descriptionInput]);
			//console.log("Salvestati positsion: " + result.insertId);
			//res.render("eestifilmpositsion_add", {positsionList: result});
			//res.render("eestifilmpositsion_add", {notice: "Positsioon edukalt lisatud"})
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("eestifilmpositsion_add", {notice: "Andmete salvestamien ebaõnnestus"});
			
		}
		finally {
			if(conn){
				await conn.end();
				console.log("andmebaasiühendus on suletud");
			}
		}
	}
};
*/

const positsion = async (req, res) => {
	let conn;
	const sqlReq = "SELECT * FROM `position`";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("andmebaasiühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("eestifilmpositsion", {positsionList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
	}
	finally {
		if(conn){
			await conn.end();
			console.log("andmebaasiühendus on suletud");
		}
	}
};

const inimesedPositsionAdd = async (req, res) => {
  const { positionNameInput, descriptionInput } = req.body || {}; // safely destructure

  if (!positionNameInput || !descriptionInput) {
    return res.render("eestifilmpositsion_add", {
      notice: "Osa andmeid on puudu või ebakorrektsed"
    });
  }

  let conn;
  try {
    conn = await mysql.createConnection(dbConf);
    console.log("andmebaasiühendus loodud!");

    const sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?, ?)";
    const [result] = await conn.execute(sqlReq, [positionNameInput, descriptionInput]);

    console.log("Salvestati positsioon ID:", result.insertId);
    res.render("eestifilmpositsion_add", {
      notice: `Positsioon edukalt lisatud! (ID: ${result.insertId})`
    });

  } catch (err) {
    console.log("Viga:", err);
    res.render("eestifilmpositsion_add", { notice: "Andmete salvestamine ebaõnnestus" });

  } finally {
    if (conn) {
      await conn.end();
      console.log("andmebaasiühendus on suletud");
    }
  }
};


const film = async (req, res) => {
	res.render("eestifilm_add", {notice: "Ootan sisestust"});
};

const filmAdd = async (req, res) => {
  const { titleInput, productionYearInput, durationInput, descriptionInput } = req.body || {}; // safely destructure

  if (!titleInput || !productionYearInput || !durationInput || !descriptionInput) {
    return res.render("eestifilm_add", {
      notice: "Osa andmeid on puudu või ebakorrektsed"
    });
  }

  let conn;
  try {
    conn = await mysql.createConnection(dbConf);
    console.log("andmebaasiühendus loodud!");

    const sqlReq = "INSERT INTO movie (title, production_year, duration, description) VALUES (?,?,?,?)";
    const [result] = await conn.execute(sqlReq, [titleInput, productionYearInput, durationInput, descriptionInput]);

    console.log("Salvestati movie ID:", result.insertId);
    res.render("eestifilm_add", {
      notice: `Positsioon edukalt lisatud! (ID: ${result.insertId})`
    });

  } catch (err) {
    console.log("Viga:", err);
    res.render("eestifilm_add", { notice: "Andmete salvestamine ebaõnnestus" });

  } finally {
    if (conn) {
      await conn.end();
      console.log("andmebaasiühendus on suletud");
    }
  }
};

	
const moviePeoplePosition = async (req, res) => {
	const { person_id, movie_id, position_id } = req.body;
	
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		
		if (person_id || movie_id || position_id) {
			const sql = "INSERT INTO movie_person_position (person_id, movie_id, position_id) VALUES (?,?,?)";
			await conn.execute(sql, [person_id, movie_id, position_id]);
		}
		
		const [people] = await conn.execute("SELECT id, first_name, last_name FROM person ORDER BY last_name");
		const [movies] = await conn.execute("SELECT id, title FROM movie ORDER BY title");
		const [positions] = await conn.execute("SELECT id, position_name FROM position ORDER BY position_name");
		
		res.render("eestifilm_seosed", {people, movies, positions, notice: "Seos edukalt lisatud!" });
	
	} catch(err) {
		console.log("Viga: ", err);
		res.render("eestifilm_seosed", {people: [], movies: [], positions: [], notice: "Seose lisamine ebaõnnestus"});
	
	} finally {
		if(conn) await conn.end();
	}
};



moviePeoplePositionSelect = async (req, res) => {
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		
		const [people] = await conn.execute("SELECT id, first_name, last_name FROM person ORDER BY last_name");
		const [movies] = await conn.execute("SELECT id, title FROM movie ORDER BY title");
		const [positions] = await conn.execute("SELECT id, position_name FROM position ORDER BY position_name");
		
		res.render("eestifilm_seosed", {people, movies, positions });
		
	} catch(err) {
		console.log("Viga: ", err);
		res.render("eestifilm_seosed", {people: [], movies: [], positions: [], notice: "Andmete laadimine ebaõnnestus"});
	
	} finally {
		if(conn) await conn.end();
	}
};



module.exports = {
	eestifilm, inimesed, inimesedAdd, inimesedAddPost, positsionAdd, inimesedPositsionAdd, positsion, filmAdd, film, moviePeoplePositionSelect, moviePeoplePosition
}