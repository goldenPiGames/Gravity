function initVoice() {
	
}

function makeVoice(nom) {
	var fec = document.createElement("audio");
	fec.preload = "auto";
	fec.controls = "none";
	fec.style.display = "none";
	/*fec.addEventListener("ended", function() {
			this.currentTime = 0;
			this.pause();
		}, false);*/
	fec.src = "src/Audio/Voice/"+settings.voice+"/"+nom+".mp3";
	fec.volume = settings.sfx;
	document.body.appendChild(fec);
	return fec;
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
			drawParagraphInRect(lg(this.currentLine.lText), mainCanvas.width*.2, mainCanvas.height*.6, mainCanvas.width*.6, mainCanvas.height*3, mainCanvas.height*.03);
		}
	}
	startDialog(lines) {
		this.lines.push(...lines.map(l=>new DialogLine(l)));
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