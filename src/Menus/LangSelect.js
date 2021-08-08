class LangSelectScreen extends MenuScreen {
	constructor() {
		super();
		this.buttons = 
				/*{
					lText : "MainMenu-Jukebox",
					func : function(){doJukebox()}
				},
				{
					lText : "MainMenu-Controls",
					func : function(){doControls()}
				},*/
		this.connectVert(this.playButton, this.editorButton, this.jukeboxButton, this.settingsButton);
		
		this.menuObjects = [
			this.playButton,
			this.editorButton,
			this.jukeboxButton,
			this.settingsButton,
		];
		this.hover(this.playButton);
		this.attract = new AttractModeStageEngine({
			stage : new Stage(STAGE_DATA_MAIN_TITLE),
		});
		//this.sprites = getSpriteSheet("MainMenu");
	}
	resize() {
		this.attract.resize();
		([this.playButton, this.editorButton, this.jukeboxButton, this.settingsButton]).forEach((b, i)=>b.resize(mainCanvas.width/20, mainCanvas.height/2 + mainCanvas.height/10*i, mainCanvas.width*2/5, mainCanvas.height/15));
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

class LangSelectButton extends Button {
	
}