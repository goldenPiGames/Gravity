function finishStageNormally(eng) {
	console.log("Finished in "+eng.stage.time);
	switchScreen(new StageEndScreen(eng))
}

class StageEndScreen extends MenuScreen {
	constructor(eng) {
		super();
		this.stageEngine = eng;
		this.nextButton = new MenuButton({
			lText : "StageEnd-Next",
			bindCancel : true,
			func : ()=>switchScreen(new StageSelectMenu()),//TODO
		});
		this.restartButton = new MenuButton({
			lText : "StageEnd-Restart",
			bindAlt : true, //TODO bindAlt
			func : ()=>switchScreen(new StageSelectMenu()),//TODO
		});
		this.stageSelectButton = new MenuButton({
			lText : "StageEnd-StageSelect",
			bindCancel : true,
			func : ()=>switchScreen(new StageSelectMenu()),
		});
		this.connectVert(this.nextButton, this.restartButton, this.stageSelectButton);
		this.menuObjects = [
			this.nextButton,
			this.restartButton,
			this.stageSelectButton,
		];
		this.hover(this.nextButton);
	}
	resize() {
		this.nextButton.resize(mainCanvas.width*3/8, mainCanvas.height*2/3 +0, mainCanvas.width/4, 60);
		this.restartButton.resize(mainCanvas.width*3/8, mainCanvas.height*2/3 +80, mainCanvas.width/4, 60);
		this.stageSelectButton.resize(mainCanvas.width*3/8, mainCanvas.height*2/3 +160, mainCanvas.width/4, 60);
	}
	update() {
		super.update();
	}
	draw() {
		this.stageEngine.draw();
		super.draw();
	}
}