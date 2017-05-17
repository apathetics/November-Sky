// module aliases
var Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Composite = Matter.Composite,
	Constraint = Matter.Constraint,
	Bodies = Matter.Bodies,
	Vector = Matter.Vector,
	Vertices = Matter.Vertices,
	Body = Matter.Body;

const GAME_FPS = 60;
const PLAY = 0,
	BUILD = 1,
	CODE = 2,
	LOSE = 3;

const PLATFORM_HEIGHT = 8.2;

class Game {
	static init() {
		Game.SIDE_LENGTH = 25;
		Game.wallRadius = 500;
		Game.wallHeight = 5000;
		Game.NUM_ASTEROIDS = 40;
		Game.input = {
			keys: []
		};
		Game.KEY = {
			LEFT: 37,
			RIGHT: 39,
			UP: 38,
			DOWN: 40
		};
		Object.seal(Game.KEY);
		
		//convert shape vertices to Vectors
		Object.keys(Game.shapes).forEach(function(shape){
			var i = 0;
			Game.shapes[shape].forEach(function(vertex){
				Game.shapes[shape][i++] = Vector.create(
					vertex[0] * Game.SIDE_LENGTH,
					vertex[1] * Game.SIDE_LENGTH
				);
			});
		});

		//initialize
		Display.init();
		Editor.init();
		Builder.hide();

		//create physics engine
		Game.engine = Engine.create();
		Game.reset();

		//add some input listeners
		document.addEventListener("keydown", function(event){
			Game.input.keys[event.keyCode] = true;
		}, false);
		document.addEventListener("keyup", function(event){
			Game.input.keys[event.keyCode] = false;
		}, false);

		//start game loop
		var t0 = Date.now();
		requestAnimationFrame(function gameLoop(){
			var delta = (Date.now() - t0);
			delta = Math.min(500, delta);
			Game.update(delta/(1000/GAME_FPS));
			t0 = Date.now();
			requestAnimationFrame(gameLoop);
		});
	}

	static reset() {
		Game.state = PLAY;
		Game.rocket = null;

		World.clear(Game.engine.world);

		Game.black = 0x000000;
		Game.INVISIBLE = -1;
		//create physics bodies here
		var ground = Bodies.rectangle(0, 30, 1500, 200, { isStatic: true });
		ground.color = Game.black;

		var staticBodyArray = [ground];

	    //obstacles
	    Game.obstacles = [];
	    Game.obstacleBodies = [];

		//add physics bodies to world
		World.add(Game.engine.world, staticBodyArray);
	}

	static altitude() {
		if (Game.rocket instanceof Rocket)
			return (-Game.rocket.mainBody.position.y * 0.1) - PLATFORM_HEIGHT;
	}

	static distance(){
		if (Game.rocket instanceof Rocket)
			return Game.rocket.mainBody.position.x / Game.wallRadius;
	}

	static updateObstacles(){
		var playerPos = Game.rocket.mainBody.position;
		Game.obstacles.forEach(function(obj, index) {
			if(Math.abs(obj.body.position.y - playerPos.y) > 2 * Display.height ||
				obj.body.position.x - playerPos.x > 1.5 * Display.width)
			{
				obj.destroy();
				Game.obstacleBodies.splice(Game.obstacleBodies.indexOf(obj.body), 1);
				Game.obstacles.splice(index, 1);
			}
		})
		this.fillObstacles();
	}

	static fillObstacles(){
		var playerPos = Game.rocket.mainBody.position;
		while(Game.obstacles.length < Game.NUM_ASTEROIDS){
      		//x between -width to width
      		var tempX = playerPos.x - (2 * Display.width) + (Math.random() * 4 * Display.width);
      		//y between height and height*2
      		var tempY = playerPos.y - Display.height - (Math.random() * 4 * Display.height);
      		//radius between 25 and 50
      		var tempR = 25 + (Math.random() * 25);

      		var circleBody = Bodies.circle(tempX,tempY,tempR);
      		var newCircle = new Obstacle(circleBody, Game.white);

      		Body.setDensity(circleBody, .002); //set density to 2 default
      		var vel = { x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 };
      		Body.setVelocity(circleBody, vel);

      		Game.obstacleBodies.push(circleBody);
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
			var focusX = Game.rocket.mainBody.position.x;
			var focusY = Game.rocket.mainBody.position.y;
			Display.view.x = focusX - Display.width / 2;
			Display.view.y = focusY - Display.height / 2;
			Game.updateObstacles();
		}
		else {
			Display.view.x = -Display.width/2;
			Display.view.y = -Display.height+50;
		}

		//step physics
		Engine.update(Game.engine);

		//draw
		Display.frame();
	}
}

function createArray(w, h, val) {
	var arr = [];
	for (var x = 0; x<w; x++) {
		arr[x] = [];
		for(var y = 0; y<h; y++) {
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
