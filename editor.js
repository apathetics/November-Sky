class Editor{
  static init(){
    Editor.context = document.getElementById("coding");
  }
  static show(){
    Game.state = CODE;
    Editor.context.style.visibility = "visible";
  }

  static hide(){
    Editor.context.style.visibility = "hidden";
    setTimeout(function(){Game.state = PLAY;}, 1000);
  }
}
