const BEST_TIME_SAVE_PREFIX = "GravvityBestTime-";

function isStageBeaten(id) {
	if (typeof id == "number") {
		if (id < 0)
			return true;
		id = SELECTABLE_STAGES[id];
	}
	let tim = parseInt(localStorage.getItem(BEST_TIME_SAVE_PREFIX+id));
	if (!tim)
		return false;
	let par = STAGE_REGISTRY[id].timePar;
	if (tim <= par)
		return 2;
	else
		return 1;
}

function getCompletionDegree() {
	let grest = 2;
	for (var i = 0; i < SELECTABLE_STAGES.length; i++) {
		let got = isStageBeaten(i);
		if (!got)
			return false;
		grest = Math.min(grest, got);
	}
	return grest;
}

function finishStageNormally(eng) {
	var skrrrrrrra = new (isTimeToDoEnding() ? StageEndScreenEnding : StageEndScreenNormal)(eng);
	skrrrrrrra.saveBestTime();
	switchScreen(skrrrrrrra);
}

class StageEndScreenBase extends MenuScreen {
	constructor(eng) {
		super();
		this.stageEngine = eng;
		this.stageID = this.stageEngine.stageID;
		this.time = this.stageEngine.stage.time;
	}
	resize() {
		this.stageEngine.resize();
		this.timesBaseline = mainCanvas.height/3;
	}
	draw() {
		this.stageEngine.draw();
		super.draw();
		mainCtx.fillStyle = "#FFFFFF";
		drawTextInRect(lg("StageEnd-Time"), 0, this.timesBaseline, mainCanvas.width/2, 50, {align:"right", fill:"#FFFFFF", stroke:"#000000"});
		drawTextInRect(formatTime(this.time), mainCanvas.width/2, this.timesBaseline, mainCanvas.width/2, 50, {align:"left", fill:"#FFFFFF", stroke:"#000000"});
		drawTextInRect(lg("StageEnd-PrevBestTime"), 0, this.timesBaseline+50, mainCanvas.width/2, 50, {align:"right", fill:"#FFFFFF", stroke:"#000000"});
		drawTextInRect(formatTime(this.prevBestTime) || "-", mainCanvas.width/2, this.timesBaseline+50, mainCanvas.width/2, 50, {align:"left", fill:"#FFFFFF", stroke:"#000000"});
		drawTextInRect(lg("StageEnd-ParTime"), 0, this.timesBaseline+100, mainCanvas.width/2, 50, {align:"right", fill:"#FFFFFF", stroke:"#000000"});
		drawTextInRect(formatTime(this.parTime) || "-", mainCanvas.width/2, this.timesBaseline+100, mainCanvas.width/2, 50, {align:"left", fill:"#FFFFFF", stroke:"#000000"});
		if (this.newBestTime) {
			if (this.justBeatPar)
				drawTextInRect(lg("StageEnd-BeatParTime"), 0, this.timesBaseline+160, mainCanvas.width, 50, {fill:"#FF0000", stroke:"#000000"});
			else
				drawTextInRect(lg("StageEnd-NewBestTime"), 0, this.timesBaseline+160, mainCanvas.width, 50, {fill:"#00FF00", stroke:"#000000"});
		}
	}
	saveBestTime() {
		this.stageID = this.stageEngine.stageID;
		const storageKey = BEST_TIME_SAVE_PREFIX+this.stageID;
		this.prevBestTime = parseInt(localStorage.getItem(storageKey));
		this.parTime = STAGE_REGISTRY[this.stageID].timePar;
		this.justBeatPar = this.time <= this.parTime && !(this.prevBestTime <= this.parTime);
		if (!(this.time >= this.prevBestTime)) {
			localStorage.setItem(storageKey, this.time);
			this.newBestTime = true;
		}
		postStageTime(this.stageID, this.time);
	}
}

class StageEndScreenNormal extends StageEndScreenBase {
	constructor(...rng) {
		super(...rng);
		this.nextButton = new MenuButton({
			lText : "StageEnd-Next",
			func : ()=>startStageAfter(this.stageID),
		});
		this.restartButton = new MenuButton({
			lText : "StageEnd-Restart",
			bindAlt : true, //TODO bindAlt
			func : ()=>startStageNormally(this.stageID),
		});
		this.stageSelectButton = new MenuButton({
			lText : "StageEnd-StageSelect",
			bindCancel : true,
			func : ()=>switchScreen(new StageSelectMenu()),
		});
		this.mainButtons = [
			this.restartButton, this.stageSelectButton, this.nextButton,
		];
		connectHoriz(...this.mainButtons);
		this.menuObjects = [
			...this.mainButtons
		];
		this.hover(this.nextButton);
	}
	resize() {
		super.resize();
		this.nextButton.resize(mainCanvas.width*7/10, mainCanvas.height*2/3, mainCanvas.width*1/5, 55);
		this.restartButton.resize(mainCanvas.width*1/10, mainCanvas.height*2/3, mainCanvas.width*1/5, 55);
		this.stageSelectButton.resize(mainCanvas.width*4/10, mainCanvas.height*2/3, mainCanvas.width*1/5, 55);
	}
}