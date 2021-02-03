var loading = {
	update : function() {
		
	},
	draw : function() {
		mainCtx.globalAlpha = 1;
		clearCanvas();
	}
}
var runnee = loading;
var gameObjects = [];
const FPS = 30;//TODO change back

var engine = {
	run : function() {
		var desiredTime = Date.now() + 1000/FPS;
		updateControllersBefore();
		runnee.update();
		runnee.draw();
		updateControllersAfter();
		//console.log(desiredTime-Date.now())
		this.sch = setTimeout(()=>this.run(), Math.max(0, desiredTime-Date.now()));
	},
	stop : function() {
		clearTimeout(this.sch)
	}
}

/*var gameEngine = {
	name : "Game Engine",
	update : function() {
		if (globalController.pauseClicked) {
			pause.begin();
			return;
		}
		if (globalController.restartClicked) {
			reEvalAnym();
			loadStage(currentStageName, false);
			return;
		}
		stageTimer ++;
		player.update();
		gameObjects.forEach(oj=>oj.update());
		removeDead(gameObjects);
	},
	draw : function() {
		mainCtx.globalAlpha = 1;
		clearCanvases();
		updateZoom();
		drawStageBack();
		gameObjects.forEach(oj => oj.draw());
		player.draw();
		drawStageFore();
		hud.draw();
	},
	updatesObjects : true
}

function allObjects() {
	if (runnee == multiplayerEngine)
		return [...players, ...gameObjects]
	else
		return [player, ...gameObjects];
}

//var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var gameReady = {
	name : "Ready",
	next : gameEngine,
	update : function() {
		if (player.controller.leftClicked || player.controller.rightClicked || player.controller.upClicked || player.controller.downClicked || player.controller.jumpClicked || player.controller.attackClicked || player.controller.shootClicked || player.controller.pauseClicked) {
			runnee = this.next;
			this.next.update();
		}
	},
	draw : function() {
		this.next.draw();
	}
}

function removeDead(ray) {
	var i = 0;
	while (i < ray.length) {
		if (ray[i].dead)
			ray.splice(i, 1);
		else
			i++;
	}
}*/

function clearCanvas() {
	mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
	//fctx.clearRect(0, 0, fcanvas.width, fcanvas.height);
}

function clearWorld() {
	worldCtx.clearRect(0, 0, worldCanvas.width, worldCanvas.height);
}