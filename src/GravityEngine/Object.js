class GameObject {
	constructor() {
		
	}
	drawStatic() {
		
	}
	getCameraX() {
		return this.body.getCenterX();
	}
	getCameraY() {
		return this.body.getCenterY();
	}
	getCameraRotation() {
		return this.body.rotation || 0;
	}
}