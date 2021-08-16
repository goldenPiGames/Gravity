class LangSelectMenu extends MenuScreen {
	constructor() {
		super();
		playMusic(MAIN_MENU_MUSIC);
		this.backButton = new MenuButton({
			lText : "StageSelect-Back",
			func : ()=> switchScreen(new SettingsMenu()),
			color : "#FF4040",
			bindCancel : true,
		});
		this.langButtons = LANGUAGES.map(l=>new LangSelectButton(l));
				/*{
					lText : "MainMenu-Jukebox",
					func : function(){doJukebox()}
				},
				{
					lText : "MainMenu-Controls",
					func : function(){doControls()}
				},*/
		this.connectHoriz(...this.langButtons);
		
		this.menuObjects = [
			...this.langButtons,
			this.backButton
		];
		this.hover(this.langButtons[0]);
		this.attract = new AttractModeStageEngine({
			stage : new Stage(STAGE_DATA_MAIN_TITLE),
		});
		//this.sprites = getSpriteSheet("MainMenu");
	}
	resize() {
		this.langButtons.forEach((b, i, r)=>b.resize(mainCanvas.width * ((i+1) / (r.length+1)) - 60, mainCanvas.height/2 - 40, 120, 80));
	}
	update(...bump) {
		disableImageSmoothing(mainCtx);
		super.update(...bump);
	}
	draw() {
		clearCanvas();
		super.draw();
	}
}

class LangSelectButton extends MenuButton {
	constructor(lan) {
		super({
			text : LANG[lan]["Lang-Name"],
			func:()=>this.setLang(),
		});
		this.lang = lan;
		this.sprites = getSpriteSheet("LangFlags");
	}
	setLang() {
		setSetting("lang", this.lang);
		switchScreen(new SettingsMenu());
	}
	draw() {
		this.sprites.drawOnMain(this.lang, {x:this.x, y:this.y, scale:this.width/60});
	}
}