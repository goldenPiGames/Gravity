class BackgroundBlueSky extends BackgroundLayerer {
	constructor(dats, ...rest) {
		super([
			{
				"background":"Solid",
				"color":"#87CEEB"
			},
			{
				"background":"TileImage",
				"spriteSheet":"BackgroundTileCloud",
				"scale":3,
				"parallax":0.1
			}
		], ...rest);
	}
}
registerBackground(BackgroundBlueSky, "BlueSky");

class BackgroundGravColorSky extends BackgroundLayerer {
	constructor(dats, ...rest) {
		super([
			{
				"background":"GravColorSolid",
				"color":"#87CEEB"
			},
			{
				"background":"TileImage",
				"spriteSheet":"BackgroundTileCloud",
				"scale":3,
				"parallax":0.1
			}
		], ...rest);
	}
}
registerBackground(BackgroundGravColorSky, "GravColorSky");