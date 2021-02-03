const SPRITE_DATA = {
	"TilesetDemo" : {
		"solidAll" : {x:20, y:20, width:20, height:20},
		"solidExtCornerUL" : {x:0, y:0, width:20, height:20},
		"solidExtCornerUR" : {x:40, y:0, width:20, height:20},
		"solidExtCornerDL" : {x:0, y:40, width:20, height:20},
		"solidExtCornerDR" : {x:40, y:40, width:20, height:20},
		"solidEdgeU" : {x:20, y:0, width:20, height:20},
		"solidEdgeD" : {x:20, y:40, width:20, height:20},
		"solidEdgeL" : {x:0, y:20, width:20, height:20},
		"solidEdgeR" : {x:40, y:20, width:20, height:20},
	},
	"Clock160brown" : {
		body : {x:0, y:0, width:160, height:160},
		hand : {x:160, y:0, width:20, height:160},
	},
	"ClockRadGridTest" : {
		body : {x:0, y:0, width:960, height:960},
		//hand : {x:160, y:0, width:300, height:160},
	},
	"Player" : {
		standing0 : {x:0, y:0, width:20, height:40},
		walking0 : {x:20, y:0, width:20, height:40},
		walking1 : {x:20, y:0, width:20, height:40},
		walking2 : {x:40, y:0, width:20, height:40},
		walking3 : {x:40, y:0, width:20, height:40},
		walking4 : {x:60, y:0, width:20, height:40},
		walking5 : {x:60, y:0, width:20, height:40},
		walking6 : {x:0, y:0, width:20, height:40},
		walking7 : {x:0, y:0, width:20, height:40},
		jumping0 : {x:20, y:0, width:20, height:40},
	},
	"Meteor" : {
		falling0 : {x:0, y:0, width:20, height:20},
	},
}

const SPRITES_LOADED = {};

function getSpriteSheet(name) {
	if (!SPRITES_LOADED[name])
		SPRITES_LOADED[name] = new SpriteSheet("src/Sprites/"+name+".png", SPRITE_DATA[name], true);
	return SPRITES_LOADED[name];
}