const OBJECT_REGISTRY = {};
const EDITOR_REGISTRY = {};

function registerObject(cass) {
	OBJECT_REGISTRY[cass.name] = cass;
}

function registerEditor(cass) {
	EDITOR_REGISTRY[cass.name] = cass;
}