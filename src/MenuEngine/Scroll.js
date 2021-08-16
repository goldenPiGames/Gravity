class ScrollContainer extends MenuObject {
	constructor() {
		super();
		this.scroll = 0;
	}
	resize(x, y, width, height) {
		this.resizeRect(x, y, width, height);
		this.scrollObjects.forEach(o=>y=o.resize(this.x, y, this.width, 50));//TODO another way of deciding height?
		this.rescrollObjects();
		this.maxScroll = y - this.height;
		this.ensureOnScreen(this.lastHovered);
	}
	setScroll(to) {
		this.scroll = Math.max(0, Math.min(to, this.maxScroll));
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
		if (this.lastHovered)
			this.lastHovered = this.scrollObjects[0];
		connectVert(...this.scrollObjects);
	}
	setConnectRight(obj) {
		super.setConnectRight(obj);
		this.scrollObjects.forEach(so=>so.setConnectRight(obj));
	}
	getConnectForward() {
		return this.lastHovered;
	}
	thingHovered(thing) {
		this.lastHovered = thing;
		this.ensureOnScreen(thing);
	}
	ensureOnScreen(thing) {
		if (!thing)
			return;
		if (thing.baseY < this.scroll + this.height*1/4)
			this.setScroll(thing.baseY - this.height*1/4);
		else if (thing.baseY + thing.height > this.scroll + this.height*3/4)
			this.setScroll(thing.baseY + thing.height - this.height*3/4);
	}
}
ScrollContainer.prototype.hoverable = false;
ScrollContainer.prototype.doesConnectForward = true;

class ScrollObject extends MenuObject {
	setScroll(s) {
		this.y = this.baseY - s;
	}
	resize(...aaaa) {
		this.resizeRect(...aaaa);
		this.baseY = this.y;
		return this.baseY + this.height;
	}
	update(menu, cont) {
		super.update(menu);
		if (this.hovered) {
			cont.thingHovered(this);
		}
	}
}
ScrollObject.prototype.hoverable = true;