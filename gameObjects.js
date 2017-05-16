var Sleeping = Matter.Sleeping;

class GameObject{

	constructor(body, color){
		this.body = body;
		this.body.color = color;
		this.body.isFloating = true;
	}

	destroy(){
		World.remove(Game.engine.world, this.body);
		if(Game.obstacleBodies === Array)
			Game.obstacleBodies.splice(Game.obstacleBodies.indexOf(this.body), 1);
		this.body = null;
	}

	add(){
		World.add(Game.engine.world, this.body);
		if(Game.obstacleBodies === Array)
			Game.obstacleBodies.push(this.body);
	}
}

class Obstacle extends GameObject{
	constructor(body, color){
		super(body, color);
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
