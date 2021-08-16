function makeImage(src) {
	var img = new Image();
	img.loaded = false;
	img.onload = function() {
		//loadedYet++;
		//img.crossOrigin = "anonymous";
		img.loaded = true;
		/*if (loadedYet >= loadingTotal) {
			resetLoading();
			loadReturn();
		}*/
	};
	img.src = src;
	return img;
}

class SpriteSheet {
	constructor(sauce, data, preload) {
		this.src = sauce;
		this.data = data;
		if (!this.data) {
			throw "no data defined for sheet "+sauce;
		}
		if (preload)
			this.load();
		spritesWaiting.push(this);
	}
	findSpriteName(ray) {
		return ray.find(s=>this.data[s]);
	}
	drawOnCtx(spriteName, args, ctx) {
		if (Array.isArray(spriteName))
			spriteName = this.findSpriteName(spriteName);
		if (!spriteName)
			return;
		var datum = this.data[spriteName];
		if (!datum) {
			console.log("Datum "+spriteName+" does not exist for this sprite sheet");
			return;
		}
		if (args.alpha) {
			var alphaBef = ctx.globalAlpha;
			ctx.globalAlpha = args.alpha;
		}
		if (args.rotation) {
			ctx.translate(args.x, args.y);
			ctx.rotate(args.rotation);
			ctx.translate(-args.x, -args.y);
		}
		if (args.flipHoriz) {
			ctx.scale(-1, 1);
			ctx.translate(-args.x*2, 0);
		}
		var drawWidth;
		var drawHeight;
		if (args.intOnly && args.maxWidth && args.maxHeight) {
			let scale = Math.floor(Math.min(args.maxWidth / datum.width, args.maxHeight / datum.height));
			drawWidth = datum.width * scale;
			drawHeight = datum.height * scale;
		} else if (args.scale) {
			drawWidth = datum.width*args.scale;
			drawHeight = datum.height*args.scale;
		} else if (args.width && args.height) {
			drawWidth = args.width;
			drawHeight = args.height;
		} else if (args.width) {
			drawWidth = args.width;
			drawHeight = args.width * datum.height / datum.width;
		} else if (args.height) {
			drawHeight = args.height;
			drawWidth = args.height * datum.width / datum.height;
		} else {
			drawWidth = datum.width;
			drawHeight = datum.height;
		}
		ctx.drawImage(this.image, datum.x, datum.y, datum.width, datum.height, args.x - (drawWidth * args.xadj || 0), args.y - (drawHeight * args.yadj || 0), drawWidth, drawHeight);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		if (args.alpha)
			ctx.globalAlpha = alphaBef;
	}
	drawParallax(spriteName, args, cam) {
		if (Array.isArray(spriteName))
			spriteName = this.findSpriteName(spriteName);
		if (!spriteName)
			return;
		var datum = this.data[spriteName];
		let ctx = mainCtx;
		
		var fulcrumX = cam.screenCenterX + args.baseX - cam.centerX * args.parallax;
		var fulcrumY = cam.screenCenterY + args.baseY - cam.centerY * args.parallax;
		ctx.translate(cam.screenCenterX, cam.screenCenterY);
		ctx.rotate((args.rotation || 0) - cam.rotation);
		ctx.translate(-cam.screenCenterX, -cam.screenCenterY);
		var drawWidth = args.width || datum.width*args.scale || datum.width;
		var drawHeight = args.height || datum.height*args.scale || datum.height;
		ctx.drawImage(this.image, datum.x, datum.y, datum.width, datum.height, fulcrumX - (drawWidth * (args.xadj || .5)), fulcrumY - (drawHeight * (args.yadj || .5)), drawWidth, drawHeight);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	drawOnMain(spriteName, args) {
		this.drawOnCtx(spriteName, args, mainCtx);
	}
	drawOnWorld(spriteName, args) {
		this.drawOnCtx(spriteName, args, worldCtx);
	}
	drawOnStaticWorld(spriteName, args) {
		this.drawOnCtx(spriteName, args, staticWorldCtx);
	}
	load() {
		if (this.loaded)
			return false;
		this.image = makeImage(this.src);
		return true;
	}
	isLoaded() {
		return this.image.loaded;
	}
	getWidthOf(nom) {
		return this.data[nom].width;
	}
	getHeightOf(nom) {
		return this.data[nom].height;
	}
	drawBorderOnMain(x, y, width, height) {
		let tbXStart = x + this.data.cornerUL.width;
		let tbXInc = this.data.edgeU.width;
		let tbXNum = Math.ceil((width - this.data.cornerUL.width - this.data.cornerUR.width) / tbXInc);
		let lrYStart = y + this.data.cornerUL.height;
		let lrYInc = this.data.edgeL.height;
		let lrYNum = Math.ceil((height - this.data.cornerUL.height - this.data.cornerDL.height) / lrYInc);
		for (var i = 0; i < tbXNum; i++) {
			this.drawOnCtx("edgeU", {
				x : tbXStart + tbXInc*i,
				y : y,
				xadj : 0,
				yadj : 0,
			}, mainCtx);
			this.drawOnCtx("edgeD", {
				x : tbXStart + tbXInc*i,
				y : y+height,
				xadj : 0,
				yadj : 1,
			}, mainCtx);
		}
		for (var i = 0; i < lrYNum; i++) {
			this.drawOnCtx("edgeL", {
				x : x,
				y : lrYStart + lrYInc*i,
				xadj : 0,
				yadj : 0,
			}, mainCtx);
			this.drawOnCtx("edgeR", {
				x : x + width,
				y : lrYStart + lrYInc*i,
				xadj : 1,
				yadj : 0,
			}, mainCtx);
		}
		this.drawOnCtx("cornerUL",  {
			x : x,
			y : y,
			xadj : 0,
			yadj : 0,
		}, mainCtx);
		this.drawOnCtx("cornerUR",  {
			x : x + width,
			y : y,
			xadj : 1,
			yadj : 0,
		}, mainCtx);
		this.drawOnCtx("cornerDL",  {
			x : x,
			y : y + height,
			xadj : 0,
			yadj : 1,
		}, mainCtx);
		this.drawOnCtx("cornerDR",  {
			x : x + width,
			y : y + height,
			xadj : 1,
			yadj : 1,
		}, mainCtx);
	}
	/**
	* cenx : center x
	* ceny : center y
	* thleft : theta (anticlockwise edge)
	* thright : theta (clockwise edge)
	* r : radius from center
	* radj: adjustment for height. 0 means that "r" is the outer radius, 1 means that "r" is the inner radius
	*/
	drawRadialOnCtx(spriteName, args, ctx) {
		if (Array.isArray(spriteName))
			spriteName = this.findSpriteName(spriteName);
		if (!spriteName)
			return;
		var datum = this.data[spriteName];
		if (!datum) {
			console.log("Datum "+spriteName+" does not exist for this sprite sheet");
			return;
		}
		if (args.alpha) {
			var alphaBef = ctx.globalAlpha;
			ctx.globalAlpha = args.alpha;
		}
		let dr = args.r - (args.radj || 0) * datum.height;
		let thstart = args.thleft;
		let thinc = 1/dr;
		let numl = (args.thright - args.thleft) / thinc - 1;
		for (var i = 0; i <= numl; i++) {
			ctx.translate(args.cenx, args.ceny);
			ctx.rotate(thstart + i * thinc);
			
			ctx.drawImage(this.image, datum.x + (i % (datum.width - 1)), datum.y, 2, datum.height, 0, -dr, 2, datum.height);
			
			//ctx.fillStyle = "#FF0000";
			//ctx.fillRect(0, -dr, 3, dr);
			
			ctx.setTransform(1, 0, 0, 1, 0, 0);
		}
		if (args.alpha)
			ctx.globalAlpha = alphaBef;
	}
	drawRadialOnStaticWorld(spriteName, args) {
		this.drawRadialOnCtx(spriteName, args, staticWorldCtx);
	}
}
function makeSprites(sauce, sec, prel = true) {
	var image;
	if (typeof sauce == "string") {
		if (prel)
			image = makeImage(sauce);
	} else {
		image = sauce;
		sauce = image.src;
	}
	var sheetData = {image:image, src:sauce};
	if (Array.isArray(sec)) {
		var subs = Array.prototype.slice.call(arguments, 1);
		subs.forEach(function(oj) {
			oj.image = sauce;
			sheetData[oj.name] = oj;
			oj.parent = sheetData;
		});
	} else {
		for (var sub in sec) {
			sheetData[sub] = sec[sub];
			sheetData[sub].image = image;
			sheetData[sub].parent = sheetData;
		}
	}
	return sheetData;
}