class Display {
	static init() {
		//create a canvas and context
		Display.canvas = document.createElement("canvas");
		Display.resize();
		Display.ctx = Display.canvas.getContext("2d");

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
		var ctx = Display.ctx;

		//clear screen
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,Display.width,Display.height);

		//iterate through all physics bodies
		var bodies = Composite.allBodies(Game.engine.world);
		bodies.forEach(function(body) {
			var vertices = body.vertices;
			
			ctx.save();
			ctx.fillStyle = "red";

			//create polygon out of all vectors of this body
			ctx.beginPath();
			ctx.moveTo(vertices[0].x, vertices[0].y);
			for (let i=1; i<vertices.length; i++) {
				ctx.lineTo(vertices[i].x, vertices[i].y);
			}
			ctx.fill();

			ctx.restore();
		});
	}
}