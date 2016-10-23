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
		var renderPart = function(part) {
			var vertices = part.vertices;
			
			//TODO: custom color per part
			// pgfx.beginFill(0xFF0000, 1);
			pgfx.lineStyle(2, part.color);

			//create polygon out of all vectors of this part
			pgfx.moveTo(vertices[vertices.length-1].x, vertices[vertices.length-1].y);
			for (var i=0; i<vertices.length; i++) {
				pgfx.lineTo(vertices[i].x, vertices[i].y);
			}
			// pgfx.endFill();
		}
		bodies.forEach(function(body) {
			if (body.parts.length > 1) {
				body.parts.forEach(function(part){
					renderPart(part);
				})
			}
			else
				renderPart(body.parts[0]);
		});

		var constraints = Composite.allConstraints(Game.engine.world);
		constraints.forEach(function(constraint) {
			//TODO: custom color per constraint
			// pgfx.beginFill(0xFF0000, 1);
			pgfx.lineStyle(2, 0x00FF00);

			//create polygon out of all vectors of this constraint
			pgfx.moveTo(constraint.bodyA.position.x, constraint.bodyA.position.y);
			pgfx.lineTo(constraint.bodyB.position.x, constraint.bodyB.position.y);
			
			// pgfx.endFill();
		});

		Display.renderer.render(Display.stage);
	}
}