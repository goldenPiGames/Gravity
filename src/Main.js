var backgroundBox;
var mainCanvas;
var mainCtx;
var fcanvas;
var fctx;
var worldCanvas;
var worldCtx;
var staticWorldCanvas;
var staticWorldCtx;
//var stage;
const MISC_SPRITE_NAMES = ["MainMenuLogo", "Selector", "Paused", "SelectStage", "SelectStageNo", "SelectStage100", "SelectEnd", "SelectEndNo", "SelectCorners", "Gamepad"]
var miscSprites;
var miscSprites = {};
var miscSFX = {};
var emergencyStuff;
var codeHere;
//var usingPizz = settings.sfxSystem;

//var stageBackground;

function begin() {
	backgroundBox = document.getElementById("BackgroundBox");
	
	mainCanvas = document.getElementById("MainCanvas");
	mainCtx = mainCanvas.getContext("2d");
	mainCtx.imageSmoothingEnabled = false;
	mainCtx.mozImageSmoothingEnabled = false;
	mainCtx.webkitImageSmoothingEnabled = false;
	
	/*fcanvas = document.getElementById("ForeCanvas");
	fctx = fcanvas.getContext("2d");
	fctx.imageSmoothingEnabled = false;
//	fctx.mozImageSmoothingEnabled = false;
	fctx.webkitImageSmoothingEnabled = false;*/
	
	worldCanvas = document.getElementById("WorldCanvas");
	worldCtx = worldCanvas.getContext("2d");
	worldCtx.imageSmoothingEnabled = false;
	worldCtx.mozImageSmoothingEnabled = false;
	worldCtx.webkitImageSmoothingEnabled = false;
	
	staticWorldCanvas = document.getElementById("StaticWorldCanvas");
	staticWorldCtx = staticWorldCanvas.getContext("2d");
	staticWorldCtx.imageSmoothingEnabled = false;
	staticWorldCtx.mozImageSmoothingEnabled = false;
	staticWorldCtx.webkitImageSmoothingEnabled = false;
	
	codeHere = document.getElementById("CodeHere");
	
	emergencyStuff = document.getElementById("Emergency");
	//initMusic();
	//loadGame();
	//loadReturn = begin2;
	//resetLoading();
	/*MISC_SPRITE_NAMES.forEach(function(nom) {
		miscSprites[nom] = makeImage("src/MiscSprites/"+nom+".png");
	});*/
	//TODO make spritesheet for misc sprites
	//miscSprites = makeSprites("src/MiscSprites.png")
	addControlEvents();
	initMusic();
	initSFX();
	loadSettings();
	
	begin2();
}

function begin2() {
	disableImageSmoothing(mainCtx)
	nextStartup();
	engine.run();
}

function setImageSmoothing(ctx, to) {
	ctx.imageSmoothingEnabled = to;
	ctx.mozImageSmoothingEnabled = to;
	ctx.webkitImageSmoothingEnabled = to;
}

function disableImageSmoothing(ctx = mainCtx) {
	setImageSmoothing(ctx, false);
}

function enableImageSmoothing(ctx = mainCtx) {
	setImageSmoothing(ctx, true);
}

function openWindow(href) {
	window.open(href);
}

function doNothing() {};

function composeMethods(to, from, noms) {
	noms.forEach(nom=>to.prototype[nom]=from.prototype[nom]);
}


function revealWorldCanvas() {
	worldCanvas.hidden = false;
	staticWorldCanvas.hidden = false;
	document.getElementById("Worlds").hidden = false;
	backgroundBox.style.overflow = "scroll";
}