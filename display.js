class Display {
	static init() {
		//create a canvas and context
		Display.canvas = document.createElement("canvas");
		
		Display.hazeBuffer = document.createElement("canvas");

		Display.resize();
		Display.view = {
			x: 0,
			y: 0
		};


		//Create the renderer
		Display.renderer = PIXI.autoDetectRenderer(Display.width, Display.height, {
			view: Display.canvas
		});

		//Create a container object called the "stage"
		Display.stage = new PIXI.Container();

		Starfield.init(2000);
		Display.stage.addChild(Starfield.gfx);

		Particle.init(400);
		Display.stage.addChild(Particle.gfx);
		//used to render physics objects (for now)
		Display.physicsGraphics = new PIXI.Graphics();
		Display.stage.addChild(Display.hazeSprite);
		Display.stage.addChild(Display.physicsGraphics);

		
		//add altimeter
		Display.altim = new PIXI.Text("[alt]",{fontFamily : 'monospace', fontSize: 28, fill : 0xFFFFFF, align : 'center'});
		Display.stage.addChild(Display.altim);

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

		var hc = Display.hazeBuffer.getContext("2d");
		Display.hazeBuffer.width = Display.width;
		Display.hazeBuffer.height = Display.height;
		var bigdim = Math.max(Display.width, Display.height);
		var grad = hc.createRadialGradient(
			Display.width/2, 
			Display.height*5/4, 
			bigdim * 0.1, 
			Display.width/2, 
			Display.height*5/4, 
			bigdim
		);
		grad.addColorStop(0.0, "#8A9AB5");
		grad.addColorStop(0.35, "#59546E");
		grad.addColorStop(0.60, "#322C42");
		grad.addColorStop(1.00, "#1F1710");
		hc.fillStyle = grad;
		hc.fillRect(0,0,Display.width,Display.height);

		Display.hazeSprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(Display.hazeBuffer));
		Display.hazeSprite.position = {x: 0, y: 0};
		Display.hazeSprite.blendMode = PIXI.blendModes.ADD;
		Display.hazeSprite.alpha = 0.9;
	}

	/**
	 * Displays the game.
	 */
	static frame() {
		Display.physicsGraphics.position.x = -Display.view.x;
		Display.physicsGraphics.position.y = -Display.view.y;

		var pgfx = Display.physicsGraphics;

		Starfield.update(16);
		Particle.update(16);

		//clear screen
		pgfx.clear();

		//altimeter update
		if (Game.rocket instanceof Rocket) {
			Display.altim.visible = true;
			Display.altim.position = {x: Display.width * 0.5 - Display.altim.width * 0.5, y: Display.height - 48};
			Display.altim.text=("alt: "+(Game.altitude().toFixed(1))+"m");
		}
		else {
			Display.altim.visible = false;
		}

		//iterate through all physics bodies
		var bodies = Composite.allBodies(Game.engine.world);
		var renderPart = function(part) {
			var vertices = part.vertices;

			//TODO: custom color per part
			pgfx.beginFill(part.color, 0.6);
			pgfx.lineStyle(1, part.color);

			//create polygon out of all vectors of this part
			pgfx.moveTo(vertices[vertices.length-1].x, vertices[vertices.length-1].y);
			for (var i=0; i<vertices.length; i++) {
				pgfx.lineTo(vertices[i].x, vertices[i].y);
			}
			pgfx.endFill();
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
