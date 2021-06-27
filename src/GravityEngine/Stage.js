const OBRET_REMOVE = "REMOVE";

class Stage {
	constructor(args) {
		if (typeof args == "string")
			args = JSON.parse(args);
		//this.texture = getSpriteSheet(args.texture || "StoneBrick");
		this.width = args.width;
		this.height = args.height;
		this.objects = args.objects.map(o=>objectFromRegistry(o));
		this.scripts = {};
		if (args.scripts)
			args.scripts.forEach(s=>this.scripts[s.id]=new Script(s));
		this.background = backgroundFromRegistry(args.background || {"background":"Solid"}, this);
		this.music = args.music;
		//playMusic(this.music);
		this.gravX = typeof args.gravX == "number" ? args.gravX : args.gravity ? args.gravity.x : 0;
		this.gravY = typeof args.gravT == "number" ? args.gravT : args.gravity ? args.gravity.y : .5;
		this.time = 0;
		this.objectsNext = [];
	}
	update() {
		this.objects = [...this.objects, ...this.objectsNext];
		this.objectsNext = [];
		//sorting into lists for more efficient traversal later
		this.terrains = this.objects.filter(oj => oj.isPixelSolid || oj.getGravityAtPixel);
		this.hittables = this.objects.filter(oj => oj.hittable);
		this.objects = this.objects.filter(oj => oj.update(this) != OBRET_REMOVE); //where the actual updating happens
		this.time ++;
	}
	drawWorld() {
		disableImageSmoothing(worldCtx);
		//console.log("blah");
		worldCtx.drawImage(staticWorldCanvas, 0, 0);
		this.objects.forEach(oj=>oj.draw(this));
		this.objectsNext.forEach(oj=>oj.draw(this));
	}
	drawStatic() {
		this.objects.forEach(oj=>oj.drawStatic(this));
	}
	isPixelSolid(x, y) {
		return this.terrains.find(oj=>oj.isPixelSolid && oj.isPixelSolid(x, y))
	}
	getGravityAtPixel(x, y, body, object) {
		//console.log(body)
		var prior = -1;
		var curr;
		this.terrains.forEach(oj => {
			if (oj.getGravityAtPixel) {
				var grav = oj.getGravityAtPixel(x, y, body, object);
				if (grav && grav.priority > prior) {
					prior = grav.priority;
					curr = grav;
				}
			}
		});
		return curr || new VectorRect(this.gravX, this.gravY);
	}
	addObject(oj) {
		this.objectsNext.push(oj);
		//TODO add to specific lists
	}
	sendHitbox(args) {
		var toret = [];
		this.hittables.forEach(o => {
			if (args.body.intersects(o.hittable)) {//TODO teams
				o.getHit(args);
				toret.push(o);
			}
		});
		return toret;
	}
	getAllPlayers() {
		return this.objects.filter(p=>p.controller); //TODO change this
	}
	startDialog(...stuff) {
		this.engine.startDialog(...stuff);
	}
	touchGoal(to) {
		this.engine.touchGoal(to);
	}
	randomInt(to) {
		return Math.floor(Math.random()*to)//TODO PRNG
	}
	runScript(id) {
		console.log(id);
		var scr = this.scripts[id];
		if (!scr) {
			console.log(id + " is not a script id");
		} else {
			scr.execute(this);
		}
	}
}


function stopDrawWorld(stage) {
	engine.stop();
	clearWorld();
	stage.drawStop();
}


function stopDrawWorldSolid(stage) {
	engine.stop();
	clearWorld();
	worldCtx.fillStyle = "#FFFFFF";
	for (var i = 0; i < stage.width; i++) {
		for (var j = 0; j < stage.height; j++) {
			if (stage.isPixelSolid(i, j))
				worldCtx.fillRect(i, j, 1, 1);
		}
	}
}
