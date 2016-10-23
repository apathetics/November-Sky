var Sleeping = Matter.Sleeping;

class GameObject{
  constructor(body){
    this.body = body;
    this.body.isFloating = true;
    console.log(this.body.isFloating);
  }

  destroy(){
    World.remove(Game.engine.world, this.body);
    this.body = null;
  }

  add(){
    console.log(this.body.position);
    World.add(Game.engine.world, this.body);
  }
}

class Obstacle extends GameObject{
  constructor(body){
    super(body);
    console.log(this.body.isFloating);
    this.body.isSensor = false;
    this.add();
  }

}

class PowerUp extends GameObject{
  constructor(body){
    super(body);
    this.body.isSensor = true;
    this.add();
  }
}
