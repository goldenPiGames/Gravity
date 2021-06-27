/**
The most basic form of terrain. A simple grid. Useful for simple levels where you don't use special gravity.
*/

const GRID_TILESET_NAMES = {
	"______W_" : ["capR", "single"],
	"____W___" : ["capU", "single"],
	"____WWW_" : ["extCornerUR", "single"],
	"__W_____" : ["capL", "single"],
	"__W___W_" : ["pillarHoriz", "edgeU", "single"],
	"__W___WW" : ["pillarHorizPlusUL", "pillarHoriz", "edgeU", "single"],
	"__W__WW_" : ["pillarHorizPlusDL", "pillarHoriz", "edgeU", "single"],
	"__W__WWW" : ["pillarHorizFlatL", "pillarHoriz", "edgeU", "single"],
	"__W_W___" : ["doubCornerUL", "extCornerUL", "single"],
	"__W_WWW_" : ["edgeCornerUR", "edgeU", "single"],
	"__WWW___" : ["extCornerUL", "single"],
	"__WWWWW_" : ["edgeU", "single"],
	"__WWWWWW" : ["edgeUPlusL", "edgeU", "single"],
	"_WW___W_" : ["pillarHorizPlusUR", "pillarHoriz", "edgeU", "single"],
	"_WWWWWW_" : ["edgeUPlusR", "edgeU", "single"],
	"W_____W_" : ["doubCornerDR", "extCornerDR", "single"],
	"W_____WW" : ["extCornerDR", "single"],
	"W___W___" : ["pillarVert", "single"],
	"W___WW__" : ["pillarVertPlusDL", "pillarVert", "single"],
	"W___WWWW" : ["edgeR", "single"],
	"W__WW___" : ["pillarVertPlusDR", "pillarVert", "single"],
	"W__WWWW_" : ["edgeCornerRU", "edgeR", "single"],//todo some bullshit
	"W__WWWWW" : ["edgeRPlusD", "edgeR", "single"],
	"W_W_____" : ["doubCornerDL", "extCornerDL", "single"],
	"W_W___WW" : ["edgeCornerDR", "single"],
	"W_W_W___" : ["teeL", "single"],
	"W_WWW___" : ["edgeCornerLU", "edgeL", "single"],
	"W_WWWWWW" : ["intCornerDL", "surrounded", "single"],
	"WW__W___" : ["pillarVertPlusUR", "pillarVert", "single"],
	"WW__WW__" : ["pillarVertSlantInc", "pillarVert", "single"],
	"WW__WWWW" : ["edgeRPlusU", "edgeR", "single"],
	"WWW_____" : ["extCornerDL", "surrounded", "single"],
	"WWW___WW" : ["edgeD", "single"],
	"WWW__WWW" : ["edgeDPlusL", "edgeD", "single"],
	"WWW_WWWW" : ["intCornerUL", "surrounded", "single"],
	"WWWW__WW" : ["edgeDPlusR", "edgeD", "single"],
	"WWWWW___" : ["edgeL", "single"],
	"WWWWW__W" : ["edgeLPlusU", "edgeL", "single"],
	"WWWWW_WW" : ["intCornerUR", "surrounded", "single"],
	"WWWWWW__" : ["edgeLPlusD", "edgeL", "single"],
	"WWWWWWW_" : ["intCornerDR", "surrounded", "single"],
	"WWWWWWWW" : ["surrounded"],
	
}

const GRID_SUBTILESET_NAMES = {
	"___" : "ExtCorner",
	"__W" : "EdgeHoriz",
	"_W_" : "ExtCorner",
	"_WW" : "EdgeHoriz",
	"W__" : "EdgeVert",
	"W_W" : "IntCorner",
	"WW_" : "EdgeVert",
	"WWW" : "Surrounded",
}

const PIXELS_PER_BLOCK = 20;

class StaticGridTerrain extends GameObject {
	constructor(args) {
		super();
		this.leftX = args.leftX || 0;
		this.topY = args.topY || 0;
		this.bank = args.bank;
		this.grid = args.grid;
		this.gravArrowsSprites = getSpriteSheet("GridGravArrows");
		this.gravArrows = args.gravArrows;
		this.gravBorders = args.gravBorders;
		this.scale = args.scale || PIXELS_PER_BLOCK;
		this.gravPriority = args.gravPriority;
		var tilesetName = args.tileset || "SubtilesetDemo";
		this.tileset = getSpriteSheet(tilesetName);
		this.usingSubtileset = tilesetName.substring(0, 7) != "Tileset";
		this.tiles = this.grid.map((col, x) => col.map((pis, y) => new StaticGridTile(this, x, y, this.bank[pis])));
		this.findNeighbors();
	}
	update() {
		
	}
	draw() {
		//TODO cull
		//this.tiles.forEach(col=>col.forEach(tile=>tile.draw()));
	}
	drawStatic() {
		this.tiles.forEach2d(tile=>tile.drawStatic());
	}
	tileOfPixel(x, y) {
		if (x != x || typeof x != "number" || y != y || typeof y != "number")
			return undefined;
		return this.tileOfIndex(this.pixToGridX(x), this.pixToGridY(y));
	}
	tileOfIndex(a, b) {
		if (a >= this.grid.length || a < 0 || b < 0 || b >= this.grid[a].length)
			return undefined;
		return this.tiles[a][b];
	}
	isPixelSolid(x, y) {
		//console.log(x, y)
		var blox = this.tileOfPixel(x, y);
		if (blox == undefined)
			return false;
		//console.log(blox)
		return blox.isPixelSolid(x, y);
	}
	getGravityAtPixel(x, y, ...rest) {
		var blox = this.tileOfPixel(x, y);
		if (blox == undefined)
			return false;
		return blox.getGravityAtPixel(x, y, ...rest);
	}
	pixToGridX(pixX) {
		return Math.floor((pixX - this.leftX) / this.scale);
	}
	pixToGridY(pixY) {
		return Math.floor((pixY - this.topY) / this.scale);
	}
	gridToPixX(gridX) {
		return gridX * this.scale + this.leftX;
	}
	gridToPixY(gridY) {
		return gridY * this.scale + this.topY;
	}
	findNeighbors() {
		this.tiles.forEach2d(t=>t.findNeighbors());
		this.doTwosideEscapes();
	}
	doTwosideEscapes() {
		for (var i = 0; i < this.tiles.length-1; i++) {
			for (var j = 0; j < this.tiles[i].length-1; j++) {
				if (this.tiles[i][j].gravity == "down" && this.tiles[i][j+1].gravity == "up" && (this.tiles[i+1][j].solid || this.tiles[i+1][j+1].solid))
					this.doTwosideEscapeUpDown(i, j);
				//if (this.tiles[i][j].gravity == "right" && this
			}
		}
	}
	doTwosideEscapeUpDown(a, b) {
		//console.log(a, b);
		for (var i = a; i > 0; i--) {
			if (this.tiles[i][b].solid || this.tiles[i][b+1].solid) {
				return this.doTwosideEscapeUpDown2(a, i+1, b);
			} else if (this.tiles[i][b].gravity != "down" || this.tiles[i][b+1].gravity != "up") {
				return;
			}
		}
	}
	doTwosideEscapeUpDown2(xr, xl, yt) {
		//console.log(xr, xl, yt);
		var yh = this.findTwosideEscapeUpDownHeight(xr, xl, yt);
		//console.log(yh);
		for (var i = xl; i <= xr; i++) {
			this.tiles[i][yt].setTwosideEscapeUp(yt+1-yh);
			this.tiles[i][yt+1].setTwosideEscapeDown(yt+1+yh);
		}
	}
	findTwosideEscapeUpDownHeight(xr, xl, yt) {
		for (var i = 0; i < 12; i++) {
			for (var j = xl-1; j <= xr+1; j++) {
				if (this.tiles[j][yt+1-i].solid && !this.tiles[j][yt-i].solid)
					return i;
				if (this.tiles[j][yt+i].solid && !this.tiles[j][yt+1+i].solid)
					return i;
			}
		}
	}
}
registerObject(StaticGridTerrain);

class StaticGridTile {
	constructor(parent, gridX, gridY, data) {
		this.parent = parent;
		this.gridX = gridX;
		this.gridY = gridY;
		this.data = data;
		this.solid = this.data.solid;
		this.gravArrows = this.data.gravArrows == undefined ? this.parent.gravArrows : this.data.gravArrows;
		this.gravBorders = this.data.gravBorders == undefined ? this.parent.gravBorders : this.data.gravBorders;
		this.gravity = this.data.gravity;
		this.round = this.data.round;
		if (this.round) {
			this.gridCenterX = this.data.centerX;
			this.gridCenterY = this.data.centerY;
			if (this.data.centerSolid) {
				this.roundVert = this.gridY == this.gridCenterY ? "D" : this.gridY == this.gridCenterY - 1 ? "U" : false;
				this.roundHoriz = this.gridX == this.gridCenterX ? "R" : this.gridX == this.gridCenterX - 1 ? "L" : false;
				if (this.roundVert && this.roundHoriz) {
					this.roundCorner = this.roundVert + this.roundHoriz;
					this.solid = true;
				}
			}
			this.centerX = this.parent.gridToPixX(this.gridCenterX);
			this.centerY = this.parent.gridToPixY(this.gridCenterY);
		}
		this.leftX = this.parent.gridToPixX(this.gridX);
		this.midX = this.parent.gridToPixX(this.gridX+.5);
		this.rightX = this.parent.gridToPixX(this.gridX+1);
		this.topY = this.parent.gridToPixY(this.gridY);
		this.midY = this.parent.gridToPixY(this.gridY+.5);
		this.bottomY = this.parent.gridToPixY(this.gridY+1);
		this.width = this.rightX - this.leftX;
		this.height = this.bottomY - this.topY;
	}
	findNeighbors() {
		this.twosideEscape = false;
		this.twosideEscapeGrid = null;
		this.twosideEscapePix = null;
		this.neighbors = [
			this.parent.tileOfIndex(this.gridX, this.gridY-1),
			this.parent.tileOfIndex(this.gridX+1, this.gridY-1),
			this.parent.tileOfIndex(this.gridX+1, this.gridY),
			this.parent.tileOfIndex(this.gridX+1, this.gridY+1),
			this.parent.tileOfIndex(this.gridX, this.gridY+1),
			this.parent.tileOfIndex(this.gridX-1, this.gridY+1),
			this.parent.tileOfIndex(this.gridX-1, this.gridY),
			this.parent.tileOfIndex(this.gridX-1, this.gridY-1),
		];
		this.neighborsSolid = this.neighbors.map(n=>n&&n.solid);
		this.neighborsSame = this.neighbors.map(n=>n&&n.data==this.data);
		this.neighborBin = this.neighborsSolid.map(m=>m?"W":"_").join("");
		if (this.solid) {
			if (this.parent.usingSubtileset) {
				this.spriteNamesUL = "UL"+GRID_SUBTILESET_NAMES[this.neighborBin[0]+this.neighborBin[7]+this.neighborBin[6]];
				this.spriteNamesUR = "UR"+GRID_SUBTILESET_NAMES[this.neighborBin[0]+this.neighborBin[1]+this.neighborBin[2]];
				this.spriteNamesDL = "DL"+GRID_SUBTILESET_NAMES[this.neighborBin[4]+this.neighborBin[5]+this.neighborBin[6]];
				this.spriteNamesDR = "DR"+GRID_SUBTILESET_NAMES[this.neighborBin[4]+this.neighborBin[3]+this.neighborBin[2]];
				if (this.roundCorner) {
					this.spriteNamesFull = "round"+this.roundCorner;
					switch (this.roundCorner) {
						case "UL": this.spriteNamesDL = false; this.spriteNamesUL = false; this.spriteNamesUR = false; break;
						case "UR": this.spriteNamesUL = false; this.spriteNamesUR = false; this.spriteNamesDR = false; break;
						case "DR": this.spriteNamesUR = false; this.spriteNamesDR = false; this.spriteNamesDL = false; break;
						case "DL": this.spriteNamesDR = false; this.spriteNamesDL = false; this.spriteNamesUL = false; break;
					}
				}
			} else {
				if (this.roundCorner) {
					this.spriteNames = ["round"+this.roundCorner, "missing", "single"];
				} else {
					this.spriteNames = GRID_TILESET_NAMES[this.neighborBin] || ["missing", "single"];
				}//console.log(this.neighborBin, GRID_TILESET_NAMES[this.neighborBin], this.spriteNames);
			}
		}
	}
	setTwosideEscapeUp(val) {
		this.twosideEscape = "up";
		this.twosideEscapeGrid = val;
		this.twosideEscapePix = this.parent.gridToPixY(val);
	}
	setTwosideEscapeDown(val) {
		this.twosideEscape = "down";
		this.twosideEscapeGrid = val;
		this.twosideEscapePix = this.parent.gridToPixY(val);
	}
	drawStatic(ctx) {
		if (this.solid) {
			if (!this.parent.usingSubtileset && this.spriteNames) {
				this.parent.tileset.drawOnStaticWorld(this.spriteNames, {
					x:this.leftX,
					y:this.topY,
				});
			} else {
				if (this.spriteNamesFull) {
					this.parent.tileset.drawOnStaticWorld(this.spriteNamesFull, {
						x:this.leftX,
						y:this.topY,
					});
				}
				if (this.spriteNamesUL) {
					this.parent.tileset.drawOnStaticWorld(this.spriteNamesUL, {
						x:this.leftX,
						y:this.topY,
					});
				}
				if (this.spriteNamesUR) {
					this.parent.tileset.drawOnStaticWorld(this.spriteNamesUR, {
						x:this.midX,
						y:this.topY,
					});
				}
				if (this.spriteNamesDL) {
					this.parent.tileset.drawOnStaticWorld(this.spriteNamesDL, {
						x:this.leftX,
						y:this.midY,
					});
				}
				if (this.spriteNamesDR) {
					this.parent.tileset.drawOnStaticWorld(this.spriteNamesDR, {
						x:this.midX,
						y:this.midY,
					});
				}
			}
		} else {
			if (this.gravBorders) {
				var borderWidth = 3;
				staticWorldCtx.fillStyle = getEditorBankColor(this.data);
				if (this.neighbors[0] && !this.neighborsSolid[0] && !this.neighborsSame[0]) {
					staticWorldCtx.fillRect(this.leftX, this.topY, this.width, borderWidth);
				}
				if (this.neighbors[2] && !this.neighborsSolid[2] && !this.neighborsSame[2]) {
					staticWorldCtx.fillRect(this.rightX-borderWidth, this.topY, borderWidth, this.height);
				}
				if (this.neighbors[4] && !this.neighborsSolid[4] && !this.neighborsSame[4]) {
					staticWorldCtx.fillRect(this.leftX, this.bottomY-borderWidth, this.width, borderWidth);
				}
				if (this.neighbors[6] && !this.neighborsSolid[6] && !this.neighborsSame[6]) {
					staticWorldCtx.fillRect(this.leftX, this.topY, borderWidth, this.height);
				}
			}
			if (this.gravArrows) {
				if (this.gravity.round) {
					
				} else {
					this.parent.gravArrowsSprites.drawOnStaticWorld(this.gravity, {
						alpha:0.5,
						x:this.midX,
						y:this.midY,
						xadj:.5,
						yadj:.5
					});
				}
			}
		}
	}
	isPixelSolid(x, y) {
		if (this.roundCorner) {
			return new VectorRect(this.centerX - x, this.centerY - y).r < this.parent.scale;
		}
		return this.solid;
	}
	getGravityAtPixel(x, y, bod, obj) {
		//console.log(x, y, bod, obj);
		var vect = undefined;
		switch (this.gravity) {
			case "up": vect = new VectorRect(0, -1); break;
			case "down": vect = new VectorRect(0, 1); break;
			case "left": vect = new VectorRect(-1, 0); break;
			case "right": vect = new VectorRect(1, 0); break;
			case "round": vect = new VectorRect(this.centerX - x, this.centerY - y); break;
			default: return undefined; break;
		}
		vect.setR(this.parent.gravMagnitude || .5).setPriority(this.parent.gravPriority || 1);
		//console.log(this.twosideEscape && bod && bod.doesTwosideEscape && vect.dot(bod.velocity));
		if (this.twosideEscape && bod && bod.doesTwosideEscape && vect.dot(bod.velocity) < 0) {//TODO actually finish implementing this dumb mechanic
			bod.noteTwosideEscape(this.twosideEscape, this.twosideEscapePix, vect);
		}
		return vect;
	}
}

class StaticGridTerrainEditor extends EditorObject {
	constructor(args) {
		super(args);
		this.leftX = args.leftX || 0;
		this.topY = args.topY || 0;
		this.bank = args.bank;
		this.gravArrows = args.gravArrows || 0;
		this.gravBorders = args.gravBorders || 0;
		//this.grid = args.grid;
		this.scale = args.scale || PIXELS_PER_BLOCK;
		this.gravPriority = args.gravPriority;
		this.tileset = args.tileset;
		this.tiles = args.grid.map2d((pis, x, y) => new StaticGridEditorTile(this, x, y, pis));
	}
	draw() {
		this.tiles.forEach2d(tile=>tile.draw());
	}
	tileOfPixel(x, y) {
		if (x != x || typeof x != "number" || y != y || typeof y != "number")
			return undefined;
		return this.tileOfIndex(this.pixToGridX(x), this.pixToGridY(y))
	}
	tileOfIndex(a, b) {
		if (a >= this.tiles.length || a < 0 || b < 0 || b >= this.tiles[a].length)
			return undefined;
		return this.tiles[a][b];
	}
	pixToGridX(pixX) {
		return Math.floor((pixX - this.leftX) / this.scale);
	}
	pixToGridY(pixY) {
		return Math.floor((pixY - this.topY) / this.scale);
	}
	getTileClosestTo(x, y) {
		//console.log(x, y, this.pixToGridXCapped(x), this.pixToGridYCapped(y))
		return this.tiles[this.pixToGridXCapped(x)][this.pixToGridYCapped(y)];
	}
	pixToGridXCapped(pixX) {
		return Math.max(0, Math.min(this.tiles.length-1, this.pixToGridX(pixX)));
	}
	pixToGridYCapped(pixY) {
		return Math.max(0, Math.min(this.tiles[0].length-1, this.pixToGridY(pixY)));
	}
	gridToPixX(gridX) {
		return gridX * this.scale + this.leftX;
	}
	gridToPixY(gridY) {
		return gridY * this.scale + this.topY;
	}
	getBoundRight() {
		return this.gridToPixX(this.tiles.length);
	}
	getBoundBottom() {
		return this.gridToPixY(this.tiles[0].length);
	}
	updateHoveredCamera(cam) {
		this.mouseX = cam.mouseX;
		this.mouseY = cam.mouseY;
		this.mouseGridX = this.pixToGridX(this.mouseX);
		this.mouseGridY = this.pixToGridY(this.mouseY);
	}
	getJSON() {
		return {
			object : "StaticGridTerrain",
			leftX : this.leftX,
			topY : this.topY,
			scale : this.scale,
			gravPriority : this.gravPriority,
			tileset : this.tileset,
			gravArrows : this.gravArrows,
			gravBorders : this.gravBorders,
			grid : this.tiles.map2d(t=>t.bankIndex),
			bank : this.bank,
		};
	}
	getEditorPanels() {
		return [
			new EditorPanelGrid(this),
			new EditorPanelMove(this, "leftX", "topY"),
			new EditorPanelBoolean(this, {
				param : "gravArrows",
			}),
			new EditorPanelBoolean(this, {
				param : "gravBorders",
			}),
			new EditorPanelNumber(this, {
				param : "gravPriority",
				min : 0,
				max : 15,
			}),
		];
	}
	getEditorPanelsBankSelect() {
		return this.bank.map((b, i)=>new EditorPanelBankSelect(this, i));
	}
	getEditorPanelsBankEdit(bankIndex) {
		var bangbang = this.bank[bankIndex];
		if (bangbang.round) {
			return [
				new EditorPanelNumber(bangbang, {
					lText : "Grid-Bank-centerX",
					param : "centerX",
					min : 0,
					max : this.tiles.length,
				}),
				new EditorPanelNumber(bangbang, {
					lText : "Grid-Bank-centerY",
					param : "centerY",
					min : 0,
					max : this.tiles[0].length,
				}),
				new EditorPanelBoolean(bangbang, {
					lText : "Grid-Bank-centerSolid",
					param : "centerSolid"
				}),
			];
		} else {
			return [];
		}
	}
	afterMove(x, y) {
		this.tiles.forEach2d(t=>t.updatePosition());
	}
	addColumn(x) {
		this.tiles.splice(x+1, 0, this.tiles[x].map((t,y)=>new StaticGridEditorTile(this, x+1, y, t.bankIndex)));
		this.tiles.slice(x+2).forEach2d(t=>{
			t.gridX++;
			t.updatePosition();
		});
		this.bank.forEach(b=>{
			if (b.centerX > x)
				b.centerX++;
		});
	}
	removeColumn(x) {
		this.tiles.splice(x, 1);
		this.tiles.slice(x).forEach2d(t=>{
			t.gridX--;
			t.updatePosition();
		});
		this.bank.forEach(b=>{
			if (b.centerX > x)
				b.centerX--;
		});
	}
	addRow(y) {
		this.tiles.forEach((col,x)=>col.splice(y+1, 0, new StaticGridEditorTile(this, x, y+1, col[y].bankIndex)));
		this.tiles.forEach(c=>c.slice(y+2).forEach(t=>{
			t.gridY++;
			t.updatePosition();
		}));
		this.bank.forEach(b=>{
			if (b.centerY > y)
				b.centerY++;
		});
	}
	removeRow(y) {
		this.tiles.forEach((col,x)=>col.splice(y, 1));
		this.tiles.forEach(c=>c.slice(y).forEach(t=>{
			t.gridY--;
			t.updatePosition();
		}));
		this.bank.forEach(b=>{
			if (b.centerY > y)
				b.centerY--;
		});
	}
}
registerEditor(StaticGridTerrainEditor, "StaticGridTerrain", {
	getNewArgs : cam=>({
		"object" : "StaticGridTerrain",
		"leftX" : Math.max(0, cam.centerX-80),
		"topY" : Math.max(0, cam.centerY-80),
		"grid" : [
			[4,4,4,4,4,4,4,4],
			[0,0,0,0,0,0,0,4],
			[0,0,0,0,0,0,0,4],
			[0,0,0,0,0,0,0,4],
			[0,0,0,0,0,0,0,4],
			[0,0,0,0,0,0,0,4],
			[0,0,0,0,0,0,0,4],
			[0,0,0,0,0,0,0,4]],
		"tileset" : "SubtilesetStoneBrick",
		"bank" : [
			{
				"solid" : false,
				"gravity" : "down"
			},
			{
				"solid" : false,
				"gravity" : "right"
			},
			{
				"solid" : false,
				"gravity" : "up"
			},
			{
				"solid" : false,
				"gravity" : "left"
			},
			{
				"solid" : true
			}
		]
	})
});

class StaticGridEditorTile extends EditorObject {
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
		this.leftX = this.parent.gridToPixX(this.gridX);
		this.midX = this.parent.gridToPixX(this.gridX+.5);
		this.rightX = this.parent.gridToPixX(this.gridX+1);
		this.topY = this.parent.gridToPixY(this.gridY);
		this.midY = this.parent.gridToPixY(this.gridY+.5);
		this.bottomY = this.parent.gridToPixY(this.gridY+1);
		this.width = this.rightX - this.leftX;
		this.height = this.bottomY - this.topY;
	}
	updateBank() {
		this.data = this.parent.bank[this.bankIndex];
		this.solid = this.data.solid;
		this.color = getEditorBankColor(this.data);
	}
	draw(ctx) {
		worldCtx.fillStyle = this.color;
		worldCtx.fillRect(this.leftX, this.topY, this.width, this.height);
	}
	setBank(yokai) {
		this.bankIndex = yokai;
		this.updateBank();
	}
	intersectsMouse() {
		return this.parent.mouseGridX == this.gridX && this.parent.mouseGridY == this.gridY;
	}
	getCursorRect() {
		return {
			x : this.leftX,
			y : this.topY,
			width : this.width,
			height : this.height,
		};
	}
}

function getEditorBankColor(dats) {
	if (dats.solid) {
		return "#404040C0";
	} else {
		switch (dats.gravity) {
			case "up": return "#FF008060"; break;
			case "down": return "#0000FF60"; break;
			case "left": return "#B0404060"; break;
			case "right": return "#00FF0060"; break;
			case "round": return "#FF800060"; break;
			case "in" : return "#8000FF60"; break;
			case "out" : return "#80FF0060"; break;
			default: return "#20202060"; break;
		}
	}
}

function getEditorBankText(dats) {
	if (dats.solid) {
		return lg("Grid-Bank-Solid");
	} else {
		switch (dats.gravity) {
			case "up": return lg("Grid-Bank-Up"); break;
			case "down": return lg("Grid-Bank-Down"); break;
			case "left": return lg("Grid-Bank-Left"); break;
			case "right": return lg("Grid-Bank-Right"); break;
			case "round": return lg("Grid-Bank-Round"); break;
			case "in": return lg("Grid-Bank-In"); break;
			case "out": return lg("Grid-Bank-Out"); break;
			default: return undefined; break;
		}
	}
}