var spritesWaiting = [];

class LoadingScreen {
	constructor(to) {
		this.to = to;
	}
	update() {
		if (!isWaitingForLoad()) {
			switchScreen(this.to);
		}
	}
	draw() {
		
	}
	resize() {
		this.to.resize();
	}
}

function isWaitingForLoad() {
	spritesWaiting = spritesWaiting.filter(s=>!s.image.loaded);
	//loconsole.log(spritesWaiting);
	return spritesWaiting.length >= 1;
}