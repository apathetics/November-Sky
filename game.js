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


    Game.white = 0xFFFFFF;
		//create physics bodies here
		var ground = Bodies.rectangle(Display.width-700, Display.length+781, 1500, 60, { isStatic: true });
    var leftWall = Bodies.rectangle(Display.width-1419, Display.length+250, 40, 1000, { isStatic: true });
    var rightWall = Bodies.rectangle(Display.width-21, Display.length+250, 40, 1000, { isStatic: true });
    var staticBodyArray = [ground, leftWall, rightWall];
    staticBodyArray.forEach(function(body){
      body.color = Game.white;
    });

    //obstacles
    Game.obstacles = [new Obstacle(Bodies.circle(250, 100, 30), Game.white),
                      new Obstacle(Bodies.circle(600, 150, 30), Game.white),
                      new Obstacle(Bodies.circle(950, 75, 30), Game.white)];

		//add physics bodies to world
		World.add(Game.engine.world, staticBodyArray);

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

  static updateObstacles(){
    var playerPos = Game.rocket.mainBody.position;
    Game.obstacles.forEach(function(obj) {
      if(obj.body.position.y - playerPos.y > Display.height){
        obj.destroy();
        Game.obstacles.splice(Game.obstacles.indexOf(obj), 1);
      }
    })
    while(Game.obstacles.length < 5){
      //between 100 and 1100
      var tempX = 100 + (Math.random()*1000);
      //between y-500 and y-1500
      var tempY = playerPos.y - 500 - (Math.random()*1000);
      //between 20 and 50
      var tempR = 20+(Math.random()*30);
      var newCircle = new Obstacle(Bodies.circle(tempX,tempY,tempR), Game.white);
      Body.setDensity(newCircle, .002); //set density to 2* default
      Game.obstacles.push(newCircle);
    }
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
      Game.updateObstacles();
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
