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
var sfx = {
	
}

function initSFX() {
	//lastSFXvolume = settings.sfx;
	sfx = {
		"Tick1_0" : makeSound("Tick1.wav"),
		"Tick1_1" : makeSound("Tick1.wav"),
		"Tick1" : new SFXCycler(["Tick1_0", "Tick1_1"]),
		"Hurt" : makeSound("Hurt.mp3"), //Etrian Odyssey Untold
	}
}

function playSFX(name) {
	//console.log(name)
	if (!settings.sfx)
		return;
	sfx[name].play();
}

function setSFXVolume(quant) {
	if (quant != lastSFXvolume) {
		for (f in sfx) {
			sfx[f].volume = quant;
		}
		lastSFXvolume = quant;
	}
}

class SFXCycler {
	constructor(names) {
		this.names = names;
		this.cycle = 0;
	}
	play() {
		this.cycle = this.cycle % this.names.length;
		playSFX(this.names[this.cycle]);
		this.cycle++;
	}
}