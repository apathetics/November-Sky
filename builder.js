var Constraint = Matter.Constraint;

class Builder {
	/**
	 * Create pixi Container for builder interface.
	 * Create empty grid array
	 * Create grid cells and make clickable
	 */
	static init() {
		Builder.gridWidth = 8;
		Builder.gridHeight = 8;
		Builder.invWidth = 1;
		Builder.invHeight = 6;
		Builder.inv = Builder.makeGrid(Builder.invWidth, Builder.invHeight);
		Builder.grid = Builder.makeGrid(Builder.gridWidth, Builder.gridHeight);
		Builder.typeSelected = Game.types[0];

		Display.gridContainer = new PIXI.Container();
		Display.invContainer = new PIXI.Container();
		var invSquareSize = 32;
		var gridSquareSize = 64;
		var margin = 8;

		//make the inventory grid
		for (var x=0; x<Builder.gridWidth; x++) {
			for (var y=0; y<Builder.gridHeight; y++) {
				var g = new PIXI.Graphics();
				g.interactive = true;

				(function()
				{
					var o = g;
					var i = x;
					var j = y;
					o.on('mousedown', function()
					{
						o.tint = Builder.typeSelected.color;
						Builder.gridCellClicked(i, j);

					});
					o.on('touchstart', function()
					{
						o.tint = Builder.typeSelected.color;
						Builder.gridCellClicked(i, j);
					});

				})();

				g.beginFill(0xFFFFFF, 1);
				g.drawRect(x*gridSquareSize + x*margin, y*gridSquareSize + y*margin, gridSquareSize, gridSquareSize);
				g.endFill();
				g.tint = 0x222222;


				Display.gridContainer.addChild(g);
			}
		}

		Display.gridContainer.x = 800;

		Display.stage.addChild(Display.gridContainer);

		//making the parts inventory grid
		for (var x=0; x<Builder.invWidth; x++) 
		{
			for (var y=0; y<Builder.invHeight; y++) 
			{
				var g = new PIXI.Graphics();
				g.interactive = true;

				(function()
				{
					var o = g;
					var i = x;
					var j = y;

					o.on('mousedown', function()
					{
						o.tint = 0xFFFFFF;

					});
					o.on('touchstart', function()
					{	
						o.tint = 0xFFFFFF;
					});

				})();

				g.beginFill(0xFFFFFF, 1);
				g.drawRect(x*gridSquareSize + x*margin, y*gridSquareSize + y*margin, gridSquareSize, gridSquareSize);
				g.endFill();
				g.tint = 0x0000FF;

				Display.invContainer.addChild(g);
			}
		}

		Display.stage.addChild(Display.invContainer);

		//make a button for make_rocket()
		var makeRocket_button = new PIXI.Graphics();
		makeRocket_button.interactive = true;

		makeRocket_button.beginFill(0xFF3300,1);
		makeRocket_button.lineStyle(4, 0xffd900, 1);
		makeRocket_button.drawCircle(500, 100, 60);
		makeRocket_button.endFill();
		makeRocket_button.on('mousedown', Builder.makeRocket);
		makeRocket_button.on('touchstart', Builder.makeRocket);
		makeRocket_button.on('mousedown', Builder.hide);
		makeRocket_button.on('touchstart', Builder.hide);
		Display.stage.addChild(makeRocket_button);

		//make a button for show()
		var makeShow_button = new PIXI.Graphics();
		makeShow_button.interactive = true;

		makeShow_button.beginFill(0x3399ff,1);
		makeShow_button.lineStyle(4, 0xffd900, 1);
		makeShow_button.drawCircle(600, 200, 60);
		makeShow_button.endFill();
		makeShow_button.on('mousedown', Builder.show);
		makeShow_button.on('touchstart', Builder.show);
		Display.stage.addChild(makeShow_button);

		//make a button for hide()
		var makeHide_button = new PIXI.Graphics();
		makeHide_button.interactive = true;

		makeHide_button.beginFill(0xcc99ff,1);
		makeHide_button.lineStyle(4, 0xffd900, 1);
		makeHide_button.drawCircle(700, 300, 60);
		makeHide_button.endFill();
		makeHide_button.on('mousedown', Builder.hide);
		makeHide_button.on('touchstart', Builder.hide);
		Display.stage.addChild(makeHide_button);

		//make a button for code()
		var makeCode_button = new PIXI.Graphics();
		makeCode_button.interactive = true;

		makeCode_button.beginFill(0xFfde33,1);
		makeCode_button.lineStyle(4, 0xffd900, 1);
		makeCode_button.drawCircle(800, 400, 60);
		makeCode_button.endFill();
		makeCode_button.on('mousedown', Builder.hide);
		makeCode_button.on('touchstart', Builder.hide);
		makeCode_button.on('mousedown', Editor.show);
		makeCode_button.on('touchstart', Editor.show);

		Display.stage.addChild(makeCode_button);


	}

	/**
	 * Display the builder interface
	 */
	static show() {
		Display.gridContainer.visible = true;
		Game.state = BUILD;
	}

	/**
	 * Hide the builder interface
	 */
	static hide() {
		Display.gridContainer.visible = false;
	}

	/**
	 * Returns 2D array initialized to null.
	 * @param w width
	 * @param h height
	 */
	static makeGrid(w, h) {

		return createArray(w, h, null);
	}


	/**
	 * Handles a click on a part type in the inventory.
	 * Set currently selected type.
	 */
	static typeClicked(type) {


	}

	/**
	 * Handles a click on a grid cell
	 * Assign to grid cell at x,y the selected type.
	 * Update displayed sprite for that position.
	 */
	static gridCellClicked(x, y) {
		//handles click first?
		//click
		Builder.grid[x][y] =  Builder.typeSelected;

	}

	/**
	 * When the user is done designing rocket,
	 * Create a physics object for each non-null grid cell.
	 * Physically link adjacent objects.
	 * Create composite.
	 * Add composite to game world.
	 */
	static makeRocket() {
		var SIDE_LENGTH = 25;
		var rocket = new Rocket();
		var temp = Builder.makeGrid(Builder.gridWidth, Builder.gridHeight);
		//initialize parts != null with body and type
		var list = [];
		for (var x=0; x<Builder.gridWidth; x++){
			for (var y=0; y<Builder.gridHeight; y++){
				if(Builder.grid[x][y] !== null){	//if partType != null
					var obj = Bodies.rectangle(SIDE_LENGTH*x+500, SIDE_LENGTH*y+100,
						SIDE_LENGTH, SIDE_LENGTH);
					obj.color = parseInt(Builder.grid[x][y].color, 16);
					list.push(obj);
					var part = new Part(obj, Builder.grid[x][y]);
					temp[x][y] = obj;
					rocket.add(part);
					// World.add(Game.engine.world, obj); //add obj to the world
				}
			}
		}
		var combined = Body.create({
			parts: list
		});
		combined.color = 0xFFFF00;
		World.add(Game.engine.world, combined);
		//check for other blocks, constrain if != null
		// for(var x = 0; x < temp.length-1; x++){
		// 	for(var y = 0; y < temp[0].length-1; y++){
		// 		if(temp[x][y] == null)
		// 			continue;
		// 		if(temp[x+1][y] !== null) {		//check right
		// 			Builder.constrain(temp[x][y], temp[x+1][y], Vector.create(-SIDE_LENGTH/2,-SIDE_LENGTH/2));
		// 			Builder.constrain(temp[x][y], temp[x+1][y], Vector.create(SIDE_LENGTH/2,SIDE_LENGTH/2));
		// 			Builder.constrain(temp[x][y], temp[x+1][y], Vector.create(-SIDE_LENGTH/2,SIDE_LENGTH/2));
		// 			Builder.constrain(temp[x][y], temp[x+1][y], Vector.create(SIDE_LENGTH/2,-SIDE_LENGTH/2));
		// 		}
		// 		if(temp[x][y+1] !== null) {		//check down
		// 			Builder.constrain(temp[x][y], temp[x][y+1], Vector.create(-SIDE_LENGTH/2,-SIDE_LENGTH/2));
		// 			Builder.constrain(temp[x][y], temp[x][y+1], Vector.create(SIDE_LENGTH/2,SIDE_LENGTH/2));
		// 			Builder.constrain(temp[x][y], temp[x][y+1], Vector.create(-SIDE_LENGTH/2,SIDE_LENGTH/2));
		// 			Builder.constrain(temp[x][y], temp[x][y+1], Vector.create(SIDE_LENGTH/2,-SIDE_LENGTH/2));
		// 		}
		// 	}
		// }

		Game.rocket = rocket; //make rocket global
	}

	static constrain(body1, body2, offset){
		console.log("something");
		var newConstraint = Constraint.create({
			bodyA: body1,
			positionA: offset,
			bodyB: body2,
			positionB: offset
		});
		World.add(Game.engine.world, newConstraint);
	}

}
