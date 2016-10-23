var Sleeping = Matter.Sleeping,
    World = Matter.World,
    Game = Matter.Game;

class GameObject{
  constructor(body){
    this.body = body;
    this.body.isFloating = true;
  }

  destroy(){
    World.remove(Game.engine.world, this.body);
    this.body = null;
  }

  add(){
    World.add(Game.engine.world, this.body);
  }
}

class Obstacle extends GameObject{
  constructor(body){
    super(body);
    this.body.isSensor = false;
    add();
  }

}

class PowerUp extends GameObject{
  constructor(body){
    super(body);
    this.body.isSensor = true;
    add();
  }
}
