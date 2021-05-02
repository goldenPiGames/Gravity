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

class StageSelectMenu extends Screen {
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
			drawTextInRect(lg("StageSelect-BestTime")+(this.stageBestTime || "NA"), this.mainX, 90, this.mainWidth, 50);
			drawParagraphInRect(this.stageDesc, this.mainX, 160, this.mainWidth, mainCanvas.height-240, 30);
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
		if (ting instanceof StageSelectScrollObject) {
			this.setStageDisplay(ting.stageID);
		}
	}
	setStageDisplay(sid) {
		this.stageID = sid;
		this.stageData = STAGE_REGISTRY[sid];
		this.stageBestTime = localStorage.getItem(BEST_TIME_SAVE_PREFIX+this.stageID);
		this.stageName = lg("Stage-"+sid);
		this.stageDesc = lg("Stage-"+sid+"-Desc");
	}
}

class StageSelectScrollContainer extends ScrollContainer {
	constructor() {
		super();
		this.scrollObjects = SELECTABLE_STAGES.map(i=>new StageSelectScrollObject(i));
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
	constructor(id) {
		super({
			lText : "Stage-"+id,
			needDoubleTap : true,
		});
		this.stageID = id;
	}
	update(wummy) {
		super.update(wummy);
		if (this.clicked) {
			wummy.clickStage(this.stageID);
		}
	}
	draw() {
		//console.log(this.text, this.x, this.y, this.width, this.height);
		mainCtx.fillStyle = "#FFFFFF";
		drawTextInRect(this.text, this.x, this.y, this.width, this.height);
	}
}
StageSelectScrollObject.prototype.hoverable = true;