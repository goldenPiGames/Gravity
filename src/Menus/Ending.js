const SAVE_SEEN_ENDING = "GravvitySeenEnding";
const STAGE_END_SCREEN_ENDING_CREDIT_TIME = 120;
const STAGE_END_SCREEN_ENDING_FADEOUT_LENGTH = 40;

function isTimeToDoEnding(stag) {
	if (localStorage.getItem(SAVE_SEEN_ENDING))
		return false;
	for (var i = 0; i < SELECTABLE_STAGES.length; i++) {
		//console.log(isStageBeaten(SELECTABLE_STAGES[i]))
		if (SELECTABLE_STAGES[i] != stag && !isStageBeaten(SELECTABLE_STAGES[i]))
			return false;
	}
	return true;
}

class StageEndScreenEnding extends StageEndScreenBase {
	constructor(...link) {
		super(...link);
		this.screenTime = 0;
		this.butt = new InvisibleButton({
			
		});
		this.hover(this.butt);
		this.menuObjects = [
			this.butt,
		];
	}
	resize() {
		super.resize();
		this.butt.resize(-40, -40, mainCanvas.width+80, mainCanvas.height+80);
		this.cursor.resetPositionOut();
	}
	update() {
		super.update();
		this.screenTime++;
		if (this.screenTime >= STAGE_END_SCREEN_ENDING_CREDIT_TIME)
			this.finish();
	}
	finish() {
		switchScreen(new CreditsScreen({speech:true}));
		localStorage.setItem(SAVE_SEEN_ENDING, 1);
	}
	draw() {
		super.draw();
		drawTextInRect(lg("StageEnd-BeatGame"), 0, mainCanvas.height*2/3, mainCanvas.width, 50, {fill:"#00FF00", stroke:"#000000"});
		let until = STAGE_END_SCREEN_ENDING_CREDIT_TIME - this.screenTime;
		console.log(until);
		if (until < STAGE_END_SCREEN_ENDING_FADEOUT_LENGTH) {
			console.log(1 - (until / STAGE_END_SCREEN_ENDING_FADEOUT_LENGTH));
			mainCtx.globalAlpha = 1 - (until / STAGE_END_SCREEN_ENDING_FADEOUT_LENGTH);
			mainCtx.fillStyle = "#000000";
			mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
			mainCtx.globalAlpha = 1;
		}
	}
}
