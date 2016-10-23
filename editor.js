class Editor{
  static init(){
    Editor.context = document.getElementById("coding");
  }
  static show(){
    Game.state = CODE;
    Editor.context.style.visibility = "visible";
    Editor.context.style.zIndex = 10;
  }

  static hide(){
    Editor.context.style.visibility = "hidden";
    Editor.context.style.zIndex = -10;
    setTimeout(function(){Game.state = PLAY;}, 1000);
  }
}
