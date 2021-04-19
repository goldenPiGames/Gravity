const STAGE_DATA_INCORNER = {
	"background":{
		"background":"SingleImage",
		"spriteSheet":"BackgroundStormySkies",
		"scale":5,
		"parallax":0.1
	},
	"music":"Notion",
	"width":780,
	"height":560,
	"objects":[
		{
			"object":"Player",
			"midX":269,
			"midY":143
		},
		{
			"object":"Goalpost",
			"x":390,
			"y":320,
			"r":80,
			"rotation":0
		},
		{
			"object":"StaticGridTerrain",
			"leftX":0,
			"topY":0,
			"scale":20,
			"tileset":"SubtilesetStoneBrick",
			"grid":[
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2]
			],
			"bank":[
				{
					"solid":false,
					"gravity":"down"
				},
				{
					"solid":false,
					"gravity":"right"
				},
				{
					"solid":false,
					"gravity":"up"
				},
				{
					"solid":false,
					"gravity":"left"
				},
				{
					"solid":true
				}
			]
		}
	]
}
registerStage(STAGE_DATA_INCORNER, "Incorner", {
	"selectable" : false,
	"editable" : true,
});