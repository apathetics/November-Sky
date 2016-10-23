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
    Editor.parse_text(text);
    Editor.hide();
  }

  static parse_text(text){
    if(Game.rocket == null)
      return;
    var sensors = Game.rocket.sensors;
    var controls = Game.rocket.controls;
    var f = eval("()=>{"+text+"}");
    Game.rocket.userLoop = f;
    f();
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
