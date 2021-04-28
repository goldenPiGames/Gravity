const STAGE_DATA_SCRAMAZE = {
	"background":{
		"background":"SingleImage",
		"spriteSheet":"BackgroundStormySkies",
		"scale":4,
		"parallax":0.1
	},
	"music":"Notion",
	"width":660,
	"height":660,
	"objects":[
		{
			"object":"StaticGridTerrain",
			"leftX":0,
			"topY":0,
			"scale":20,
			"tileset":"SubtilesetStoneBrick",
			"gravArrows":true,
			"gravBorders":true,
			"grid":[
				[4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4],
				[4,3,3,3,4,0,0,0,0,0,0,0,0,0,0,0,4,2,2,2,4,0,0,0,0,0,0,0,4,1,1,1,4],
				[4,3,3,3,4,0,0,0,0,0,0,0,0,0,0,0,4,2,2,2,4,0,0,0,0,0,0,0,4,1,1,1,4],
				[4,3,3,3,4,0,0,0,0,0,0,0,0,0,0,0,4,2,2,2,4,0,0,0,0,0,0,0,4,1,1,1,4],
				[4,3,3,3,4,4,4,4,4,3,3,3,4,0,0,0,4,2,2,2,4,0,0,0,4,4,4,4,4,4,1,1,4],
				[4,3,3,3,3,3,3,3,3,3,3,3,4,0,0,0,4,3,3,3,3,3,3,3,3,3,3,3,4,1,1,1,4],
				[4,3,3,3,3,3,3,3,3,3,3,3,4,0,0,0,4,3,3,3,3,3,3,3,3,3,3,3,4,1,1,1,4],
				[4,3,3,3,3,3,3,3,3,3,3,3,4,0,0,0,4,3,3,3,3,3,3,3,3,3,3,3,4,1,1,1,4],
				[4,4,4,4,4,3,3,3,4,4,4,4,4,0,0,0,4,4,4,4,4,3,3,3,4,4,4,4,4,1,1,1,4],
				[4,3,3,3,3,3,3,3,4,0,0,0,0,0,0,0,4,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,4],
				[4,3,3,3,3,3,3,3,4,0,0,0,0,0,0,0,4,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,4],
				[4,3,3,3,3,3,3,3,4,0,0,0,0,0,0,0,4,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,4],
				[4,4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,4],
				[4,2,2,2,2,2,2,2,4,0,0,0,4,0,0,0,4,2,2,2,2,2,2,2,4,2,2,2,1,1,1,1,4],
				[4,2,2,2,2,2,2,2,4,0,0,0,4,0,0,0,4,2,2,2,2,2,2,2,4,2,2,2,1,1,1,1,4],
				[4,2,2,2,2,2,2,2,4,0,0,0,4,0,0,0,4,2,2,2,2,2,2,2,4,2,2,2,1,1,1,1,4],
				[4,2,2,2,4,2,2,2,4,0,0,0,4,0,0,0,4,4,4,4,4,2,2,2,4,2,2,2,4,4,4,4,4],
				[4,2,2,2,4,2,2,2,2,0,0,0,0,0,0,0,4,0,0,0,4,2,2,2,4,2,2,2,3,3,3,3,4],
				[4,2,2,2,4,2,2,2,2,0,0,0,0,0,0,0,4,0,0,0,4,2,2,2,4,2,2,2,3,3,3,3,4],
				[4,2,2,2,4,2,2,2,2,0,0,0,0,0,0,0,4,0,0,0,4,2,2,2,4,2,2,2,3,3,3,3,4],
				[4,4,4,4,4,2,2,2,4,4,4,4,4,4,4,4,4,0,0,0,4,2,2,2,4,4,4,4,4,3,3,4,4],
				[4,2,2,2,2,2,2,2,4,1,1,1,1,1,1,1,1,0,0,0,4,2,2,2,1,1,1,1,1,3,3,3,4],
				[4,2,2,2,2,2,2,2,4,1,1,1,1,1,1,1,1,0,0,0,4,2,2,2,1,1,1,1,1,3,3,3,4],
				[4,2,2,2,2,2,2,2,4,1,1,1,1,1,1,1,1,0,0,0,4,2,2,2,1,1,1,1,1,3,3,3,4],
				[4,2,2,2,4,4,4,4,4,3,3,3,4,2,2,2,4,4,4,4,4,2,2,2,4,4,4,4,4,4,3,3,4],
				[4,2,2,2,3,3,3,3,3,3,3,3,4,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,4,3,3,3,4],
				[4,2,2,2,3,3,3,3,3,3,3,3,4,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,4,3,3,3,4],
				[4,2,2,2,3,3,3,3,3,3,3,3,4,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,4,3,3,3,4],
				[4,2,2,2,4,4,4,4,4,3,3,4,4,2,2,2,4,2,2,2,4,4,4,4,4,0,0,0,4,3,3,4,4],
				[4,2,2,2,1,1,1,1,4,3,3,3,4,2,2,2,4,3,3,3,3,3,3,3,4,0,0,0,4,3,3,3,4],
				[4,2,2,2,1,1,1,1,4,3,3,3,4,2,2,2,4,3,3,3,3,3,3,3,4,0,0,0,4,3,3,3,4],
				[4,2,2,2,1,1,1,1,4,3,3,3,4,2,2,2,4,3,3,3,3,3,3,3,4,0,0,0,4,3,3,3,4],
				[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
			],
			"bank":[
				{
					"solid":false,
					"gravity":"down"
				},
				{
					"solid":false,
					"gravity":"left"
				},
				{
					"solid":false,
					"gravity":"up"
				},
				{
					"solid":false,
					"gravity":"right"
				},
				{
					"solid":true
				}
			]
		},
		{
			"object":"Player",
			"midX":50,
			"midY":150
		},
		{
			"object":"Goalpost",
			"x":50,
			"y":340,
			"r":60,
			"rotation":3.14159
		}
	]
}
registerStage(STAGE_DATA_SCRAMAZE, "Scramaze", {
	"selectable" : true,
	"editable" : true,
});