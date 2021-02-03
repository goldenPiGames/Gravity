class DemoStageGrid extends Stage {
	constructor() {
		super({
			width : 300,
			height : 300,
			objects : [
				new StaticGridTerrain({
					//grid : [[0,0,0,0,0],[0,1,1,1,0],[0,1,1,1,0],[0,1,1,1,0],[0,0,0,0,0]],
					grid : [
						[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
						[1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
						[1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
						[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
					tileset : getSpriteSheet("TilesetDemo"),
					scale : 20,
				}),
				new BasePlayer({
					midX : 50,
					midY : 50,
				}),
			],
		});
	}
}

class DemoStagePlanet extends Stage {
	constructor() {
		super({
			width : 500,
			height : 500,
			objects : [
				new Planet({
					x : 250,
					y : 250,
					radius : 80,
					gravRadius : 600,
					solidColor : "#FFFFFF",
				}),
				new BasePlayer({
					midX : 200,
					midY : 50,
				}),
			],
		});
	}
}
