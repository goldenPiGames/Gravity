class JukeboxMenu extends MenuScreen {
	constructor(rightMenu) {
		super(rightMenu);
		this.backButton = new MenuButton({
			lText : "StageSelect-Back",
			func : ()=>this.back(),
			color : "#FF4040",
			bindCancel : true,
		});
		this.songScroll = new JukeboxScrollContainer();
		this.pauseButton = new MenuButton({
			lText : "Jukebox-Pause",
			func : ()=>this.togglePause()
		});
		this.refreshSong();
		this.songScroll.setConnectRight(this.pauseButton);
		this.backButton.setConnectLeft(this.pauseButton);
		this.pauseButton.setConnectRight(this.backButton);
		this.rebuildMenuObjects();
		this.hover(this.songScroll.scrollObjects[0]);
	}
	resize() {
		this.backButton.resize(mainCanvas.width - 100, 0, 100, 40);
		var midx = mainCanvas.width*.6;
		this.songScroll.resize(0, 0, midx, mainCanvas.height);
		var swid = Math.floor(mainCanvas.width - midx) - 10;
		this.pauseButton.resize(midx, 5, swid/2, 40);
		//this.volumeSlider.resize(midx+10, 100, 200, 30);
		this.resizeSideButtons();
	}
	resizeSideButtons() {
		if (!this.songScroll.width)
			return;
		this.varButtons.forEach((l, i)=>l.resize(this.songScroll.width+10, mainCanvas.height/3 + 40*i, 200, 35));
		if (this.linkButtons)
			this.linkButtons.resize(this.songScroll.width+10, mainCanvas.height*2/3, mainCanvas.width-this.songScroll.width-15, 69);
	}
	rebuildMenuObjects() {
		this.menuObjects = [
			this.backButton,
			this.songScroll,
			this.pauseButton,
			...this.varButtons,
			this.linkButtons
		].filter(a=>a);
		this.connectVert(this.pauseButton, ...this.varButtons, this.linkButtons);
		[this.pauseButton, ...this.varButtons, this.linkButtons].filter(a=>a).forEach(s=>s.setConnectLeft(this.songScroll));
	}
	update() {
		super.update();
		if (song != this.lastSong) {
			this.refreshSong();
		}
		this.pauseButton.text = music.paused ? lg("Jukebox-Play") : lg("Jukebox-Pause");
	}
	draw() {
		clearCanvas();
		//this.pauseButton.text = music.paused ? "Play" : "Pause";
		super.draw();
	}
	back() {
		switchScreen(MainMenu);
	}
	playSong(nom) {
		setSetting("muted", false);
		playMusic(nom);
		this.refreshSong();
	}
	refreshSong() {
		this.lastSong = song;
		if (song) {
			this.linkButtons = new LinkIconRow(song.sites);
			this.varButtons = song.vars ? song.varNames.map((v,i)=>new MenuButton({
				text : v,
				func : ()=>setMusicVar(i)
			})) : [];
			this.rebuildMenuObjects();
			this.resizeSideButtons();
		} else {
			this.linkButtons = false;
			this.varButtons = [];
		}
	}
	togglePause() {
		if (music.paused) {
			music.play();
		} else {
			music.pause();
		}
	}
	setSliderBounds() {
		this.positionSlider.max = song ? (jukeboxSpecs.shuffle ? music.duration : song.loopEnd) || music.duration : 60;
	}
}
var songList = SONG_LIST.slice();


class JukeboxScrollContainer extends ScrollContainer {
	constructor() {
		super();
		this.scrollObjects = SONG_LIST.map(i=>new JukeboxScrollObject(i));
		this.connect();
	}
	getStartHover() {
		return this.scrollObjects[0];
	}
}

class JukeboxScrollObject extends ScrollObject {
	constructor(songData) {
		super({
			text : songData.name,
			needDoubleTap : true,
		});
		this.songData = songData;
		this.songName = this.songData.name;
		this.sprites = getSpriteSheet("ButtonBevelGrey");
	}
	update(...wummy) {
		super.update(...wummy);
		if (this.clicked) {
			playMusic(this.songName);
		}
	}
	draw() {
		mainCtx.fillStyle = this.color || "#808080";
		mainCtx.fillRect(this.x, this.y, this.width, this.height);
		this.sprites.drawBorderOnMain(this.x, this.y, this.width, this.height);
		mainCtx.fillStyle = "#FFFFFF";
		let coler = song == this.songData ? "#00FF00" : "#FFFFFF";
		drawTextInRect(this.songData.name, this.x+4, this.y+4, this.width-8, this.height-8, {fill:coler, align:"left"});
		drawTextInRect(this.songData.by, this.x+4, this.y+4, this.width-8, this.height-8, {fill:coler, align:"right"});
	}
}