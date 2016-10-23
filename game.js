// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector,
    Body = Matter.Body;

var GAME_FPS = 60;
var PLAY = 0,
    BUILD = 1,
    CODE = 2;

class Game {
	static init() {
		//initialize rendering
		Display.init();
		Builder.init();
    	Editor.init();
		Builder.hide();

    	Game.state = PLAY;
		//create physics engine
		Game.engine = Engine.create();
		Game.rocket = null;

		//create physics bodies here
		var ground = Bodies.rectangle(400, 600, 1600, 60, { isStatic: true });
		ground.color = 0xFFFFFF;
    var obstacle = new Obstacle(Bodies.rectangle(200, 200, 50, 50));
    obstacle.body.color = 0xFFFFFF;

		//add physics bodies to world
		World.add(Game.engine.world, [ground]);

		//start game loop
		var t0 = Date.now();
		requestAnimationFrame(function gameLoop(){
			var delta = (Date.now() - t0);
			if (delta > 1000)
				return;
			Game.update(delta/(1000/GAME_FPS));
			t0 = Date.now();
			requestAnimationFrame(gameLoop);
		});
	}

	/**
	 * Loads resources and then calls callback.
	 */
	static loadData(callback) {
		Util.load.json("data.json", function success(data){
			Object.keys(data).forEach(function(key){
				Game[key] = data[key];
			});
			callback(true);
		}, function fail(){
			alert("Failed to load data.");
			callback(false);
		});
	}

	static update(timeDelta) {
		//update rocket
		if (Game.rocket instanceof Rocket) {
			Game.rocket.update(timeDelta);
			var aabb = Game.rocket.mainBody.bounds;
			var midX = (aabb.max.x + aabb.min.x) / 2;
			var midY = (aabb.max.y + aabb.min.y) / 2;
			Display.view.x = midX - Display.width / 2;
			Display.view.y = midY - Display.height / 2;
		}
		else {
			Display.view.x = 0;
			Display.view.y = 0;
		}

		//step physics
		Engine.update(Game.engine);

		//draw
		Display.frame();
	}
}

function createArray(w, h, val) {
	var arr = [];

	for (var x = 0; x<w; x++)
	{
		arr[x] = [];
		for(var y = 0; y<h; y++)
		{
			arr[x][y] = val;
		}
	}
	return arr;
}

//start game when resources have loaded
window.addEventListener("load", function(){
  Game.loadData(function(){
    Game.init();
  });
}, false);
