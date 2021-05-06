class ObjectSpawner extends GameObject {
	constructor(args) {
		super();
		this.interval = args.interval;
		this.cooldown = 0;
		this.objectArgs = args.objectArgs;
	}
	update(stage) {
		this.cooldown--;
		if (this.cooldown <= 0) {
			stage.addObject(this.makeObject(stage));
			this.cooldown = this.interval;
		}
	}
	makeObject(stage) {
		return objectFromRegistry(this.objectArgs);
	}
	draw() {
		
	}
}
registerObject(ObjectSpawner, "ObjectSpawner");


class ObjectSpawnerRandom extends ObjectSpawner {
	constructor(args) {
		super(args);
	}
	makeObject(stage) {
		return objectFromRegistry(this.objectArgs[stage.randomInt(this.objectArgs.length)]);
	}
}
registerObject(ObjectSpawnerRandom, "ObjectSpawnerRandom");