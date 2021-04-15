const OBJECT_REGISTRY = {};
const EDITOR_REGISTRY = {};
const EDITOR_REGISTRY_ADDABLE = [];
const BACKGROUND_REGISTRY = {};
const STAGE_REGISTRY = {};
const SELECTABLE_STAGES = [];
const EDITABLE_STAGES = [];

function registerObject(cass, nom = undefined) {
	OBJECT_REGISTRY[nom || cass.name] = cass;
}

function registerBackground(cass, nom = undefined) {
	BACKGROUND_REGISTRY[nom || cass.name] = cass;
}

function registerEditor(cass, nom = undefined, args = {}) {
	if (!nom)
		nom = cass.name;
	EDITOR_REGISTRY[nom] = cass;
	cass.prototype.lText = "Object-"+(nom);
	cass.getNewArgs = args.getNewArgs;
	if (args.getNewArgs)
		EDITOR_REGISTRY_ADDABLE.push(nom);
}

function objectFromRegistry(o) {
	if (o instanceof GameObject) {
		return o;
	}
	return new (OBJECT_REGISTRY[o.object])(o);
}

function editorFromRegistry(o) {
	if (o instanceof EditorObject) {
		return o;
	}
	return new (EDITOR_REGISTRY[o.object])(o);
}

function editorFromRegistryDefault(n, cam) {
	return new (EDITOR_REGISTRY[n])(EDITOR_REGISTRY[n].getNewArgs(cam));
}

function backgroundFromRegistry(b, ...rest) {
	return new (BACKGROUND_REGISTRY[b.background])(b, ...rest);
}


function registerStage(cons, id, args) {
	STAGE_REGISTRY[id] = cons;
	if (args.selectable)
		SELECTABLE_STAGES.push(id);
	if (args.editable)
		EDITABLE_STAGES.push(id);
}

function stageFromRegistry(id) {
	var reg = STAGE_REGISTRY[id];
	if (typeof reg == "function")
		return new (reg)();
	else
		return new Stage(reg);
}