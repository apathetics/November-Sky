// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies
    Vector = Matter.Vector
    Body = Matter.Body;

class Game {
	static init() {
		//initialize rendering
		Display.init();
		Builder.init();
		Builder.hide();

		//create physics engine
		Game.engine = Engine.create();

		//create physics bodies here
		var testBox1 = Bodies.rectangle(100, 100, 50, 50);
    var testBox2 = Bodies.rectangle(150, 100, 50, 50);
    var testBox3 = Bodies.rectangle(100, 50, 50, 50);
    var testBox4 = Bodies.rectangle(150, 50, 50, 50);
    var testBox5 = Bodies.rectangle(125, 200, 50, 50);
    var bodyArray = [testBox1,testBox2,testBox3,testBox4,testBox5];
    /*Game.testBody = Body.create({
      parts : [testBox1, testBox2, testBox3, testBox4, testBox5],
      isStatic: false
    });*/
    var constraintArray = [];
    for(var i = 0; i < bodyArray.length; i++){
      for(var j = i; j >= 0; j--){
        constraintArray.push(Constraint.create({
          bodyA : bodyArray[i],
          bodyB : bodyArray[j],
          pointA : Vector.create(0,0),
          pointB : Vector.create(0,0)
        }));
      }
    }
    var testComposite = Composite.create({
      bodies : [testBox1, testBox2, testBox3, testBox4, testBox5],
      constraints : constraintArray
    });
    /*[Constraint.create({ bodyA : testBox1, bodyB : testBox2}),
                   Constraint.create({ bodyA : testBox2, bodyB : testBox4}),
                   Constraint.create({ bodyA : testBox3, bodyB : testBox4}),
                   Constraint.create({ bodyA : testBox1, bodyB : testBox3})]*/

    /*setTimeout(function(){
      Body.applyForce(testBody, Vector.add(testBody.position, Vector.create(0,-1)), Vector.create(.25,-.5));
    }, 1500);*/
		var ground = Bodies.rectangle(400, 600, 1600, 60, { isStatic: true });

		//add physics bodies to world
		World.add(Game.engine.world, [testComposite, ground]);

		//start game loop
		var t0 = Date.now();
		requestAnimationFrame(function gameLoop(){
			var delta = (Date.now() - t0);
			if (delta > 1000)
				return;
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
window.addEventListener('keydown', function(event){
  if(event.keyCode == 32)
    Body.applyForce(Game.testBody, Vector.add(Game.testBody.position, Vector.create(0, 1)), Vector.create(0, -0.5));

    if(event.keyCode == 37)
      Body.rotate(Game.testBody, -.1);

    if(event.keyCode == 39)
      Body.rotate(Game.testBody, .1);
});
