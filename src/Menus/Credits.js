const MY_SITES = [
	{name:"Newgrounds", href:"https://goldenpigames.newgrounds.com/"},
	{name:"Discord", href:"https://discord.gg/ErnbtbJ"},
	{name:"Patreon", href:"https://www.patreon.com/goldenPiGames"},
	{name:"Reddit", href:"https://old.reddit.com/r/goldenPiGames/"},
	{name:"YouTube", href:"https://www.youtube.com/channel/UCb4QliR5GWppUqOLXBYKYHw"},
	{name:"GitHub", href:"https://github.com/goldenPiGames"},
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
		this.speechButton.enabled = this.finished;
		this.creditMe = new CreditsName({
			"name" : "Prexot",
			"links" : MY_SITES,
		});
		this.creditsMusic = MUSICIAN_CREDITS.map(c=>new CreditsName(c));
		this.menuObjects = [
			this.backButton,
			this.creditMe,
			...this.creditsMusic,
			this.speechButton,
		]
		this.connectVert(this.backButton, this.creditMe, ...this.creditsMusic, this.speechButton);
		this.dialogHandler = new DialogHandler();
		this.hover(this.backButton);
	}
	resize() {
		this.backButton.resize(mainCanvas.width - 100, 0, 100, 40);
		this.creditMe.resize(0, mainCanvas.height/4, mainCanvas.width, 60);
		let creditMusicHeight = Math.min(60, mainCanvas.height*2/5/this.creditsMusic.length);
		this.creditsMusic.forEach((c,i)=>c.resize(0, mainCanvas.height/2+creditMusicHeight*i, mainCanvas.width, creditMusicHeight));
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
		drawTextInRect(lg("Credits-IDid"), 0, this.creditMe.y - 60, mainCanvas.width, 60);
		drawTextInRect(lg("Credits-Music"), 0, this.creditsMusic[0].y - 60, mainCanvas.width, 60);
		this.dialogHandler.draw();
	}
	startSpeech() {
		this.dialogHandler.startDialogIfEmpty([
			{speakerID:"me", lText:"Credits-Speech-00Intro", duration:150},
			{speakerID:"me", lText:"Credits-Speech-01IDid", duration:150},
			{speakerID:"me", lText:"Credits-Speech-02Musicians", duration:150},
			{speakerID:"me", lText:"Credits-Speech-03MusicJuke", duration:150},
			{speakerID:"me", lText:"Credits-Speech-04MusicThanks", duration:150},
			{speakerID:"me", lText:"Credits-Speech-05ThankYou", duration:150},
			{speakerID:"me", lText:"Credits-Speech-06ISpent", duration:150},
			{speakerID:"me", lText:"Credits-Speech-07Worth", duration:150},
			this.finishedPar ? {speakerID:"me", lText:"Credits-Speech-08DoPar", duration:150} : {speakerID:"me", lText:"Credits-Speech-08DidPar", duration:150},
			{speakerID:"me", lText:"Credits-Speech-09MoveOn", duration:150},
			{speakerID:"me", lText:"Credits-Speech-10LastLegacy", duration:150},
			{speakerID:"me", lText:"Credits-Speech-11LastLegacyGush", duration:150},
			{speakerID:"me", lText:"Credits-Speech-12FlashPoint", duration:150},
			{speakerID:"me", lText:"Credits-Speech-13Recommend1", duration:150},
			{speakerID:"me", lText:"Credits-Speech-14Recommend2", duration:150},
			{speakerID:"me", lText:"Credits-Speech-15Recommend3", duration:150},
			{speakerID:"me", lText:"Credits-Speech-16Outro", duration:150},
			{speakerID:"me", lText:"Credits-Speech-17Farewell", duration:150},
		]);
	}
}

class CreditsName extends MenuObject {
	constructor(args) {
		super();
		this.name = args.name;
		this.linkButtons = new LinkIconRow(args);
	}
	resize(x, y, width, height) {
		super.resize(x, y, width, height);
		this.linkButtons.resize(this.x+this.width/2+10, this.y, this.width/2-10, this.height);
	}
	getConnectForward() {
		return this.linkButtons;
	}
	setConnectUp(t) {
		this.linkButtons.setConnectUp(t);
	}
	setConnectDown(t) {
		this.linkButtons.setConnectDown(t);
	}
	update(...a) {
		this.linkButtons.update(...a);
	}
	draw(...a) {
		drawTextInRect(this.name, this.x, this.y, this.width/2-10, this.height, {fill:"#FFFFFF", stroke:"#000000", align:"right"})
		this.linkButtons.draw(a);
	}
}
CreditsName.prototype.hoverable = false;
CreditsName.prototype.doesConnectForward = true;

class LinkIconRow extends MenuObject {
	constructor(args) {
		super();
		this.linkButtons = (args.links || args.sites || args).map(s=>new LinkIconButton(s));
		this.connect();
	}
	connect() {
		for (var i = 0; i < this.linkButtons.length - 1; i++) {
			this.linkButtons[i].connectRight = this.linkButtons[i+1];
			this.linkButtons[i+1].connectLeft = this.linkButtons[i];
		}
	}
	setConnectUp(t) {
		this.linkButtons.forEach(l=>l.setConnectUp(t));
	}
	setConnectDown(t) {
		this.linkButtons.forEach(l=>l.setConnectDown(t));
	}
	setConnectLeft(t) {
		this.linkButtons[0].setConnectLeft(t);
	}
	setConnectRight(t) {
		this.linkButtons[this.linkButtons.length-1].setConnectRight(t);
	}
	resize(x, y, width, height) {
		super.resize(x, y, width, height);
		let linkSize = Math.min(this.width * 2 / ((runnee instanceof CreditsScreen ? MY_SITES : this.linkButtons).length*2+1), this.height) >= 60 ? 60 : 30;
		this.linkButtons.map((l,i)=>l.resize(this.x + linkSize*7/6 * i, this.y + this.height/2 - linkSize/2, linkSize, linkSize));
	}
	getConnectForward() {
		return this.linkButtons[0];
	}
	update(...a) {
		this.linkButtons.forEach(i=>i.update(...a));
	}
	draw(...a) {
		this.linkButtons.forEach(i=>i.draw(a));
	}
}
LinkIconRow.prototype.hoverable = false;
LinkIconRow.prototype.doesConnectForward = true;

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