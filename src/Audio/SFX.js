var lastSFXvolume;

function makeSound(nom) {
	var fec = document.createElement("audio");
	fec.preload = "auto";
	fec.controls = "none";
	fec.style.display = "none";
	fec.addEventListener("ended", function() {
			this.currentTime = 0;
			this.pause();
		}, false);
	fec.src = "src/Audio/SFX/"+nom;
	fec.volume = settings.sfx;
	document.body.appendChild(fec);
	return fec;
}

//Sprocket: turning a handheld sprocketed screwdriver while under quarantine in my room
//HDMI: whipping around an HDMI cable while under quarantine in my room
//DrawerThump: thumping the slideout computer drawer on my desk in my dormitory while under quarantine

var sfxCyclers = {
	
}

function requireSFX(id, count=1) {
	if (!sfxCyclers[id])
		sfxCyclers[id] = new SFXCycler(id, count);
	else
		sfxCyclers[id].requireElems(count);
}

function initSFX() {
	
	//lastSFXvolume = settings.sfx;
}

function playSFX(name) {
	//console.log(name)
	if (!settings.sfx || settings.muted) {
		return;
	}
	if (!sfxCyclers[name]) {
		throwMaybe("SFX "+name+" has not been required.");
		return false;
	}
	sfxCyclers[name].play();
}

function applySFXVolume() {
	for (f in sfxCyclers) {
		sfxCyclers[f].setVolume(settings.sfx);
	}
	lastSFXvolume = quant;
}

class SFXCycler {
	constructor(name, numElems) {
		this.name = name;
		this.elems = [];
		this.cycle = 0;
		this.requireElems(numElems);
	}
	requireElems(count) {
		while (this.elems.length < count)
			this.elems.push(makeSound(this.name+".wav"));
	}
	play() {
		this.elems[this.cycle].play();
		this.cycle = (this.cycle+1) % this.elems.length;;
	}
	setVolume(danana) {
		this.elems.forEach(e=>e.volume=danana);
	}
}