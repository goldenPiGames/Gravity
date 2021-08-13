const MY_SITES = [
	{name:"Newgrounds", href:"https://goldenpigames.newgrounds.com/"},
	{name:"GitHub", href:"https://github.com/goldenPiGames"},
	{name:"YouTube", href:"https://www.youtube.com/channel/UCb4QliR5GWppUqOLXBYKYHw"},
	{name:"Patreon", href:"https://www.patreon.com/goldenPiGames"}
];

class CreditsScreen extends MenuScreen {
	constructor(args = {}) {
		super();
		this.finished = localStorage.getItem(BEST_TIME_SAVE_PREFIX + SELECTABLE_STAGES[SELECTABLE_STAGES.length-1]);;
		if (args.speech) {
			this.startSpeech;
		}
		this.backButton = new MenuButton({
			lText : "Credits-Back",
			func : ()=>switchScreen(new MainMenu()),
			color : "#FF4040",
			bindCancel : true,
		});
		this.speechButton = new MenuButton({
			lText : "Credits-Speech",
			func : ()=>this.startSpeech(),
		});
		this.speechButton.enabled = this.finished
		this.myLinkButtons = MY_SITES.map(s=>new LinkIconButton(s));
		this.connectHoriz(...this.myLinkButtons);
		this.menuObjects = [
			this.backButton,
			...this.myLinkButtons,
			this.speechButton,
		]
		this.connectVert(this.backButton, this.myLinkButtons[0], this.speechButton);
		this.dialogHandler = new DialogHandler();
		this.hover(this.backButton);
	}
	resize() {
		this.backButton.resize(mainCanvas.width - 100, 0, 100, 40);
		this.myLinkButtons.map((l,i)=>l.resize(mainCanvas.width/2+70*i, mainCanvas.height/4, 60, 60));
		if (this.finished)
			this.speechButton.resize(mainCanvas.width - 200, mainCanvas.height - 40, 200, 40);
	}
	update() {
		super.update();
		this.dialogHandler.update();
	}
	draw() {
		clearCanvas();
		super.draw();
		this.dialogHandler.draw();
	}
	startSpeech() {
		this.dialogHandler//TODO
	}
}

class LinkIconButton extends MenuButton {
	constructor(args) {
		super({
			text : args.text || args.name,
			func : ()=>this.open()
		})
		this.href = args.href;
		this.spriteName = args.icon || args.name || "Website";
		this.sprites = getSpriteSheet("LinkIcons");
	}
	draw() {
		this.sprites.drawOnMain(this.spriteName, {x:this.x, y:this.y, width:this.width, height:this.height});
	}
	open() {
		openWindow(this.href);
	}
}