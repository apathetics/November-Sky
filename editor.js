class Editor{
	static init(){
		Editor.context = document.getElementById("coding");
		Editor.text_area = document.getElementById("editor");
		Editor.text_area.addEventListener("keydown", function(event){
			if (event.keyCode === 9) {
				event.preventDefault();
				document.execCommand("insertText", false, "\t");
			}
		},false);
	}

	static perform(text){
		if (Editor.parse_text(text))
			Editor.hide();
	}

	static parse_text(text){
		if (Game.rocket === null)
				return true;

		//expose API
		var sensors = Game.rocket.sensors;
		var controls = Game.rocket.controls;
		var input = Game.rocket.input;
		var KEY = Game.KEY;

		//retain old code in case of error
		var oldLoop = Game.rocket.userLoop;

		try {
			var f = eval("()=>{"+text+"}");
			f();
			Game.rocket.userLoop = f;
			return true;
		}
		catch (e) {
			alert("Code contains an error:\n" + e);
			Game.rocket.userLoop = oldLoop;
			return false;
		}
	}

	static show(){
		Game.state = CODE;
		Editor.context.style.visibility = "visible";
		Editor.context.style.zIndex = 10;
		Editor.text_area.width = window.innerWidth;
		Editor.text_area.height = window.innerHeight;

	}

	static hide(){
		Editor.context.style.visibility = "hidden";
		Editor.context.style.zIndex = -10;
		setTimeout(function(){Game.state = PLAY;}, 1000);
	}
}
