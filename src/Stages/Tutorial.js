function startTutorial() {
	switchScreen(new SingleStageEngine(new TutorialStage()));
}

class TutorialStage extends Stage {
	constructor() {
		super({
			width : 600,
			height : 800,
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
						[1,1,1,1,1,1,0,0,0,0,1,1,1,1,1],
						[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
						[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
						[1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
						[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
					tileset : getSpriteSheet("TilesetDemo"),
					scale : 20,
				}),
				new Planet({
					x : 250,
					y : 500,
					radius : 50,
					gravRadius : 210,
					solidColor : "#FFFFFF",
				}),
				new BasePlayer({
					midX : 50,
					midY : 50,
				}),
			],
		});
	}
}
/*
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
*/