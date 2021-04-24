class EditorSidebarFile extends EditorSidebarSub {
	constructor() {
		super([
			new EditorPanelButton({
				lText: "Editor-File-LoadBaseStage",
				func : ()=>this.parent.switchSub(new EditorSidebarLoadBaseStage())
			}),
			new EditorPanelButton({
				lText: "Editor-File-SaveFile",
				func : ()=>saveFile(this.engine.getPrettyJSON(), "mystage.gravstage")
			}),
		]);
	}
	back() {
		this.parent.switchSub(new EditorSidebarMain());
	}
}

class EditorSidebarLoadBaseStage extends EditorSidebarSub {
	constructor() {
		super([
			...EDITABLE_STAGES.map(sid=>new EditorPanelButton({
				lText : "Stage-"+sid,
				func : ()=>this.engine.loadStage(STAGE_REGISTRY[sid])
			})),
		]);
	}
	back() {
		this.parent.switchSub(new EditorSidebarFile());
	}
}



//https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
function saveFile(str, name) {
	var file = new Blob([str], {type : "text/plain"});
	var a = document.createElement("a");
	var url = URL.createObjectURL(file);
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	setTimeout(function() {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);  
	}, 0); 
}