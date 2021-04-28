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
		this.exitButton = new MenuButton({
			lText : "Pause-Exit",
			func : ()=>this.exit(),
		});
		this.connectVert(this.resumeButton, this.exitButton);
		this.menuObjects = [
			this.resumeButton,
			this.exitButton,
		];
		this.hover(this.resumeButton);
		this.returnTo = returnTo;
	}
	resize() {
		([this.resumeButton, this.exitButton]).forEach((b, i)=>b.resize(mainCanvas.width/10, mainCanvas.height/2 + mainCanvas.height/10*i, mainCanvas.width*4/5, mainCanvas.height/15));
	}
	draw() {
		clearCanvas();
		super.draw();
	}
	resume() {
		runnee = this.returnTo;
	}
	exit() {
		this.returnTo.exit();
	}
}