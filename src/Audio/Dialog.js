function initVoice() {
	
}

function makeVoice(nom) {
	var voz = document.createElement("audio");
	voz.preload = "auto";
	voz.controls = "none";
	voz.style.display = "none";
	/*voz.addEventListener("ended", function() {
			this.currentTime = 0;
			this.pause();
		}, false);*/
	var sosl = document.createElement("source");
	sosl.src = "src/Audio/Voice/"+settings.lang+"/"+nom+".mp3";
	voz.appendChild(sosl);
	var sosen = document.createElement("source");
	sosen.src = "src/Audio/Voice/en/"+nom+".mp3";
	voz.appendChild(sosen);
	
	voz.volume = settings.voiceVolume;
	document.body.appendChild(voz);
	return voz;
}

class DialogHandler {
	constructor() {
		this.lineIndex = 0;
		this.lines = [];
		this.timer = 0;
	}
	update() {
		this.currentLine = this.lines[this.lineIndex];
		if (this.currentLine) {
			this.currentLine.updateActive();
			if (this.currentLine.isDone()) {
				this.lineIndex++;
			}
		}
	}
	draw() {
		if (this.currentLine) {
			//console.log(lg(this.currentLine.lText));
			let wideness = Math.min(mainCanvas.width, 800);
			drawParagraphInRect(lg(this.currentLine.lText), mainCanvas.width/2-wideness/2, mainCanvas.height*.85, wideness, mainCanvas.height*.15, mainCanvas.height*.03);
		}
	}
	startDialog(lines) {
		this.lines.push(...lines.map(l=>new DialogLine(l)));
	}
	startDialogIfEmpty(lines) {
		if (!this.currentLine)
			this.startDialog(lines);
	}
}

class DialogLine {
	constructor(args) {
		this.lText = args.lText;
		if (args.lTextAddController)
			this.lText += "-" + getControllerType();
		this.duration = args.duration;
		this.audio = makeVoice(this.lText);
		this.timer = 0;
	}
	updateActive() {
		this.timer++;
		if (!this.playedYet && !settings.muted) {
			this.audio.play();
			this.playedYet = true;
		}
	}
	isDone() {
		return settings.muted ? this.timer > this.duration : this.audio.ended || this.timer > this.duration*2;
	}
}