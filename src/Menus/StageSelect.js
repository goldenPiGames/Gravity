function getStageSelectData(sid) {
	return {
		lText : "Stage-"+sid,
		func : function() {
			
		}
	};
}

function startStageNormally(sid) {
	switchScreen(new SingleStageEngine({
		stage : sid,
		winFunc : eng=>finishStageNormally(eng),
		exitFunc : ()=>switchScreen(new StageSelectMenu()),
	}));
}

function startStageAfter(sid) {
	let dex = SELECTABLE_STAGES.indexOf(sid);
	if (dex < SELECTABLE_STAGES.length-1) {
		startStageNormally(SELECTABLE_STAGES[dex+1]);
	} else {
		switchScreen(new StageSelectMenu());
	}
}

class StageSelectMenu extends Screen {//I don't tremember why this doesn't extend MenuScreen. Probably the order I did things, come to think of it. I don't feel like changing it for now.
	constructor() {
		super({
			
		});
		this.backButton = new MenuButton({
			lText : "StageSelect-Back",
			func : ()=>this.back(),
			color : "#FF4040",
			bindCancel : true,
		});
		this.stageScroll = new StageSelectScrollContainer();
		this.cursor = new MenuCursor(this);
		this.backButton.connectLeft = this.stageScroll.scrollObjects[0];
		this.hover(this.stageScroll.getStartHover());
	}
	resize() {
		this.mainX = mainCanvas.width/4;
		this.mainWidth = mainCanvas.width/2;
		this.backButton.resize(mainCanvas.width - 100, 0, 100, 40);
		this.stageScroll.resize(0, this.mainX);
		
	}
	update() {
		//console.log("bup");
		if (!this.cursor.update()) {
			this.stageScroll.update(this);
			this.backButton.update(this);
		}
	}
	draw() {
		clearCanvas();
		//console.log("braw");
		this.backButton.draw();
		this.stageScroll.draw();
		this.cursor.draw();
		if (this.stageID) {
			drawTextInRect(this.stageName, this.mainX, 0, this.mainWidth, 60);
			drawTextInRect(lg("StageSelect-BestTime"), this.mainX, 90, this.mainWidth/2, 50);
			drawTextInRect(formatTime(this.stageBestTime) || "NA", this.mainX+this.mainWidth/2, 90, this.mainWidth/2, 50, {align:"left"});
			drawTextInRect(lg("StageSelect-ParTime"), this.mainX, 150, this.mainWidth/2, 50);
			drawTextInRect(formatTime(this.stageParTime) || "???", this.mainX+this.mainWidth/2, 150, this.mainWidth/2, 50, {align:"left"});
			drawParagraphInRect(this.stageDesc, this.mainX, 220, this.mainWidth, mainCanvas.height-240, 30);
		}
	}
	back() {
		switchScreen(MainMenu);
	}
	clickStage(sid) {
		startStageNormally(sid);
	}
	hover(ting) {
		super.hover(ting);
		if (ting instanceof StageSelectScrollObject && ting.shown) {
			this.setStageDisplay(ting.stageID);
		}
	}
	setStageDisplay(sid) {
		this.stageID = sid;
		this.stageData = STAGE_REGISTRY[sid];
		this.stageBestTime = localStorage.getItem(BEST_TIME_SAVE_PREFIX+this.stageID);
		this.stageParTime = this.stageData.timePar;
		this.stageName = lg("Stage-"+sid);
		this.stageDesc = lg("Stage-"+sid+"-Desc");
	}
}
StageSelectMenu.prototype.playsHoverSFX = true;

class StageSelectScrollContainer extends ScrollContainer {
	constructor() {
		super();
		this.scrollObjects = SELECTABLE_STAGES.map((i,n)=>new StageSelectScrollObject(i,n));
		this.connect();
	}
	resize(x, width) {
		super.resize(x, 0, width, mainCanvas.height);
	}
	getStartHover() {
		return this.scrollObjects[0];
	}
}

class StageSelectScrollObject extends ScrollObject {
	constructor(id, index) {
		super({
			lText : "Stage-"+id,
			needDoubleTap : true,
		});
		this.stageID = id;
		let best = localStorage.getItem(BEST_TIME_SAVE_PREFIX+this.stageID);
		this.beaten = !!best;
		this.beatenPar = best <= STAGE_REGISTRY[this.stageID].timePar;
		this.available = isStageBeaten(index-1);
		this.shown = this.available;
		this.sprites = getSpriteSheet("ButtonBevelGrey");
		this.spritesMedal = getSpriteSheet("StageSelectMedal");
	}
	update(wummy, vemmo) {
		super.update(wummy, vemmo);
		if (this.clicked && this.available) {
			wummy.clickStage(this.stageID);
		}
	}
	draw() {
		//console.log(this.text, this.x, this.y, this.width, this.height);
		mainCtx.fillStyle = this.color || "#808080";
		mainCtx.fillRect(this.x, this.y, this.width, this.height);
		this.sprites.drawBorderOnMain(this.x, this.y, this.width, this.height);
		if (this.shown) {
			drawTextInRect(this.text, this.x+50, this.y+4, this.width-54, this.height-8, {fill:"#FFFFFF"});
			if (this.beaten)
				this.spritesMedal.drawOnMain(this.beatenPar?"Par":"Done", {x:this.x, y:this.y});
		} else
			drawTextInRect("???", this.x+4, this.y+4, this.width-8, this.height-8, {fill:"#FFFFFF"});
	}
}
StageSelectScrollObject.prototype.hoverable = true;