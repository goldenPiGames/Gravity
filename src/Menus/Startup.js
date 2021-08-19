var doneControllerStartup = false;

function nextStartup() {
	console.log(navigator.userAgent.indexOf("Firefox"))
	playMusic(MAIN_MENU_MUSIC);
	if (!doneControllerStartup)
		switchScreen(new ControllerStartupScreen());
	else if (!settings.initialLangDone)
		switchScreen(new LangSelectMenu());
	else if (navigator.userAgent.indexOf("Firefox") >= 0 && !settings.ignoreBrowserWarning)
		switchScreen(new FirefoxWarningStartup())
	else if (!settings.initialSettingsDone)
		switchScreen(new SettingsMenu());
	else {
		switchScreen(new MainMenu());
	}
}

class ControllerStartupScreen extends MenuScreen {
	constructor() {
		super();
		doneControllerStartup = true;
		this.butt = new InvisibleButton({
			func:()=>this.proceed(),
		});
		this.hover(this.butt);
		this.menuObjects = [
			this.butt,
		];
		this.sprites = getSpriteSheet("ControllerStartup");
	}
	resize() {
		this.butt.resize(-40, -40, mainCanvas.width+80, mainCanvas.height+80);
		this.cursor.resetPositionOut();
	}
	draw() {
		clearCanvas();
		super.draw();
		this.sprites.drawOnMain("Keyboard", {x:mainCanvas.width/4, y:mainCanvas.height*.2, intOnly:true, maxWidth:mainCanvas.width/2, maxHeight:mainCanvas.height*.4, xadj:.5, yadj:.5});
		this.sprites.drawOnMain("Gamepad", {x:mainCanvas.width*3/4, y:mainCanvas.height*.2, intOnly:true, maxWidth:mainCanvas.width/2, maxHeight:mainCanvas.height*.4, xadj:.5, yadj:.5});
		this.sprites.drawOnMain("Touch", {x:mainCanvas.width/4, y:mainCanvas.height*.6, intOnly:true, maxWidth:mainCanvas.width/2, maxHeight:mainCanvas.height*.4, xadj:.5, yadj:.5});
		this.sprites.drawOnMain("Mouse", {x:mainCanvas.width*3/4, y:mainCanvas.height*.6, intOnly:true, maxWidth:mainCanvas.width/2, maxHeight:mainCanvas.height*.4, xadj:.5, yadj:.5});
		if (globalTimer % 40 < 20) {
			mainCtx.fillStyle = "#00FF00";
			mainCtx.fillRect(mainCanvas.width*.4, mainCanvas.height*.85, mainCanvas.width*.2, mainCanvas.height*.13);
		}
	}
	proceed() {
		nextStartup();
	}
}

class InvisibleButton extends MenuButton {
	draw() {
		
	}
}

class FirefoxWarningStartup extends MenuScreen {
	
	constructor() {
		super();
		setSetting("ignoreBrowserWarning", true);
		this.butt = new InvisibleButton({
			func:()=>this.proceed(),
		});
		this.hover(this.butt);
		this.menuObjects = [
			this.butt,
		];
	}
	resize() {
		this.butt.resize(-40, -40, mainCanvas.width+80, mainCanvas.height+80);
		this.cursor.resetPositionOut();
	}
	draw() {
		clearCanvas();
		super.draw();
		
		drawParagraphInRect(lg("FirefoxWarning-Para1"), 10, 0, mainCanvas.width-20, mainCanvas.height/2, 32);
		if (globalTimer % 40 < 20) {
			mainCtx.fillStyle = "#00FF00";
			mainCtx.fillRect(mainCanvas.width*.4, mainCanvas.height*.85, mainCanvas.width*.2, mainCanvas.height*.13);
		}
	}
	proceed() {
		nextStartup();
	}
}