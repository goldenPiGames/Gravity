

class EditorSidebarObjectGrid extends EditorSidebarSub {
	constructor(obj) {
		super([
			
		])
		this.object = obj;
		this.gridOver = new EditorGridOver(this.object);
		this.selectBank(0);
	}
	update(yam) {
		super.update(yam);
		if (this.parent.mouseHovered)
			mouse.obstruct();
		this.gridOver.update(yam);
	}
	draw() {
		super.draw();
		this.gridOver.draw();
	}
	setParent(par) {
		super.setParent(par);
		this.gridOver.setParent(par, this);
		let close = this.gridOver.getClosestToCamera(this.engine.camera)
		this.parent.hover(close);
		this.scrollObjects[0].connectLeft = close;
	}
	back() {
		this.parent.switchSub(new EditorSidebarEditObject(this.object));
	}
	selectBank(decks) {
		this.bankSelected = decks;
		this.gridOver.bankSelected = decks;
	}
}

class EditorSidebarObjectGridMenu extends EditorSidebarSub {
	constructor(til) {
		super([
			...til.object.getEditorPanelsBankSelect(),
			new EditorPanelButton({
				lText : "Editor-EditObject-Grid-AddColumn",
				func : ()=>this.addColumn(),
			}),
			new EditorPanelButton({
				lText : "Editor-EditObject-Grid-RemoveColumn",
				func : ()=>this.removeColumn(),
			}),
			new EditorPanelButton({
				lText : "Editor-EditObject-Grid-AddRow",
				func : ()=>this.addRow(),
			}),
			new EditorPanelButton({
				lText : "Editor-EditObject-Grid-RemoveRow",
				func : ()=>this.removeRow(),
			}),
		])
		this.tileOver = til;
		this.gridOver = til.parent;
		this.returnTo = this.gridOver.parentSub;
	}
	update(yam) {
		super.update(yam);
	}
	setParent(par) {
		super.setParent(par);
		this.parent.hover(this.scrollObjects[this.gridOver.bankSelected + 1]);
	}
	draw() {
		super.draw();
		this.tileOver.drawFlashing();
	}
	back() {
		this.parent.switchSub(this.returnTo);
		this.parent.hover(this.tileOver);
	}
	selectBank(decks) {
		this.returnTo.selectBank(decks);
		this.back();
	}
	addColumn() {
		this.tileOver = this.gridOver.addColumn(this.tileOver);
		this.engine.requireWidth(this.gridOver.object.getBoundRight());
	}
	removeColumn() {
		this.tileOver = this.gridOver.removeColumn(this.tileOver);
	}
	addRow() {
		this.tileOver = this.gridOver.addRow(this.tileOver);
		this.engine.requireHeight(this.gridOver.object.getBoundBottom());
	}
	removeRow() {
		this.tileOver = this.gridOver.removeRow(this.tileOver);
	}
}

class EditorGridOver extends MenuObject {
	constructor(obj) {
		super();
		this.object = obj;
		this.redoTiles();
		this.bankHolding = null;
	}
	setParent(par, sub) {
		this.parent = par;
		this.parentSub = sub;
		this.camera = this.parent.engine.camera;
	}
	redoTiles() {
		this.tiles = this.object.tiles.map2d(t=>new EditorGridOverTile(t, this));
		let wid = this.tiles.length;
		let hit = this.tiles[0].length;
		for (var i = 0; i < wid; i++) {
			for (var j = 0; j < hit; j++) {
				if (!this.object.invertVertGridMove) {
					this.tiles[i][j].connectDown = this.tiles[i][(j+1)%hit];
					this.tiles[i][(j+1)%hit].connectUp = this.tiles[i][j];
				} else {
					this.tiles[i][j].connectUp = this.tiles[i][(j+1)%hit];
					this.tiles[i][(j+1)%hit].connectDown = this.tiles[i][j];
				}
				this.tiles[i][j].connectRight = this.tiles[(i+1)%wid][j];
				this.tiles[(i+1)%wid][j].connectLeft = this.tiles[i][j];
			}
		}
	}
	update(yam) {
		this.object.updateHoveredCamera(this.camera);
		this.tiles.forEach2d(t=>t.update(yam));
		if (!mouse.down && !globalController.select) {
			this.bankHolding = null;
		}
	}
	draw() {
		
	}
	addColumn(til) {
		var x = til.tile.gridX;
		var y = til.tile.gridY;
		this.object.addColumn(til.tile.gridX);
		this.redoTiles();
		return this.tiles[x][y];
	}
	removeColumn(til) {
		var x = til.tile.gridX;
		var y = til.tile.gridY;
		this.object.removeColumn(til.tile.gridX);
		this.redoTiles();
		return x >= this.tiles.length ? this.tiles[x-1][y] : this.tiles[x][y];
	}
	addRow(til) {
		var x = til.tile.gridX;
		var y = til.tile.gridY;
		this.object.addRow(til.tile.gridY);
		this.redoTiles();
		return this.tiles[x][y];
	}
	removeRow(til) {
		var x = til.tile.gridX;
		var y = til.tile.gridY;
		this.object.removeRow(til.tile.gridY);
		this.redoTiles();
		return y >= this.tiles[x].length ? this.tiles[x][y-1] : this.tiles[x][y];
	}
	getClosestToCamera(cam) {
		let close = this.object.getTileClosestTo(cam.centerX, cam.centerY);
		//console.log(close, this.tiles.find2d(t=>t.tile==close));
		return this.tiles.find2d(t=>t.tile==close);
	}
}

class EditorGridOverTile extends MenuObject {
	constructor(t, p) {
		super();
		this.tile = t;
		this.parent = p;
		this.object = this.parent.object;
		this.resizeRect(this.tile.leftX, this.tile.topY, this.tile.width, this.tile.height);
	}
	update(yam) {
		super.update(yam);
		if (this.altClicked) {
			yam.switchSub(new EditorSidebarObjectGridMenu(this));
		} else if (this.clicked) {
			this.parent.bankHolding = this.parent.bankSelected;
			this.setBank(this.parent.bankHolding);
		} else if (this.draggedOnto && this.parent.bankHolding != null) {
			this.setBank(this.parent.bankHolding);
		}
	}
	intersectsMouse() {
		return this.tile.intersectsMouse(this.parent.camera.mouseX, this.parent.camera.mouseY);
	}
	draw() {
		
	}
	getCursorRect() {//TODO account for zoom
		let rect = this.tile.getCursorRect();
		rect.x = this.parent.camera.worldToScreenX(rect.x);
		rect.y = this.parent.camera.worldToScreenY(rect.y);
		return rect;
	}
	drawFlashing() {
		let rect = this.getCursorRect();
		mainCtx.fillStyle = "#FFFFFF";
		mainCtx.strokeRect(rect.x, rect.y, rect.width, rect.height);
	}
	setBank(bulge) {
		this.tile.setBank(bulge);
	}
}
EditorGridOverTile.prototype.hoverable = true;

class EditorPanelGrid extends EditorPanel {
	constructor(obj) {
		super({
			lText : "Editor-EditObject-Grid",
		});
		this.object = obj;
	}
	update(storm) {
		super.update(storm);
		if (this.clicked)
			storm.switchSub(new EditorSidebarObjectGrid(this.object));
	}
	draw() {
		super.draw();
		this.drawTextNormally();
	}
}

class EditorPanelBankSelect extends EditorPanel {
	constructor(obj, index) {
		super({
			text : index,
		});
		this.object = obj;
		this.index = index;
		this.data = this.object.bank[this.index];
		this.color = getEditorBankColor(this.data);
		this.text = index + ": " + getEditorBankText(this.data);
	}
	update(ojama) {
		super.update(ojama);
		if (this.clicked)
			ojama.sub.selectBank(this.index);
	}
	draw() {
		super.draw();
		this.drawTextNormally();
	}
}