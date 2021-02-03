var ZOOM_MIN = .5;
var ZOOM_MAX = 3;
var ZOOM_SPEED = .05;
var cameraLeftBound = 0;
var cameraRightBound = 1200;
var cameraTopBound = 0;
var cameraBottomBound = 900;
var oobtopcolor = "#000000";
var oobbottomcolor = "#000000";

class Camera {
	constructor(stage) {
		this.stage = stage;
		this.centerX = 0;
		this.centerY = 0;
		this.zoom = 1;
		this.rotation = 0;
	}
	update() {
		
	}
	move() {
		if (this.focus) {
			this.centerX = Math.round(this.focus.getCameraX());
			this.centerY = Math.round(this.focus.getCameraY());
			if (this.rotateWithFocus) {
				this.rotation = this.focus.getCameraRotation();
			}
		}
		if (this.controller.zoomIn)
			this.zoom = Math.min(this.zoom+ZOOM_SPEED, ZOOM_MAX);
		if (this.controller.zoomOut)
			this.zoom = Math.max(this.zoom-ZOOM_SPEED, ZOOM_MIN);
	}
	draw() {
		this.move();
		this.transfer();
	}
	transfer() {
		mainCtx.translate(mainCanvas.width/2, mainCanvas.height/2);
		mainCtx.rotate(-this.rotation);
		mainCtx.drawImage(worldCanvas, -this.centerX * this.zoom, -this.centerY * this.zoom, worldCanvas.width*this.zoom, worldCanvas.height*this.zoom);
		mainCtx.setTransform(1, 0, 0, 1, 0, 0);
	}
	rotateCW(amount) {
		this.rotation += amount;
	}
}
Camera.prototype.controller = globalController;

class MultiFocus {
	constructor(list) {
		this.list = list;
	}
	update() {
		this.x = this.list.reduce((acc, cur) => acc + cur.x, 0) / this.list.length;
		this.y = this.list.reduce((acc, cur) => acc + cur.y, 0) / this.list.length;
	}
}