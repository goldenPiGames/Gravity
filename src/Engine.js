var loading = {
	update : function() {
		
	},
	draw : function() {
		mainCtx.globalAlpha = 1;
		clearCanvas();
	}
}
var runnee = loading;
const FPS = 30;
var fps = 30;
var globalTimer = 0;

var engine = {
	run : function() {
		var desiredTime = Date.now() + 1000/fps;
		updateResize();
		updateControllersBefore();
		runnee.update();
		musicLoopCheck();//moved this here because mute check
		globalTimer++;
		updateControllersAfter();
		runnee.draw();
		drawControllers();
		//console.log(desiredTime-Date.now())
		this.sch = setTimeout(()=>this.run(), Math.max(0, desiredTime-Date.now()));
	},
	stop : function() {
		clearTimeout(this.sch)
	}
}

/*

//var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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

function clearStaticWorld() {
	staticWorldCtx.clearRect(0, 0, staticWorldCanvas.width, staticWorldCanvas.height);
}