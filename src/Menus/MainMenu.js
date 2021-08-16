class MainMenu extends MenuScreen {
	constructor() {
		super();
		this.playButton = new MenuButton({
			lText : "MainMenu-Play",
			func : function() {
				switchScreen(StageSelectMenu)
			}
		});
		this.editorButton = new MenuButton({
			lText : "MainMenu-Editor",
			func : function() {
				startLevelEditor();
			}
		});
		this.jukeboxButton = new MenuButton({
			lText : "MainMenu-Jukebox",
			func : ()=>switchScreen(new JukeboxMenu())
		});
		this.settingsButton = new MenuButton({
			lText : "MainMenu-Settings",
			func : ()=>switchScreen(new SettingsMenu())
		});
		this.creditsButton = new MenuButton({
			lText : "MainMenu-Credits",
			func : ()=>switchScreen(new CreditsScreen())
		});
				/*{
					lText : "MainMenu-Jukebox",
					func : function(){doJukebox()}
				},
				{
					lText : "MainMenu-Controls",
					func : function(){doControls()}
				},*/
		
		this.mainObjects = [
			this.playButton,
			//this.editorButton,
			this.jukeboxButton,
			this.settingsButton,
			this.creditsButton,
		];
		this.connectVert(...this.mainObjects);
		
		this.menuObjects = [...this.mainObjects];
		this.hover(this.playButton);
		this.attract = new AttractModeStageEngine({
			stage : new Stage(STAGE_DATA_MAIN_TITLE),
		});
		//this.sprites = getSpriteSheet("MainMenu");
	}
	resize() {
		this.attract.resize();
		(this.mainObjects).forEach((b, i)=>b.resize(mainCanvas.width/20, mainCanvas.height/2 + mainCanvas.height/12*i, mainCanvas.width*2/5, mainCanvas.height/15));
	}
	update() {
		super.update();
		if (runnee == this)
			this.attract.update();
	}
	draw() {
		clearCanvas();
		this.attract.draw();
		super.draw();
		mainCtx.fillStyle = "#FFFFFF";
		drawTextInRect("©2021 goldenPiGames", 0, mainCanvas.height-20, 300, 20, {align:"left", fill:"#FFFFFF", stroke:"#000000"});
		//drawTextInRect(lg("Title"), 0, 0, mainCanvas.width, 50);
		//drawParagraphInRect(lg("MainMenu-Unfinished"), 0, 50, mainCanvas.width, 50, 24);
		//drawParagraphInRect(lg("MainMenu-Instructions"), 0, mainCanvas.height*2/3, mainCanvas.width, mainCanvas.height/3, 24);
	}
	switchin() {
		this.attract.switchin();
	}
}

const POPUP_LINE_HEIGHT = 50;

function drawPopup(lines) {
	var length = lines.length;
	
	mainCtx.lineWidth = 4;
	mainCtx.strokeStyle = "#FFFFFF";
	mainCtx.strokeRect(mainCanvas.width/2-400, mainCanvas.height/2 - length*POPUP_LINE_HEIGHT/2, 800, length*POPUP_LINE_HEIGHT);
	mainCtx.fillStyle = "#000000F0";
	mainCtx.fillRect(mainCanvas.width/2-400, mainCanvas.height/2 - length*POPUP_LINE_HEIGHT/2, 800, length*POPUP_LINE_HEIGHT);
	mainCtx.fillStyle = "#FF0000";
	mainCtx.textAlign = "center";
	mainCtx.font = "40px "+getFont();
	let top = mainCanvas.height/2 - (length-2)*POPUP_LINE_HEIGHT/2 - 10;
	for (var i = 0; i < length; i++) {
		mainCtx.fillText(lines[i], mainCanvas.width/2, top + i*POPUP_LINE_HEIGHT);
	}
	/*mainCtx.fillText("Your Anym is less than par.", mainCanvas.width/2, mainCanvas.height/2 - 55);
	mainCtx.fillText("You most likely cannot finish.", mainCanvas.width/2, mainCanvas.height/2 - 5);
	mainCtx.fillText(globalController.getBindText("select") + ": Proceed anyway", mainCanvas.width/2, mainCanvas.height/2 + 45);
	mainCtx.fillText(globalController.getBindText("cancel") + ": Cancel", mainCanvas.width/2, mainCanvas.height/2 + 95);*/
}