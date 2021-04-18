function getStageSelectData(sid) {
	return {
		lText : "Stage-"+sid,
		func : function() {
			
		}
	};
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
		this.resize();
	}
	resize() {
		this.backButton.resize(mainCanvas.width - 100, 0, 100, 40);
		this.stageScroll.resize(0, mainCanvas.width/4);
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
	}
	back() {
		switchScreen(MainMenu);
	}
	clickStage(sid) {
		switchScreen(new SingleStageEngine({
			stage : stageFromRegistry(sid),
			winFunc : ()=>switchScreen(new StageSelectMenu()),
			exitFunc : ()=>switchScreen(new StageSelectMenu()),
		}));
	}
}

class StageSelectScrollContainer extends ScrollContainer {
	constructor() {
		super();
		this.scrollObjects = EDITABLE_STAGES.map(i=>new StageSelectScrollObject(i));
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