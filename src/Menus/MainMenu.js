function doMainMenu() {
	emergencyStuff.hidden = false;
	runnee = mainMenu;
	mainMenu.flowY = 0;
	mainMenu.flowFirst = true;
}
const MAIN_BUTTON_START = 450;
const MAIN_BUTTON_SPACING = 50;
const MAIN_FLOW_HEIGHT = 300;
const MAIN_FLOW_SPEED = 15;

class MainMenu extends SingleMenuScreen {
	constructor() {
		super({
			mainButtons : [
				/*{
					lText : "MainMenu-Play",
					func : function() {
						selectNewGame();
					}
				},*/
				{
					lText : "MainMenu-Play",
					func : function() {
						selectNewGame();
						//switchScreen(NewGameMenu);
					}
				},
				{
					lText : "MainMenu-Editor",
					func : function() {
						startLevelEditor();
						//switchScreen(NewGameMenu);
					}
				},
				/*{
					lText : "MainMenu-Jukebox",
					func : function(){doJukebox()}
				},
				{
					lText : "MainMenu-Settings",
					func : function(){doSettings()}
				},
				{
					lText : "MainMenu-Controls",
					func : function(){doControls()}
				},*/
			],
		});
		//this.sprites = getSpriteSheet("MainMenu");
	}
	update() {
		super.update();
	}
	draw() {
		mainCtx.globalAlpha = 1;
		//this.drawFlow();
		super.draw();
		mainCtx.fillStyle = "#FFFFFF";
		drawTextInRect(lg("Title"), 0, 0, mainCanvas.width, 50);
		drawParagraphInRect(lg("MainMenu-Unfinished"), 0, 50, mainCanvas.width, 50, 24);
		drawParagraphInRect(lg("MainMenu-Instructions"), 0, mainCanvas.height*2/3, mainCanvas.width, mainCanvas.height/3, 24);
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