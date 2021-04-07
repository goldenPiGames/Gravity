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
		if (args.rotation) {
			ctx.translate(args.x, args.y);
			ctx.rotate(args.rotation);
			ctx.translate(-args.x, -args.y);
		}
		if (args.flipHoriz) {
			ctx.scale(-1, 1);
			ctx.translate(-args.x*2, 0);
		}
		var drawWidth = args.width || datum.width*args.scale || datum.width;
		var drawHeight = args.height || datum.height*args.scale || datum.height;
		ctx.drawImage(this.image, datum.x, datum.y, datum.width, datum.height, args.x - (drawWidth * args.xadj || 0), args.y - (drawHeight * args.yadj || 0), drawWidth, drawHeight);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
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
	drawOnCtxRadial(spriteName, args, ctx) {//TODO
		if (Array.isArray(spriteName))
			spriteName = this.findSpriteName(spriteName);
		if (!spriteName)
			return;
		var datum = this.data[spriteName];
		if (!datum) {
			console.log("Datum "+spriteName+" does not exist for this sprite sheet");
			return;
		}
		var outerR;
		if (typeof args.outerR == "number") {
			outerR = args.outerR;
		} else {
			
		}
		var thetaScale = 0;//TODO
		var thetaWidth = 0;//TODO
		var ccwTheta
		if (typeof args.ccwTheta == "number") {
			ccwTheta = args.ccwTheta;
		} else if (typeof args.cwTheta == "number") {
			ccwTheta = args.cwTheta - arcWidth;
		} else {
			ccwTheta = args.theta - arcWidth * (args.thetaadj || 0)
		}
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