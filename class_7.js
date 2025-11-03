//asünkroonne lähenemine
//promise kasutamine

const myDecision = new Promise((resolve, reject) => {
	const yesNo = Math.round(Math.random());
	console.log(yesNo);
	if(yesNo == 1){
		resolve();
	}
	else {
		reject();
	}
});

myDecision
	.then(()=>console.log("JAH!"))
	.catch(()=>console.log("EI!"));