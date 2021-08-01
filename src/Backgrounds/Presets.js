class BackgroundBlueSky extends BackgroundLayerer {
	constructor(dats, ...rest) {
		super([
			{
				"background":"GradientHorizon",
				"colorStops" : [
					{"offset":0, "color":"#0d49a1"},
					{"offset":0.5, "color":"#93d6cc"},
					{"offset":1, "color":"#6cc1ba"}
				]
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