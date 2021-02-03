function drawTextInRect(text, x, y, width, height, opts = {}, ctx = mainCtx) {
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = height+"px "+settings.font;
	var wid = ctx.measureText(text).width;
	if (wid > width)
		ctx.font = (height*width/wid)+"px "+settings.font;
	if (opts.strokeStyle || opts.stroke) {
		ctx.lineWidth = 2;
		ctx.strokeStyle = opts.strokeStyle || opts.stroke;
		ctx.strokeText(text, x+width/2, y+height/2);
	}
	if (opts.fillStyle || opts.fill)
		ctx.fillStyle = opts.fillStyle || opts.fill;
	ctx.fillText(text, x+width/2, y+height/2);
}

function drawParagraphInRect(text, x, y, width, height, size) {
	if (!text)
		return y;
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.font = size+"px "+settings.font;
	if (Array.isArray(text))
		text = text.join(" <br> ");
	var words = text.split(" ");
	var cx = x;
	var cy = y;
	for (var i = 0; i < words.length; i++) {
		ctx.fillStyle = palette.normal;
		var word = words[i];
		if (word.indexOf("<") >= 0) {
			if (word == "<br>") {
				cy += size;
				cx = x;
			}
		}
		var wwid = ctx.measureText(word).width;
		//console.log(word, cx, cy);
		if (word != "<br>") {
			if (cx + wwid > x + width) {
				cy += size;
				cx = x;
			}
			ctx.fillText(word, cx, cy);
			cx += wwid + ctx.measureText(" ").width;
		}
	}
	return cy + size;
}

function drawADV(text, stuff) {
	var head;
	var chardat = CHARACTER_DATA[stuff];
	var colorBack = palette.background;
	if (chardat) {
		head = chardat.name;
		colorBack = chardat.colors.light;
	} else if (typeof stuff == "string")
		head = stuff;
	var bwidth = Math.min(canvas.width-10, Math.max(canvas.width/2, 600));
	var bx = canvas.width/2 - bwidth/2;
	var bheight = 200;
	var by = canvas.height - 5 - bheight;
	var hx = bx;
	var hwidth = 240;
	var hheight = 50;
	var hy = by - hheight
	ctx.fillStyle = colorBack;
	ctx.strokeStyle = palette.normal;
	ctx.fillRect(bx, by, bwidth, bheight);
	ctx.strokeRect(bx, by, bwidth, bheight);
	if (head) {
		ctx.fillRect(hx, hy, hwidth, hheight);
		ctx.strokeRect(hx, hy, hwidth, hheight);
	}
	ctx.fillStyle = palette.normal;
	drawParagraphInRect(text, bx+10, by+10, bwidth-20, bheight-20, 30);
	if (head)
		drawTextInRect(head, hx+5, hy+5, hwidth-10, hheight-10);
}