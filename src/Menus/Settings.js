class SettingsMenu extends Screen {
	constructor() {
		super();
		this.backButton = new MenuButton({
			lText : "StageSelect-Back",
			func : ()=>this.back(),
			color : "#FF4040",
			bindCancel : true,
		});
		this.poopbutts = [
			this.backButton,
		];
		this.cursor = new MenuCursor(this);
		this.hover(this.backButton);
	}
	resize() {
		this.backButton.resize(mainCanvas.width - 100, 0, 100, 40);
	}
	update() {
		if (!this.cursor.update()) {
			this.poopbutts.forEach(b=>b.update(this));
		}
	}
	draw() {
		clearCanvas();
		this.poopbutts.forEach(b=>b.draw());
	}
	back() {
		switchScreen(MainMenu);
	}
}