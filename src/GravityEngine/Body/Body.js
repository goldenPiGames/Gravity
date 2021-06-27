const MIN_SOLID_SIZE = 5;
const MAX_REAL_STEP_2 = 0.004;
const STAY_GROUNDED_MULT = 5;

class Body {
	intersectsAny(lith) {
		return lith.find(i=>this.intersects(i));
	}
}



var TEST_RADS = [Math.PI]


const BODY_REGISTRY = {};

function registerBody(cass, nom = undefined) {
	BODY_REGISTRY[nom || cass.name] = cass;
}

function bodyFromRegistry(o) {
	return new (BODY_REGISTRY[o.shape])(o);
}