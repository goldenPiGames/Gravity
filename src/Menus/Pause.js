function checkPause() {
	if (globalController.pauseClicked) {
		switchScreen(new PauseMenu(runnee));
	}
}

class PauseMenu extends MenuScreen {
	constructor(returnTo) {
		super({
			mainButtons : [
				{
					lText : "Pause-Resume",
					func : ()=>this.resume(),
				},
				{
					lText : "Pause-Exit",
					func : ()=>this.exit(),
				},
			]
		});
		this.returnTo = returnTo;
	}
	resume() {
		runnee = this.returnTo;
	}
	exit() {
		this.returnTo.exit();
	}
}