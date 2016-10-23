class Editor{
  var context = document.getElementById("coding");

  static show(){
    Game.state = CODE;
    context.style.visibility = "visible";
  }

  static hide(){
    context.style.visibility = "hidden";
    setTimeout(function(){Game.state = PLAY;}, 1000);
  }
}
