function checkPause() {
	if (globalController.pauseClicked) {
		switchScreen(new PauseMenu(runnee));
	}
}

class PauseMenu extends MenuScreen {
	constructor(returnTo) {
		super();
		this.resumeButton = new MenuButton({
			lText : "Pause-Resume",
			func : ()=>this.resume(),
			bindCancel : true,
		});
		this.restartButton = new MenuButton({
			lText : "Pause-Restart",
			func : ()=>this.restart(),
			bindAlt : true,
		});
		this.exitButton = new MenuButton({
			lText : "Pause-Exit",
			func : ()=>this.exit(),
		});
		this.mainObjects = [
			this.resumeButton,
			this.restartButton,
			this.exitButton,
		];
		connectVert(...this.mainObjects);
		this.menuObjects = [
			...this.mainObjects,
		];
		this.hover(this.resumeButton);
		this.returnTo = returnTo;
	}
	update() {
		if (globalController.pauseClicked)
			this.resume();
		else
			super.update();
	}
	resize() {
		this.mainObjects.forEach((b, i)=>b.resize(mainCanvas.width/10, mainCanvas.height/2 + mainCanvas.height/10*i, mainCanvas.width*4/5, mainCanvas.height/15));
	}
	draw() {
		clearCanvas();
		super.draw();
	}
	resume() {
		switchScreen(this.returnTo);
	}
	restart() {
		startStageNormally(this.returnTo.stageID);
	}
	exit() {
		this.returnTo.exit();
	}
}