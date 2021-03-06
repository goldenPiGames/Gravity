
const STAGE_DATA_TUTORIAL = {
	"width" : 860,
	"height" : 1500,
	/*"background" : {
		"background": "Solid",
		"color" : "#202020"
	},*/
	"background" : {
		"background": "SingleImage",
		"spriteSheet" : "BackgroundStormySkies",
		"scale" : 5,
		"parallax" : 0.1,
	},
	"music" : "Joy Noise",
	"timePar" : 840,
	"objects" : [
		{
			"object" : "StaticGridTerrain",
			"topY" : 0,
			"grid" : [
				[0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,2,2],
				[0,0,0,4,4,4,4,4,4,4,4,4,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,1,1,1,1,1,1,1,1,4,4,4,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,4,4,4,4,4,1,1,1,1,1,1,1,1,1,4,4,4,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,4,4,4,4,4,1,1,1,1,1,1,1,1,1,4,4,4,2,2,2,2,2,2,2,2,2],
				[0,0,0,0,0,0,0,0,0,4,4,4,4,4,1,1,1,1,1,1,1,1,1,4,4,4,2,2,2,2,2,2,2,2,2],
				[6,6,6,6,6,6,6,6,6,6,4,4,4,4,1,1,1,1,1,1,1,1,1,4,4,7,7,7,7,7,7,7,7,7,7],
				[6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7,7,7,7,7,7,7,7,7,7],
				[6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7,7,7,7,7,7,7,7,7,7],
				[6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7,7,7,7,7,7,7,7,7,7],
				[6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7,7,7,7,7,7,7,7,7,7],
				[6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7,7,7,7,7,7,7,7,7,7],
				[6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7,7,7,7,7,7,7,7,7,7],
				[6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7,7,7,7,7,7,7,7,7,7],
				[6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7,7,7,7,7,7,7,7,7,7],
				[6,6,6,6,6,6,6,6,6,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,7,7,7,7,7,7,7,7,7,7]],
			"bank" : [
				{
					"solid" : false,
					"gravity" : "down"
				},
				{
					"solid" : false,
					"gravity" : "left"
				},
				{
					"solid" : false,
					"gravity" : "up"
				},
				{
					"solid" : false,
					"gravity" : "right"
				},
				{
					"solid" : true
				},
				{
					"solid" : true
				},
				{
					"solid" : false,
					"round" : true,
					"centerSolid" : true,
					"gravity" : "round",
					"centerX" : 33,
					"centerY" : 10
				},
				{
					"solid" : false,
					"round" : true,
					"centerSolid" : true,
					"gravity" : "round",
					"centerX" : 33,
					"centerY" : 25
				}
			],
			"gravPriority" : 3,
			"tileset" : "SubtilesetStoneBrick",
			"scale" : 20
		},
		{
			"object" : "Planet", 
			"x" : 300,
			"y" : 950,
			"radius" : 50,
			"gravRadius" : 600,
			"gravPriority" : 2,
			"tileset" : "RadTilesetStoneBrick",
			"radGrid" : [
				[0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0],
				[0,1,1,1,1,1,0,0,0],
				[0,0,0,1,0,0,0,0,0],
				[0,0,0,1,0,0,1,0,1],
				[0,0,0,1,0,0,1,0,0],
				[0,0,0,0,0,0,0,0,0],
				[0,1,0,0,0,0,0,0,0],
				[0,1,0,0,0,0,0,0,0],
				[0,1,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0],
			],
			"radGridBank" : [
				{
					"solid" : false,
					"gravity" : "in"
				},
				{
					"solid" : true
				},
			],
			"radGridRScale" : 40,
			//"radGridThetaOffset" : .5
		},
		{
			"object" : "StaticGridTerrain",
			"leftX" : 660,
			"topY" : 1200,
			"grid" : [
				[0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,1],
				[0,0,0,0,0,0,0,1],
			],
			"bank" : [
				{
					"solid" : false,
					"gravity" : "down"
				},
				{
					"solid" : true
				},
			],
			"gravPriority" : 5,
			"tileset" : "SubtilesetStoneBrick",
			"scale" : 20
		},
		{
			"object" : "Goalpost",
			"x" : 830,
			"y" : 1340,
			"r" : 140,
			"rotation" : 0,
		},
		{
			"object" : "Player",
			"midX" : 50,
			"midY" : 50,
			//"midX" : 660,
			//"midY" : 530,
		},
		{
			"object" : "ScriptCueArea",
			"body" : {
				"shape" : "Circle",
				"midX" : 80,
				"midY" : 150,
				"radius" : 60,
			},
			"script" : "Tutorial-Walk"
		},
		{
			"object" : "ScriptCueArea",
			"body" : {
				"shape" : "Circle",
				"midX" : 300,
				"midY" : 270,
				"radius" : 30,
			},
			"script" : "Tutorial-Jump"
		},
		{
			"object" : "ScriptCueArea",
			"body" : {
				"shape" : "Circle",
				"midX" : 580,
				"midY" : 160,
				"radius" : 20,
			},
			"script" : "Tutorial-Gravity"
		},
		{
			"object" : "ScriptCueArea",
			"body" : {
				"shape" : "Circle",
				"midX" : 669,
				"midY" : 303,
				"radius" : 12,
			},
			"script" : "Tutorial-LedgeCircle"
		}
	],
	scripts : [
		{
			"id" : "Tutorial-Walk",
			"what" : "dialog",
			"dialog" : [
				{speakerID:"me", lText:"Tutorial-Walk", lTextAddController:"true", duration:150},
			]
		},
		{
			"id" : "Tutorial-Jump",
			"what" : "dialog",
			"dialog" : [
				{speakerID:"me", lText:"Tutorial-Jump", lTextAddController:"true", duration:100},
			]
		},
		{
			"id" : "Tutorial-Gravity",
			"what" : "dialog",
			"dialog" : [
				{speakerID:"me", lText:"Tutorial-Gravity1", duration:105},
				//{speakerID:"me", lText:"Tutorial-Gravity2", duration:120},
			]
		},
		{
			"id" : "Tutorial-LedgeCircle",
			"what" : "dialog",
			"dialog" : [
				{speakerID:"me", lText:"Tutorial-LedgeCircle1", duration:160},
				{speakerID:"me", lText:"Tutorial-LedgeCircle2", duration:105},
			]
		}
	]
}
registerStage(STAGE_DATA_TUTORIAL, "Tutorial", {
	"selectable" : false,
	"editable" : true,
});