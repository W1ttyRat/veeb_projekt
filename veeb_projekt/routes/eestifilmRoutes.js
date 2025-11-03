const express = require("express");
const router = express.Router();

//kontrollerid
const {
	eestifilm, inimesed, inimesedAdd, inimesedAddPost, positsionAdd, inimesedPositsionAdd, positsion, filmAdd, film, moviePeoplePositionSelect, moviePeoplePosition
} = require("../controllers/eestifilmController");


router.route("/").get(eestifilm);

router.route("/inimesed").get(inimesed);

router.route("/inimesed_add").get(inimesedAdd).post(inimesedAddPost);

router.route("/positsion_add").get(positsionAdd).post(inimesedPositsionAdd);

router.route("/positsion").get(positsion);

router.route("/eestifilm_add").get(film).post(filmAdd);

router.route("/eestifilm_seosed").get(moviePeoplePositionSelect).post(moviePeoplePosition);



module.exports = router;


//router.route("/positsion_add").post(inimesedAddPost);

/* <select id="personSelect" name = "personSelect">
	<option selected disabled>Vali isik</option>
	<option value="id väärtus">Isiku nimi</option>
	.................
	<option value="18">Maiken Pius </option>
</select> */