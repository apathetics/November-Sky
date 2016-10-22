// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies;

class Game {
	static init() {
		//initialize rendering
		Display.init();

		//create physics engine
		Game.engine = Engine.create();
		
		//create physics bodies here
		var testBox = Bodies.rectangle(100, 100, 64, 64);
		var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

		//add physics bodies to world
		World.add(Game.engine.world, [testBox, ground]);
		
		//start game loop
		var t0 = Date.now();
		requestAnimationFrame(function gameLoop(){
			var delta = (Date.now() - t0);
			Game.update(delta);
			t0 = Date.now();
			requestAnimationFrame(gameLoop);
		});
	}

	static update(timeDelta) {
		//step physics
		Engine.update(Game.engine, timeDelta);

		//draw
		Display.frame();
	}
}

//start game when resources have loaded
window.addEventListener("load", Game.init, false);