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
		Builder.init();
		Builder.hide();

		//create physics engine
		Game.engine = Engine.create();
		
		//create physics bodies here
		var testBox = Bodies.rectangle(100, 100, 64, 64);
		var testBox2 = Bodies.rectangle(180, 120, 64, 64);
		var testPair = Matter.Body.create({
			parts: [testBox, testBox2],
			isStatic: false
		});
		var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

		//add physics bodies to world
		World.add(Game.engine.world, [testPair, ground]);
		
		//start game loop
		var t0 = Date.now();
		requestAnimationFrame(function gameLoop(){
			var delta = (Date.now() - t0);
			Game.update(delta);
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
		//step physics
		Engine.update(Game.engine, timeDelta);

		//draw
		Display.frame();
	}
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

//start game when resources have loaded
window.addEventListener("load", function(){
	Game.loadData(function(){
		Game.init();
	});
}, false);