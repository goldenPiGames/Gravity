function startLevelEditor() {
	try {
		switchScreen(new EditorEngine());
	} catch (e) {
		switchScreen(new EditorEngine(STAGE_DATA_EDITOR_DEFAULT));
	}
}

const EDITOR_QUICKSAVE_KEY = "GravvityEditorQuick";

class EditorEngine {
	constructor(stag) {
		if (!stag) {
			var stor = localStorage.getItem(EDITOR_QUICKSAVE_KEY);
			if (!stor) {
				stag = new StageEditing(STAGE_DATA_EDITOR_DEFAULT);
			} else {
				var dats = JSON.parse(stor);
				stag = new StageEditing(dats);
			}
		} else if (!(stag instanceof StageEditing)) {
			stag = new StageEditing(stag);
		}
		this.stage = stag;
		this.sidebar = new EditorSidebar(this);
		this.camera = new DraggableCamera(this.stage);
		this.resizeWorld();
	}
	resize() {
		this.sidebar.resize();
		this.camera.setScreenCenter(this.sidebar.x/2, mainCanvas.height/2);
	}
	resizeWorld() {
		worldCanvas.width = this.stage.width;
		worldCanvas.height = this.stage.height;
		staticWorldCanvas.width = this.stage.width;
		staticWorldCanvas.height = this.stage.height;
	}
	update() {
		this.stage.update();
		this.camera.update();
		this.sidebar.update(this);
	}
	draw() {
		clearCanvas();
		this.camera.draw();
		this.sidebar.draw();
	}
	getJSON() {
		return this.stage.getJSON();
	}
	getPrettyJSON() {
		return makePrettyJSON(this.stage.getJSON());
	}
	playStage() {
		var json = this.quicksave();
		switchScreen(new SingleStageEngine({
			stage : new Stage(json),
			winFunc : ()=>this.returnFromStage(),
			exitFunc : ()=>this.returnFromStage(),
		}));
	}
	returnFromStage() {
		clearStaticWorld();
		switchScreen(this);
	}
	quicksave() {
		var json = this.getJSON();
		localStorage.setItem(EDITOR_QUICKSAVE_KEY, JSON.stringify(json));
		return json;
	}
	exit() {
		this.quicksave();
		switchScreen(new MainMenu());
	}
	loadStage(stag) {
		switchScreen(new EditorEngine(stag));
	}
	requireWidth(to) {
		if (this.stage.width < to) {
			this.stage.width = to;
			this.resizeWorld();
		}
	}
	requireHeight(to) {
		if (this.stage.height < to) {
			this.stage.height = to;
			this.resizeWorld();
		}
	}
	addObject(obj) {
		this.stage.addObject(obj);
	}
	removeObject(obj) {
		this.stage.removeObject(obj);
	}
}
EditorEngine.prototype.controlShow = CONTROL_SHOW_MENU;
EditorEngine.prototype.controlShowCamera = true;

class StageEditing {
	constructor(stuff) {
		this.backgroundData = stuff.background;
		this.background = new BackgroundNothing({}, this);
		this.width = stuff.width;
		this.height = stuff.height;
		this.music = stuff.music;
		this.objects = stuff.objects.map(o=>editorFromRegistry(o)).filter(a=>a);
	}
	update(eng) {
		
	}
	drawWorld() {
		disableImageSmoothing(worldCtx);
		clearWorld();
		//console.log("blah");
		worldCtx.drawImage(staticWorldCanvas, 0, 0);
		this.objects.forEach(oj=>oj.draw(this));
		worldCtx.strokeStyle = "#FF0000";
		worldCtx.lineWidth = 2;
		worldCtx.strokeRect(0, 0, this.width, this.height);
	}
	getJSON() {
		return {
			background : this.backgroundData,
			music : this.music,
			width : this.width,
			height : this.height,
			objects : this.objects.map(o=>o.getJSON()),
		};
	}
	addObject(obj) {
		this.objects.push(obj);
	}
	removeObject(obj) {
		this.objects.splice(this.objects.indexOf(obj), 1);
	}
}

const STAGE_DATA_EDITOR_DEFAULT = {
	width : 800,
	height : 600,
	objects : [
		{
			object : "Player",
			midX : 50,
			midY : 50,
		},
		/*{
			object : "Planet",
			midX : 50,
			midY : 50,
		},*/
		{
			"object" : "StaticGridTerrain",
			"grid" : [
				[4,4,4,4,4,4,4,4,4,4,4,4,4],
				[4,0,0,0,0,0,0,0,0,0,0,0,4],
				[4,0,0,0,0,0,0,0,0,0,0,0,4],
				[4,0,0,0,0,0,0,0,0,0,0,0,4],
				[4,0,0,0,0,0,0,0,0,0,0,0,4],
				[4,0,0,0,0,0,0,0,0,0,0,0,4],
				[4,0,0,0,0,0,0,0,0,0,0,0,4],
				[4,0,0,0,0,0,0,0,0,0,0,0,4],
				[4,0,0,0,0,0,0,0,0,0,0,0,4],
				[4,0,0,0,0,0,0,0,0,0,0,0,4],
				[4,4,4,4,4,4,4,4,4,4,4,4,4]],
			"bank" : [
				{
					"solid" : false,
					"gravity" : "down"
				},
				{
					"solid" : false,
					"gravity" : "left"
				},
				{
					"solid" : false,
					"gravity" : "up"
				},
				{
					"solid" : false,
					"gravity" : "right"
				},
				{
					"solid" : true
				}
			]
		}
	]
}

function makePrettyJSON(ugl) {
	if (!(typeof ugl == "string"))
		ugl = JSON.stringify(ugl);
	//console.log(ulg)
	var prt = "";
	dent = 0;
	var comman = true;
	for (var i = 0; i < ugl.length; i++) {
		if (ugl[i] == "}") {
			dent --;
			prt += "\n" + ("\t").repeat(dent);
		}
		if (ugl[i] == "]") {
			if (comman) {
				dent --;
				prt += "\n" + ("\t").repeat(dent);
			} else {
				comman = true;
			}
		}
		prt += ugl[i];
		if (ugl[i] == "{") {
			dent ++;
			prt += "\n" + ("\t").repeat(dent);
		}
		if (ugl[i] == "[") {
			if (ugl[i+1].match(/[0-9]/)) {
				comman = false;
			} else {
				dent ++;
				prt += "\n" + ("\t").repeat(dent);
			}
		}
		if (ugl[i] == "," && comman) {
			prt += "\n" + ("\t").repeat(dent);
		}
	}
	return prt;
}