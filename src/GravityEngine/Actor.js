class Actor extends GameObject {
	
}

class Mob extends Actor {
	constructor(args) {
		super();
		this.maxhp = args.maxhp;
		this.hp = this.maxhp;
	}
	getHit(args) {
		this.takeDamage(args.damage);
	}
	takeDamage(amount) {
		this.hp -= amount;
		if (this.hp <= 0) {
			this.dead = true;
		}
	}
}