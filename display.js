class Display {
	static init() {
		//create a canvas and context
		Display.canvas = document.createElement("canvas");
		Display.resize();
		
		//Create the renderer
		Display.renderer = PIXI.autoDetectRenderer(Display.width, Display.height, {
			view: Display.canvas
		});

		//Create a container object called the "stage"
		Display.stage = new PIXI.Container();

		//used to render physics objects (for now)
		Display.physicsGraphics = new PIXI.Graphics();
		Display.stage.addChild(Display.physicsGraphics);

		//add canvas to the document
		document.getElementById("container").appendChild(Display.canvas);

		//watch for resize
		window.addEventListener("resize", Display.resize, false);
	}

	/**
	 * Handles a window resize and changes the size of the canvas.
	 */
	static resize() {
		Display.width = window.innerWidth;
		Display.height = window.innerHeight;
		Display.canvas.width = Display.width;
		Display.canvas.height = Display.height;
	}

	/**
	 * Displays the game.
	 */
	static frame() {
		var pgfx = Display.physicsGraphics;

		//clear screen
		pgfx.clear();

		//iterate through all physics bodies
		var bodies = Composite.allBodies(Game.engine.world);
		bodies.forEach(function(body) {
			var vertices = body.vertices;
			
			//TODO: custom color per body
			pgfx.beginFill(0xFF0000, 1);

			//create polygon out of all vectors of this body
			pgfx.moveTo(vertices[0].x, vertices[0].y);
			for (var i=1; i<vertices.length; i++) {
				pgfx.lineTo(vertices[i].x, vertices[i].y);
			}
			pgfx.endFill();
		});

		Display.renderer.render(Display.stage);
	}
}