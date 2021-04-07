
/*
file
add
objects
edit
*/

class EditorSidebar extends MenuObject {
	constructor(eng) {
		super();
		this.engine = eng;
		this.cursor = new MenuCursor(this);
		this.switchSub(new EditorSidebarMain());
	}
	switchSub(sub) {
		this.sub = sub;
		this.hover(this.sub.scrollObjects[1] || this.sub.scrollObjects[0]);
		this.sub.setParent(this);
		this.resizeSub();
	}
	resize() {
		this.topHeight = 40;
		var wideness = Math.ceil(mainCanvas.width/4);
		this.resizeRect(mainCanvas.width-wideness, 0, wideness, mainCanvas.height);
		this.resizeSub();
	}
	resizeSub() {
		this.sub.resize(this.x, this.topHeight, this.width, this.height-this.topHeight)
	}
	update(nyaa) {
		super.update(nyaa);
		this.sub.update(this);
		this.cursor.update(nyaa);
	}
	draw() {
		mainCtx.fillStyle = "#606060";
		mainCtx.fillRect(this.x, this.y, this.width, this.height);
		this.sub.draw();
		this.cursor.draw();
	}
}

class EditorSidebarSub extends ScrollContainer {
	constructor(butt) {
		super();
		this.scrollObjects = [
			new EditorPanelButton({
				lText : "Editor-Back",
				func : ()=>this.back()
			}),
			...butt,
		];
		this.currentScroll = 0;
		this.connect();
	}
	resize(...bleh) {
		super.resize(...bleh);
	}
	update(...blugh) {
		if (globalController.cancelClicked)
			this.back();
		else {
			super.update(...blugh);
		}
	}
	draw(...byeah) {
		super.draw(...byeah);
	}
	setParent(par) {
		this.parent = par;
		this.engine = par.engine;
	}
}

class EditorSidebarMain extends EditorSidebarSub {
	constructor() {
		super([
			new EditorPanelButton({
				lText : "Editor-SelectObject",
				func : ()=>this.parent.switchSub(new EditorSidebarSelectObject(this.engine.stage))
			}),
			new EditorPanelButton({
				lText : "Editor-AddObject",
				func : ()=>this.parent.switchSub(new EditorSidebarAddObject())
			}),
			new EditorPanelButton({
				lText : "Editor-StageParams",
				func : ()=>this.parent.switchSub(new EditorSidebarStageParams(this.engine.stage))
			}),
			new EditorPanelButton({
				lText : "Editor-Play",
				func : ()=>this.engine.playStage()
			}),
			new EditorPanelButton({
				lText : "Editor-File",
				func : ()=>this.parent.switchSub(new EditorSidebarFile())
			}),
		]);
	}
	back() {
		this.engine.exit();
	}
}

class EditorSidebarStageParams extends EditorSidebarSub {
	constructor(stage) {
		super([
			new EditorPanelButton({
				lText: "Editor-File-LoadBaseStage",
				func : ()=>this.parent.switchSub(new EditorSidebarLoadBaseStage())
			}),
			new EditorPanelNumber(stage, {
				lText : "StageParams-Width",
				param : "width",
				min : 400,
				max : 4000,
				after : ()=>this.engine.resizeWorld(),
			}),
			new EditorPanelNumber(stage, {
				lText : "StageParams-Height",
				param : "height",
				min : 400,
				max : 4000,
				after : ()=>this.engine.resizeWorld(),
			}),
		]);
		this.stage = stage;
	}
	back() {
		this.parent.switchSub(new EditorSidebarMain());
	}
}

class EditorSidebarFile extends EditorSidebarSub {
	constructor() {
		super([
			new EditorPanelButton({
				lText: "Editor-File-LoadBaseStage",
				func : ()=>this.parent.switchSub(new EditorSidebarLoadBaseStage())
			}),
		]);
	}
	back() {
		this.parent.switchSub(new EditorSidebarMain());
	}
}

class EditorSidebarLoadBaseStage extends EditorSidebarSub {
	constructor() {
		super([
			...SELECTABLE_STAGES.map(sid=>new EditorPanelButton({
				lText : "Stage-"+sid,
				func : ()=>this.engine.loadStage(STAGE_REGISTRY[sid])
			})),
		]);
	}
	back() {
		this.parent.switchSub(new EditorSidebarFile());
	}
}

class EditorSidebarSelectObject extends EditorSidebarSub {
	constructor(stage) {
		super([
			...stage.objects.map(o=>new EditorPanelSelectObject(o)),
		]);
	}
	back() {
		this.parent.switchSub(new EditorSidebarMain());
	}
}

class EditorSidebarAddObject extends EditorSidebarSub {
	constructor() {
		super([
			...EDITOR_REGISTRY_ADDABLE.map(e=>new EditorPanelAddObject(e)),
		]);
	}
	back() {
		this.parent.switchSub(new EditorSidebarMain());
	}
}

class EditorSidebarEditObject extends EditorSidebarSub {
	constructor(obj) {
		super([
			...obj.getEditorPanels(),
			...(obj.deletable ? [new EditorPanelButton({
				lText : "Editor-EditObject-Delete",
				func : ()=>this.deletthis(),
				color : "#B00000",
			})] : []),
		]);
		this.object = obj;
	}
	back() {
		this.parent.switchSub(new EditorSidebarSelectObject(this.engine.stage))
	}
	deletthis() {
		this.engine.removeObject(this.object);
		this.back();
	}
}


class EditorPanel extends ScrollObject {
	constructor(args) {
		super(args);
		this.color = args.color || "#B0B0B0";
	}
	update(...pomf) {
		super.update(...pomf);
	}
	updateSelected() {
		
	}
	draw() {
		mainCtx.lineWidth = 2;
		mainCtx.fillStyle = this.color;
		mainCtx.fillRect(this.x, this.y, this.width, this.height);
	}
	drawTextNormally() {
		drawTextInRect(this.text, this.x, this.y, this.width, this.height, {fill:"#FFFFFF"});
	}
}

class EditorPanelButton extends EditorPanel {
	constructor(args) {
		super(args);
		this.func = args.func;
	}
	update(...uwu) {
		super.update(...uwu);
		if (this.clicked)
			this.func();
	}
	draw() {
		super.draw();
		this.drawTextNormally();
	}
}

class EditorPanelEditObject extends EditorPanel {
	constructor(object) {
		super({
			lText : object.lText
		});
		//console.log(object.lText);
		this.object = object;
	}
	update(uwu) {
		super.update(uwu);
		if (this.clicked)
			uwu.switchSub(new EditorSidebarEditObject(this.object));
	}
	draw() {
		super.draw();
		this.drawTextNormally();
	}
}

class EditorPanelAddObject extends EditorPanel {
	constructor(objid) {
		super({
			lText : "Object-"+objid
		});
		//console.log(object.lText);
		this.objectID = objid;
	}
	update(uwu) {
		super.update(uwu);
		if (this.clicked) {
			var blobj = new editorFromRegistryDefault(this.objectID, uwu.engine.camera);
			uwu.engine.addObject(blobj);
			uwu.switchSub(new EditorSidebarEditObject(blobj));
		}
	}
	draw() {
		super.draw();
		this.drawTextNormally();
	}
}

class EditorPanelSelectObject extends EditorPanel {
	constructor(object) {
		super({
			lText : object.lText
		});
		//console.log(object.lText);
		this.object = object;
	}
	update(uwu) {
		super.update(uwu);
		if (this.clicked)
			uwu.switchSub(new EditorSidebarEditObject(this.object));
	}
	draw() {
		super.draw();
		this.drawTextNormally();
	}
}

