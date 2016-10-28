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
		Builder.typeSelected = Game.types[0];
		Builder.builderList = [];
		Builder.invList = [];
		Builder.initUI();
	}

	/**
	 * TODO: refactor
	 */
	static initUI() {
		Builder.inv = Builder.makeGrid(Builder.invWidth, Builder.invHeight);
		Builder.grid = Builder.makeGrid(Builder.gridWidth, Builder.gridHeight);

		Display.gridContainer = new PIXI.Container();
		Display.invContainer = new PIXI.Container();
		var invSquareSize = 32;
		var gridSquareSize = 40;
		var margin = 8;

		//making builder grid
	 	for (var x=0; x<Builder.gridWidth; x++) {
	 		for (var y=0; y<Builder.gridHeight; y++) {
	 			var g = new PIXI.Graphics();
	 			g.interactive = true;

	 			(function()
	 			{
	 				var o = g;
	 				var i = x;
	 				var j = y;

	 				Builder.builderList.push(o);

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

	 	//making inv grid
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

	 				Builder.invList.push(o);
	 				var handler = function() {
	 					o.tint = Game.types[j].color;
	 					Builder.typeSelected = Game.types[j]
	 					for (var uu=0; uu<Builder.invList.length; uu++) {
	 						var go = Builder.invList[uu];
	 						if (o !== go && Game.types[uu])
	 							go.tint = Game.types[uu].color;
	 					}
	 				};
	 				o.on('mousedown', handler);
	 				o.on('touchstart', handler);
	 				handler();

	 			})();

	 			g.beginFill(0xFFFFFF, 1);
	 			g.drawRect(x*gridSquareSize + x*margin, y*gridSquareSize + y*margin, gridSquareSize, gridSquareSize);
	 			g.endFill();
	 			g.tint = 0x676798;

	 			Display.invContainer.addChild(g);
	 		}
	 	}
		var bw = 140;
		var bh = 40;
		var marginX = 16;
		var marginY = 16;
		var y = (28-marginY)/bh;

	 	Display.invContainer.x = Display.width - Display.gridContainer.width - bw - marginX*2 - 64;
	 	Display.invContainer.y = Display.length + 30;
	 	Display.stage.addChild(Display.invContainer);
	 	Display.gridContainer.x = Display.width - Display.gridContainer.width - bw - marginX*2;
	 	Display.gridContainer.y = Display.length + 30;

	 	Display.stage.addChild(Display.gridContainer);

		//make a button for make_rocket()
		var makeRocket_button = new PIXI.Graphics();
		makeRocket_button.interactive = true;


		makeRocket_button.beginFill(0xff4d4d, 1);
		makeRocket_button.lineStyle(4, 0x9494b8, 1);
		makeRocket_button.drawRoundedRect(0, 0, bw, bh, 5);
		makeRocket_button.position = {x: Display.width-bw-marginX, y: (y++)*bh+y*marginY};
		makeRocket_button.endFill();
		makeRocket_button.on('mousedown', Builder.makeRocket);
		makeRocket_button.on('touchstart', Builder.makeRocket);
		makeRocket_button.on('mousedown', Builder.hide);
		makeRocket_button.on('touchstart', Builder.hide);

		var text = new PIXI.Text('launch',{fontFamily : 'monospace', fontSize: 24, fill : 0xFFFFFF, align : 'center'});
		text.position = {x: makeRocket_button.position.x+8, y: makeRocket_button.position.y+8};
		Display.stage.addChild(makeRocket_button);
		Display.stage.addChild(text);

		//make a button for show()
		var makeShow_button = new PIXI.Graphics();
		makeShow_button.interactive = true;
		makeShow_button.beginFill(0xffcc00,1);
		makeShow_button.lineStyle(4, 0xc2c2d6, 1);
		makeShow_button.drawRoundedRect(0, 0, bw, bh, 5);
		makeShow_button.position = {x: Display.width-bw-marginX, y: (y++)*bh+y*marginY};
		makeShow_button.endFill();
		makeShow_button.on('mousedown', Builder.show);
		makeShow_button.on('touchstart', Builder.show);

		var text = new PIXI.Text('build',{fontFamily : 'monospace', fontSize: 24, fill : 0xFFFFFF, align : 'center'});
		text.position = {x: makeShow_button.position.x+8, y: makeShow_button.position.y+8};
		Display.stage.addChild(makeShow_button);
		Display.stage.addChild(text);

		//make a button for hide()
		var makeHide_button = new PIXI.Graphics();
		makeHide_button.interactive = true;

		makeHide_button.beginFill(0x00b359,1);
		makeHide_button.lineStyle(4, 0xc2c2d6, 1);
		makeHide_button.drawRoundedRect(0, 0, bw, bh, 5);
		makeHide_button.position = {x: Display.width-bw-marginX, y: (y++)*bh+y*marginY};
		makeHide_button.endFill();
		makeHide_button.on('mousedown', Builder.hide);
		makeHide_button.on('touchstart', Builder.hide);

		var text = new PIXI.Text('close',{fontFamily : 'monospace', fontSize: 24, fill : 0xFFFFFF, align : 'center'});
		text.position = {x: makeHide_button.position.x+8, y: makeHide_button.position.y+8};
		Display.stage.addChild(makeHide_button);
		Display.stage.addChild(text);

		//make a button for code()
		var makeCode_button = new PIXI.Graphics();
		makeCode_button.interactive = true;

		makeCode_button.beginFill(0x3399ff,1);
		makeCode_button.lineStyle(4, 0xc2c2d6, 1);
		makeCode_button.drawRoundedRect(0, 0, bw, bh, 5);
		makeCode_button.position = {x: Display.width-bw-marginX, y: (y++)*bh+y*marginY};
		makeCode_button.endFill();
		makeCode_button.on('mousedown', Builder.hide);
		makeCode_button.on('touchstart', Builder.hide);
		makeCode_button.on('mousedown', Editor.show);
		makeCode_button.on('touchstart', Editor.show);

		var text = new PIXI.Text('program',{fontFamily : 'monospace', fontSize: 24, fill : 0xFFFFFF, align : 'center'});
		text.position = {x: makeCode_button.position.x+8, y: makeCode_button.position.y+8};
		Display.stage.addChild(makeCode_button);
		Display.stage.addChild(text);

		//make a button for reset()
		var reset_button = new PIXI.Graphics();
		reset_button.interactive = true;
		reset_button.beginFill(0xaa80ff,1);
		reset_button.lineStyle(4, 0xc2c2d6, 1);
		reset_button.drawRoundedRect(0, 0, bw, bh, 5);
		reset_button.position = {x: Display.width-bw-marginX, y: (y++)*bh+y*marginY};
		reset_button.endFill();
		reset_button.on('mousedown', Builder.reset);
		reset_button.on('touchstart', Builder.reset);

		var text = new PIXI.Text('reset',{fontFamily : 'monospace', fontSize: 24, fill : 0xFFFFFF, align : 'center'});
		text.position = {x: reset_button.position.x+8, y: reset_button.position.y+8};
		Display.stage.addChild(reset_button);
		Display.stage.addChild(text);

		Builder.hide();
	}

	/**
	 * Display the builder interface
	 */
	static show() {
		Display.gridContainer.visible = true;
		Display.invContainer.visible = true;
		Editor.hide();
		Game.state = BUILD;
	}

	/**
	 * Hide the builder interface
	 */
	static hide() {
		Display.gridContainer.visible = false;
		Display.invContainer.visible = false;
	}
	/**
	 * Reset the selected grids
	 */
	 static reset(){
	 	Builder.builder_grid();
	 	Builder.inv_grid();
	 	Builder.typeSelected = Game.types[0];
	 	Game.reset();
	 }

	 static builder_grid()
	 {
	 	for(var k = 0; k<Builder.builderList.length; k++)
	 	{
	 		Builder.builderList[k].tint = 0x222222;
	 	}

	 	Builder.grid = Builder.makeGrid(Builder.gridWidth, Builder.gridHeight);
	 }

	 static inv_grid()
	 {
	 	for(var k = 0; k<Builder.invList.length; k++)
	 	{
	 		Builder.invList[k].tint = 0x676798;
	 	}

	 	Builder.inv = Builder.makeGrid(Builder.invWidth, Builder.invHeight);
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
	static typeClicked(x, y) {

		Builder.inv[x][y] = Builder.typeSelected;
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

	static reset_gridCellClicked(x, y) {
		//handles click first?
		//click
		Builder.grid[x][y] =  null;

	}

	/**
	 * When the user is done designing rocket,
	 * Create a physics object for each non-null grid cell.
	 * Physically link adjacent objects.
	 * Create composite.
	 * Add composite to game world.
	 */
	static makeRocket() {

		var empty = true;
		var SIDE_LENGTH = 25;
		var rocket = new Rocket();
		var temp = Builder.makeGrid(Builder.gridWidth, Builder.gridHeight);
		//initialize parts != null with body and type
		var list = [];
		for (var x=0; x<Builder.gridWidth; x++){
			for (var y=0; y<Builder.gridHeight; y++){
				if(Builder.grid[x][y] !== null){	//if partType != null
					empty = false;
					var obj = Bodies.rectangle(SIDE_LENGTH*x, SIDE_LENGTH*y,
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
		if(empty)
			return;
		var combined = Body.create({
			parts: list
		});
		combined.color = 0x555555;
		var width = combined.bounds.max.x - combined.bounds.min.x;
		var height = combined.bounds.max.y - combined.bounds.min.y;
		Body.translate(combined, Vector.create(-Builder.gridWidth/2*SIDE_LENGTH, -Builder.gridHeight*SIDE_LENGTH));
		World.add(Game.engine.world, combined);
		rocket.mainBody = combined;
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
