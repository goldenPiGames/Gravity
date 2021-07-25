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
		this.touchMenuToggle = new SettingsObjectToggle({
			lText : "Settings-TouchMenu",
			setting : "directTouch"
		});
		this.settingObjects = [
			this.musicSlider,
			this.sfxSlider,
			this.voiceSlider,
			this.touchMenuToggle
		]
		this.menuObjects = [
			this.backButton,
			...this.settingObjects
		];
		this.backButton.connectDown = this.musicSlider;
		this.connectVert(...this.settingObjects);
		this.cursor = new MenuCursor(this);
		this.hover(this.backButton);
	}
	resize() {
		this.backButton.resize(mainCanvas.width - 100, 0, 100, 40);
		this.settingObjects.forEach((s, i) => {
			s.resize(mainCanvas.width*1/10, 50+60*i, mainCanvas.width*4/5, 50);
		});
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

class SettingsObjectToggle extends MenuButton {
	constructor(args) {
		super(args);
		this.setting = args.setting;
		this.lTextTrue = this.lText + "-true";
		this.textTrue = lg(this.lTextTrue);
		this.lTextFalse = this.lText + "-false";
		this.textFalse = lg(this.lTextFalse);
	}
	update(bleh) {
		super.update(bleh);
		if (this.clicked) {
			setSetting(this.setting, !settings[this.setting]);
		}
	}
	draw() {
		mainCtx.fillStyle = this.color || "#808080";
		mainCtx.fillRect(this.x, this.y, this.width, this.height);
		this.sprites.drawBorderOnMain(this.x, this.y, this.width, this.height);
		drawTextInRect(this.text, this.x+4, this.y+4, this.width/3-8, this.height-8, {align:"left", fill:"#FFFFFF"});
		drawTextInRect(this.textFalse, this.x+this.width/3+4, this.y+4, this.width/3-8, this.height-8, {align:"left", fill:"#FFFFFF", align:"center"});
		drawTextInRect(this.textTrue, this.x+this.width*2/3+4, this.y+4, this.width/3-8, this.height-8, {align:"left", fill:"#FFFFFF", align:"center"});
		mainCtx.strokeStyle = "#FFFFFF";
		mainCtx.lineWidth = 4;
		mainCtx.strokeRect(this.x + this.width*(settings[this.setting]?2:1)/3+3, this.y+3, this.width/3-6, this.height-6);
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