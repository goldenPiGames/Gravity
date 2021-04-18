class StageEndScreen extends Screen {
	constructor() {
		super();
		this.cursor = new MenuCursor(this);
		this.selectButton = new MenuButton({
			lText : "StageEnd-StageSelect",
			bindCancel : true,
		});
		this.restartButton = new MenuButton({
			lText : "StageEnd-StageSelect",
			bindAlt : true, //TODO bindAlt
		});
		this.selectButton = new MenuButton({
			lText : "StageEnd-StageSelect",
			bindCancel : true,
		});
	}
	update() {
		
		if (!this.cursor.update()) {
			this.stageScroll.update(this);
			this.backButton.update(this);
		}
	}
}