class ScrollContainer extends MenuObject {
	constructor() {
		super();
		this.scroll = 0;
	}
	resize(x, y, width, height) {
		this.resizeRect(x, y, width, height);
		this.scrollObjects.forEach(o=>y=o.resize(this.x, y, this.width, 50));//TODO another way of deciding height?
		this.rescrollObjects();
	}
	rescrollObjects() {
		this.scrollObjects.forEach(o=>o.setScroll(this.scroll));
	}
	update(menu) {
		super.update(menu);
		this.scrollObjects.forEach(o=>o.update(menu, this));
	}
	draw(menu) {
		this.scrollObjects.forEach(o=>o.draw(menu, this));
	}
	connect() {
		for (var i = 0; i < this.scrollObjects.length - 1; i++) {
			this.scrollObjects[i].connectDown = this.scrollObjects[i+1];
			this.scrollObjects[i+1].connectUp = this.scrollObjects[i];
		}
	}
}
ScrollContainer.prototype.hoverable = false;

class ScrollObject extends MenuObject {
	setScroll(s) {
		this.y = this.baseY + s;
	}
	resize(...aaaa) {
		this.resizeRect(...aaaa);
		this.baseY = this.y;
		return this.baseY + this.height;
	}
	update(menu, cont) {
		super.update(menu);
	}
}
ScrollObject.prototype.hoverable = true;