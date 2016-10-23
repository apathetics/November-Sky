var Sleeping = Matter.Sleeping;

class GameObject{
  constructor(body, color){
    this.body = body;
    this.body.color = color;
    this.body.isFloating = true;
    // console.log(this.body.color);
  }

  destroy(){
    World.remove(Game.engine.world, this.body);
    this.body = null;
  }

  add(){
    // console.log(this.body.position);
    World.add(Game.engine.world, this.body);
  }
}

class Obstacle extends GameObject{
  constructor(body, color){
    super(body, color);
    // console.log(this.body.isFloating);
    this.body.isSensor = false;
    this.add();
  }

}

class PowerUp extends GameObject{
  constructor(body, color){
    super(body, color);
    this.body.isSensor = true;
    this.add();
  }
}
