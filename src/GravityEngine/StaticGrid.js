/**
The most basic form of terrain. A simplle grid. Useful for simple levels where you don't use special gravity.
*/

const PIXELS_PER_BLOCK = 20;

class StaticGridTerrain {
	constructor(args) {
		this.grid = args.grid;
		this.scale = args.scale || PIXELS_PER_BLOCK;
		this.tileset = args.tileset;
		this.tiles = this.grid.map((col, x) => col.map((pis, y) => new StaticGridTile(this, x, y, pis)));
	}
	update() {
		
	}
	draw() {
		//TODO cull
		//this.tiles.forEach(col=>col.forEach(tile=>tile.draw()));
	}
	drawStatic() {
		this.tiles.forEach(col=>col.forEach(tile=>tile.drawStatic()));
	}
	blockOfPixel(x, y) {
		if (x != x || typeof x != "number" || y != y || typeof y != "number")
			return undefined
		var a = Math.floor(x/this.scale)
		var b = Math.floor(y/this.scale)
		if (a >= this.grid.length || a < 0 || b < 0 || b >= this.grid[a].length)
			return undefined;
		return this.tiles[a][b];
	}
	isPixelSolid(x, y) {
		//console.log(x, y)
		var blox = this.blockOfPixel(x, y);
		if (blox == undefined)
			return false;
		//console.log(blox)
		return blox.isPixelSolid(x, y);
	}
	gridToPixX(gridX) {
		return gridX * this.scale;
	}
	gridToPixY(gridY) {
		return gridY * this.scale;
	}
}

class StaticGridTile {
	constructor(parent, gridX, gridY, data) {
		this.parent = parent;
		this.gridX = gridX;
		this.gridY = gridY;
		if (data === 1) {
			this.solid = true;
		} else if (data === 0) {
			this.solid = false;
		} else if (typeof data == "object") {
			this.solid = data.solid;
		}
		this.x = this.parent.gridToPixX(this.gridX);
		this.y = this.parent.gridToPixY(this.gridY);
		this.spriteNames = this.solid ? ["solidAll"] : ["clearAll"];
	}
	drawStatic(ctx) {
		this.parent.tileset.drawOnStaticWorld(this.spriteNames, {
			x:this.x,
			y:this.y,
		});
	}
	isPixelSolid(x, y) {
		return this.solid;
	}
}

class AutoTileset extends SpriteSheet {
	constructor(...stuff) {
		super(...stuff)
	}
}



function solidDistance(x, y, direction) {
	for (var i = 0; i < 200; i++) {
		if (!isPixelSolid(x, y))
			return i;
		x += directiondx(direction);
		y += directiondy(direction);
	}
	return i;
}

function clearToSky(x, y) {
	while (!isPixelSolid(x, y) && y > 0) {
		y -= 5;
	}
	return (y <= 0)
}

function hazardOfPixel(x, y, solidOnly = false) {
	var blox = blockOfPixel(x, y);
	return blox.solid || !solidOnly ? blox.hazard : 0;
}

function directiondx(dir) {
	switch (dir) {
		case 1: return 1;
		case 3: return -1;
		default: return 0;
	}
}
function directiondy(dir) {
	switch (dir) {
		case 0: return -1;
		case 2: return 1;
		default: return 0;
	}
}