class SettingsMenu extends MenuScreen {
	constructor() {
		super();
		this.backButton = new MenuButton({
			lText : "StageSelect-Back",
			func : ()=>this.back(),
			color : "#FF4040",
			bindCancel : true,
		});
		this.musicSlider = new SettingsObjectPercent({
			lText : "Settings-Music",
			setting : "musicVolume",
			segments : 10,
		});
		this.sfxSlider = new SettingsObjectPercent({
			lText : "Settings-SFX",
			setting : "sfx",
			segments : 10,
		});
		this.voiceSlider = new SettingsObjectPercent({
			lText : "Settings-Voice",
			setting : "voice",
			segments : 10,
		});
		this.menuObjects = [
			this.backButton,
			this.musicSlider,
			this.sfxSlider,
			this.voiceSlider
		];
		this.backButton.connectDown = this.musicSlider;
		this.connectVert(this.musicSlider, this.sfxSlider, this.voiceSlider);
		this.cursor = new MenuCursor(this);
		this.hover(this.backButton);
	}
	resize() {
		this.backButton.resize(mainCanvas.width - 100, 0, 100, 40);
		this.musicSlider.resize(mainCanvas.width*1/10, 50, mainCanvas.width*4/5, 50);
		this.sfxSlider.resize(mainCanvas.width*1/10, 110, mainCanvas.width*4/5, 50);
		this.voiceSlider.resize(mainCanvas.width*1/10, 170, mainCanvas.width*4/5, 50);
	}
	update() {
		super.update();
	}
	draw() {
		clearCanvas();
		super.draw();
	}
	back() {
		switchScreen(MainMenu);
	}
}

class SettingsObjectPercent extends MenuButton {
	constructor(args) {
		super(args);
		this.setting = args.setting;
		this.numSegments = args.segments || 10;
		this.segmentIndex = Math.round(settings[this.setting] * this.numSegments);
		this.segments = [];
		for (var i = 0; i <= this.numSegments; i++) {
			this.segments[i] = new SettingsObjectPercentSegment(this, i);
		}
		this.sprites = getSpriteSheet("ButtonBevelGrey");
	}
	resize(...mokey) {
		super.resize(...mokey);
		let segsStart = this.x + this.width/2;
		let segsInterval = Math.floor(this.width/(this.numSegments+1)/2);
		for (var i = 0; i <= this.numSegments; i++) {
			this.segments[i].resize(segsStart + i * segsInterval, this.y+5, segsInterval, this.height-10);
		}
	}
	update(bleh) {
		super.update(bleh);
		if (this.hovered) {
			if (globalController.menuLeftClicked) {
				this.setSegment(this.segmentIndex-1);
			}
			if (globalController.menuRightClicked) {
				this.setSegment(this.segmentIndex+1);
			}
		}
		this.segments.forEach(s=>s.update());
	}
	setSegment(tyu) {
		this.segmentIndex = Math.max(0, Math.min(this.numSegments, tyu));
		this.setSetting();
	}
	setSetting() {
		setSetting(this.setting, this.segmentIndex / this.numSegments);
	}
	draw() {
		mainCtx.fillStyle = this.color || "#808080";
		mainCtx.fillRect(this.x, this.y, this.width, this.height);
		this.sprites.drawBorderOnMain(this.x, this.y, this.width, this.height);
		drawTextInRect(this.text, this.x+4, this.y+4, this.width/2-6, this.height-8, {align:"left", fill:"#FFFFFF"});
		this.segments.forEach(s=>s.draw());
	}
}


class SettingsObjectPercentSegment extends MenuObject {
	constructor(parent, index) {
		super({});
		this.parent = parent;
		this.index = index;
	}
	update(bleh) {
		super.update(bleh);
		if (this.mouseClicked) {
			this.parent.setSegment(this.index);
		}
	}
	draw() {
		mainCtx.fillStyle = this.parent.segmentIndex >= this.index ? "#FFFFFF" : "#000000";
		mainCtx.fillRect(this.x, this.y, this.width-5, this.height);
	}
}