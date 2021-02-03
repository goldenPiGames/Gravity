function makeImage(src) {
	var img = new Image();
	loadingTotal++;
	img.loaded = false;
	img.onload = function() {
		loadedYet++;
		//img.crossOrigin = "anonymous";
		img.loaded = true;
		if (loadedYet >= loadingTotal) {
			resetLoading();
			loadReturn();
		}
	};
	img.src = src;
	return img;
}

class SpriteSheet {
	constructor(sauce, data, preload) {
		this.src = sauce;
		this.data = data;
		if (preload)
			this.load();
	}
	drawOnCtx(spriteName, args, ctx) {
		//console.log(spriteName)
		if (Array.isArray(spriteName))
			spriteName = spriteName.find(s=>this.data[s]);
		//console.log(spriteName)
		if (!spriteName)
			return;
		var datum = this.data[spriteName];
		if (args.rotation) {
			//TODO
			ctx.translate(args.x, args.y);
			ctx.rotate(args.rotation);
			ctx.translate(-args.x, -args.y);
		}
		if (args.flipHoriz) {
			ctx.scale(-1, 1);
			ctx.translate(-args.x*2, 0);
		}
		ctx.drawImage(this.image, datum.x, datum.y, datum.width, datum.height, args.x - ((args.width || datum.width) * args.xadj || 0), args.y - ((args.height || datum.height) * args.yadj || 0), args.width || datum.width*args.scale || datum.width, args.height || datum.height*args.scale || datum.height);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
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
		this.loaded = true;
		this.image = makeImage(this.src);
		return true;
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

function loadSprites(data) {
	//console.log(data);
	if (data) {
		var image = makeImage(data.src);
		//console.log(image);
		data.image = image;
		for (var sub in data) {
			data[sub].image = image;
		}
	}
}