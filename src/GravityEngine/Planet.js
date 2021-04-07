class Planet extends GameObject {
	constructor(args) {
		super();
		this.x = args.x;
		this.y = args.y;
		this.radius = args.radius;
		this.radius2 = args.radius**2;
		this.gravRadius = args.gravRadius || args.radius*2;
		this.gravity = args.gravity || 0.5;
		this.gravPriority = args.gravPriority || 3;
		this.gravPriorityFade = args.gravPriorityFade || 0.00390625;
		this.core = new PlanetCore(this);
		if (args.tileset)
			this.tileset = getSpriteSheet(args.tileset);
		this.radGrid = args.radGrid;
		this.radGridBank = args.radGridBank;
		if (this.radGrid) {
			this.radGridRStart = /*args.radGridRStart || */this.radius;
			this.radiusInner = this.radGridRStart;
			this.radiusInner2 = this.radiusInner**2;
			this.radGridRScale = args.radGridRScale;
			this.radiusOuter = this.radGridRStart + this.radGrid[0].length * this.radGridRScale;
			this.radiusOuter2 = this.radiusOuter**2;
			this.radGridThetaScale = 2*Math.PI / this.radGrid.length;
			this.radGridThetaOffset = args.radGridThetaOffset || 0;
			this.tiles = this.radGrid.map((col, x) => col.map((pis, y) => new PlanetRadGridTile(this, x, y, this.radGridBank[pis])));
			this.tiles.forEach2d(t=>t.findNeighbors());
		}
	}
	tileOfPixel(x, y) {
		var vest = this.pixToGrid(x, y);
		return (this.tileOfIndex(vest.theta, vest.r));
	}
	tileOfIndex(a, b) {
		if (b < 0)
			return this.core;
		while (a < 0)
			a += this.tiles.length;
		if (a >= this.tiles.length)
			a = a % this.tiles.length;
		if (b < 0 || b >= this.tiles[a].length)
			return undefined;
		return this.tiles[a][b];
	}
	isPixelSolid(x, y) {
		var blox = this.tileOfPixel(x, y);
		if (blox == undefined)
			return false;
		return blox.isPixelSolid(x, y);
	}
	getGravityAtPixel(x, y) {//TODO vector bullshit
		let r = new VectorRect(x-this.x, y-this.y).r
		if (r <= this.gravRadius)
			return new UnitVector(this.x-x, this.y-y).setR(this.gravity).setPriority(this.gravPriority-r*this.gravPriorityFade)
	}
	update(stage) {
		
	}
	draw() {
		
	}
	drawStatic() {
		if (this.spriteSheet) {
			this.spriteSheet.drawOnStaticWorld(this.spriteName, {x:this.x, y:this.y, xadj:.5, yadj:.5});
		} else if (this.tileset) {
			disableImageSmoothing(staticWorldCtx);
			var spritName = this.tileset.findSpriteName(["patternStatic", "pattern", "surrounded"]);
			var spritData = this.tileset.data[spritName];
			worldCanvas.width = spritData.width;
			worldCanvas.height = spritData.height;

			// Give the pattern a background color and draw an arc
			this.tileset.drawOnCtx(spritName, {x:0, y:0}, worldCtx);
			this.fillPattern = staticWorldCtx.createPattern(worldCanvas, 'repeat');
			this.core.drawStatic();
			this.tiles.forEach2d(tile=>tile.drawStatic());
		} else if (this.solidColor) {
			staticWorldCtx.fillStyle = this.solidColor;
			staticWorldCtx.beginPath();
			staticWorldCtx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
			staticWorldCtx.fill();
		}
	}
	pixToGrid(x, y) {
		var v = new VectorRect(x-this.x, y-this.y);
		var rC = this.pixToGridR(v.r);
		var tC = this.radiansToGrid(v.theta);
		return {r: rC, theta: tC};
	}
	radiansToGrid(theta) {
		while (theta < 0)
			theta += 2*Math.PI;
		while (theta >= 2*Math.PI)
			theta -= 2*Math.PI;
		return Math.floor(theta / this.radGridThetaScale - this.radGridThetaOffset);
	}
	pixToGridR(r) {
		return Math.floor((r - this.radGridRStart) / this.radGridRScale);
	}
	gridToRadians(theta) {
		return (theta - this.radGridThetaOffset) * this.radGridThetaScale;
	}
	gridToPixR(r) {
		return this.radiusInner + this.radGridRScale*r;
	}
}
registerObject(Planet);

class PlanetCore {
	constructor(parent) {
		this.parent = parent;
		this.solid = true;
	}
	isPixelSolid(x, y) {
		return true;
	}
	getGravityAtPixel() {
		return undefined;
	}
	drawStatic() {
		staticWorldCtx.fillStyle = this.parent.fillPattern;
		staticWorldCtx.beginPath();
		staticWorldCtx.arc(this.parent.x, this.parent.y, this.parent.radiusInner, 0, 2*Math.PI);
		staticWorldCtx.fill();
	}
}

class PlanetRadGridTile {
	constructor(parent, gridTheta, gridR, data) {
		this.parent = parent;
		this.gridTheta = gridTheta;
		this.gridR = gridR;
		this.data = data;
		this.solid = this.data.solid;
		this.gravity = this.data.gravity;
		this.ccwTheta = this.parent.gridToRadians(this.gridTheta);
		this.cwTheta = this.parent.gridToRadians(this.gridTheta+1);
		this.ccwThetaDraw = Math.PI*3/2 + this.ccwTheta;
		this.cwThetaDraw = Math.PI*3/2 + this.cwTheta;
		this.innerR = this.parent.gridToPixR(this.gridR);
		this.outerR = this.parent.gridToPixR(this.gridR+1);
		this.innerRFill = this.innerR;
	}
	findNeighbors() {
		this.neighbors = [
			this.parent.tileOfIndex(this.gridTheta, this.gridR-1),
			this.parent.tileOfIndex(this.gridTheta+1, this.gridR-1),
			this.parent.tileOfIndex(this.gridTheta+1, this.gridR),
			this.parent.tileOfIndex(this.gridTheta+1, this.gridR+1),
			this.parent.tileOfIndex(this.gridTheta, this.gridR+1),
			this.parent.tileOfIndex(this.gridTheta-1, this.gridR+1),
			this.parent.tileOfIndex(this.gridTheta-1, this.gridR),
			this.parent.tileOfIndex(this.gridTheta-1, this.gridR-1),
		];
		this.neighborsSolid = this.neighbors.map(n=>n&&n.solid);
		this.neighborBin = this.neighborsSolid.map(m=>m?"W":"_").join("");
		if (this.neighborsSolid[0])
			this.innerRFill = this.innerR - 1;
	}
	drawStatic(ctx) {
		if (this.solid) {
			staticWorldCtx.fillStyle = this.parent.fillPattern;
			staticWorldCtx.beginPath();
			staticWorldCtx.arc(this.parent.x, this.parent.y, this.innerRFill, this.ccwThetaDraw, this.cwThetaDraw, false);
			staticWorldCtx.arc(this.parent.x, this.parent.y, this.outerR, this.cwThetaDraw, this.ccwThetaDraw, true);
			//staticWorldCtx.moveTo(this.parent.x, this.parent.y);
			staticWorldCtx.closePath();
			staticWorldCtx.fill();
		}
	}
	isPixelSolid(x, y) {
		if (this.roundCorner) {
			return new VectorRect(this.centerX - x, this.centerY - y).r < this.parent.scale;
		}
		return this.solid;
	}
	getGravityAtPixel(x, y) {
		switch (this.gravity) {
			case "up": return new VectorRect(0, -.5).setPriority(1); break;
			case "down": return new VectorRect(0, .5).setPriority(1); break;
			case "left": return new VectorRect(-.5, 0).setPriority(1); break;
			case "right": return new VectorRect(.5, 0).setPriority(1); break;
			case "round": return new VectorRect(this.centerX - x, this.centerY - y).setR(.5).setPriority(1); break;
			default: return undefined; break;
		}
	}
}

class PlanetEditor extends EditorObject {
	constructor(args) {
		super(args);
		this.x = args.x;
		this.y = args.y;
		this.radius = args.radius;
		this.gravRadius = args.gravRadius;
		this.gravity = args.gravity;
		this.gravPriority = args.gravPriority;
		this.gravPriorityFade = args.gravPriorityFade;
		this.tileset = args.tileset;
		this.bank = args.radGridBank;
		this.radiusInner = this.radius;
		this.radGridRStart = this.radiusInner;//args.radGridRStart;
		this.radGridRScale = args.radGridRScale || 20;
		this.radGridThetaOffset = args.radGridThetaOffset || 0;
		this.radGridThetaScale = 2*Math.PI / args.radGrid.length;
		this.tiles = args.radGrid ? args.radGrid.map2d((pis, x, y) => new PlanetEditorTile(this, x, y, pis)) : [[0]];
	}
	update() {
		super.update();
	}
	draw() {
		worldCtx.fillStyle = "#B0B0B0";
		worldCtx.beginPath();
		worldCtx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		worldCtx.closePath();
		worldCtx.fill();
		worldCtx.strokeStyle = "#8000FF40";
		worldCtx.lineWidth = 4;
		worldCtx.beginPath();
		worldCtx.arc(this.x, this.y, this.gravRadius-2, 0, 2*Math.PI);
		worldCtx.closePath();
		worldCtx.stroke();
		this.tiles.forEach2d(t=>t.draw());
	}
	getEditorPanels() {
		return [
			new EditorPanelGrid(this),
			new EditorPanelMove(this, "x", "y"),
			new EditorPanelNumber(this, {
				param : "radius",
				min : 10,
				max : 255,
				setter : v=>this.setRadius(v),
			}),
			new EditorPanelNumber(this, {
				param : "gravRadius",
				min : 10,
				max : 9999,
			}),
			new EditorPanelNumber(this, {
				param : "gravPriority",
				min : 0,
				max : 15,
			}),
		];
	}
	afterMove(x, y) {
		this.tiles.forEach2d(t=>t.updatePosition());
	}
	setRadius(to) {
		this.radius = to;
		this.radiusInner = to;
		this.radGridRStart = to;
		this.tiles.forEach2d(t=>t.updatePosition());
	}
	getEditorPanelsBankSelect() {
		return this.bank.map((b, i)=>new EditorPanelBankSelect(this, i));
	}
	getJSON() {
		return {
			object : "Planet",
			x : this.x,
			y : this.y,
			radius : this.radius,
			gravity : this.gravity,
			gravRadius : this.gravRadius,
			gravPriority : this.gravPriority,
			gravPriorityFade : this.gravPriorityFade,
			tileset : this.tileset,
			radGrid : this.tiles.map2d(t=>t.bankIndex),
			radGridBank : this.bank,
			radGridRScale : this.radGridRScale,
			radGridThetaOffset : this.radGridThetaOffset,
		};
	}
	gridToPixRect(t, r) {
		var vect = new VectorPolar(this.gridToPixR(r), this.gridToRadians(t));
		//console.log(t, r, this.gridToPixR(r), this.gridToRadians(t));
		//console.log(t, this.gridToRadians(t));
		return {
			x : vect.x + this.x,
			y : vect.y + this.y,
		}
	}
	updateHoveredCamera(cam) {
		let vect = this.pixToGrid(cam.mouseX, cam.mouseY);
		this.mouseGridTheta = vect.theta;
		this.mouseGridR = vect.r;
	}
	getTileClosestTo(x, y) {
		return this.tiles[0][0];
	}
	addColumn(x) {
		this.tiles.splice(x+1, 0, this.tiles[x].map((t,y)=>new PlanetEditorTile(this, x+1, y, t.bankIndex)));
		this.radGridThetaScale = 2*Math.PI / this.tiles.length;
		this.tiles.slice(x+2).forEach2d(t=>{
			t.gridX++;
		});
		this.tiles.forEach2d(t=>t.updatePosition());
	}
	removeColumn(x) {
		this.tiles.splice(x, 1);
		this.radGridThetaScale = 2*Math.PI / this.tiles.length;
		this.tiles.slice(x).forEach2d(t=>{
			t.gridX--;
		});
		this.tiles.forEach2d(t=>t.updatePosition());
	}
	addRow(y) {
		this.tiles.forEach((col,x)=>col.splice(y+1, 0, new PlanetEditorTile(this, x, y+1, col[y].bankIndex)));
		this.tiles.forEach(c=>c.slice(y+2).forEach(t=>{
			t.gridY++;
			t.updatePosition();
		}));
	}
	removeRow(y) {
		this.tiles.forEach((col,x)=>col.splice(y, 1));
		this.tiles.forEach(c=>c.slice(y).forEach(t=>{
			t.gridY--;
			t.updatePosition();
		}));
	}
	getBoundRight() {
		return this.x + this.gridToPixR(this.tiles[0].length+1)
	}
	getBoundBottom() {
		return this.y + this.gridToPixR(this.tiles[0].length+1)
	}
}
registerEditor(PlanetEditor, "Planet", {
	getNewArgs : cam=>({
		x : cam.centerX,
		y : cam.centerY,
		radius : 50,
		gravRadius : 300,
		gravPriority : 2,
		tileset : "RadTilesetStoneBrick",
		radGrid : [
			[0,0],
			[0,0],
			[0,0],
			[0,0],
			[0,0],
			[0,0],
			[0,0],
			[0,0],
			[0,0],
			[0,0],
			[0,0],
			[0,0],
		],
		radGridBank : [
			{
				"solid" : false,
				"gravity" : "in"
			},
			{
				"solid" : true
			},
		],
		radGridRScale : 20,
	})
});
composeMethods(PlanetEditor, Planet, ["pixToGrid", "radiansToGrid", "pixToGridR", "gridToRadians", "gridToPixR"]);
PlanetEditor.prototype.invertVertGridMove = true;

class PlanetEditorTile extends EditorObject {
	constructor(parent, gridX, gridY, bankIndex) {
		super();
		this.parent = parent;
		this.gridX = gridX;
		this.gridY = gridY;
		this.bankIndex = bankIndex;
		this.updatePosition();
		this.updateBank();
	}
	updatePosition() {
		this.ccwTheta = this.parent.gridToRadians(this.gridX);
		this.cwTheta = this.parent.gridToRadians(this.gridX+1);
		this.ccwThetaDraw = Math.PI*3/2 + this.ccwTheta + .004;
		this.cwThetaDraw = Math.PI*3/2 + this.cwTheta - .004;
		this.innerR = this.parent.gridToPixR(this.gridY)+1;
		this.outerR = this.parent.gridToPixR(this.gridY+1);
		
		let vect = this.parent.gridToPixRect(this.gridX+.5, this.gridY+.5);
		this.centerX = vect.x;
		this.centerY = vect.y;
	}
	updateBank() {
		this.data = this.parent.bank[this.bankIndex];
		this.solid = this.data.solid;
		this.color = getEditorBankColor(this.data);
	}
	draw(ctx) {
		worldCtx.fillStyle = this.color;
		//console.log(this.color, this.parent.x, this.parent.y, this.innerR, this.outerR, this.ccwThetaDraw, this.cwThetaDraw);
		worldCtx.beginPath();
		worldCtx.arc(this.parent.x, this.parent.y, this.innerR, this.ccwThetaDraw, this.cwThetaDraw, false);
		worldCtx.arc(this.parent.x, this.parent.y, this.outerR, this.cwThetaDraw, this.ccwThetaDraw, true);
		//worldCtx.moveTo(this.parent.x, this.parent.y);
		worldCtx.closePath();
		worldCtx.fill();
	}
	setBank(yokai) {
		this.bankIndex = yokai;
		this.updateBank();
	}
	intersectsMouse() {
		return this.parent.mouseGridTheta == this.gridX && this.parent.mouseGridR == this.gridY;
	}
	getCursorRect() {
		let size = 20;
		//console.log(this.centerX - size/2, this.centerY - size/2, size, size)
		return {
			x : this.centerX - size/2,
			y : this.centerY - size/2,
			width : size,
			height : size
		}
	}
}