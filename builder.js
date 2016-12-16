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
		Builder.buttonWidth = 140;
		Builder.buttonHeight = 40;
		Builder.marginX = 16;
		Builder.marginY = 16;
		Builder.gridSquareSize = 40;
		Builder.gridMargin = 8;
		Builder.invWidth = 1;
		Builder.invHeight = Game.types.length;
		Builder.TYPE_NONE = Game.types[0];
		Builder.typeSelected = Builder.TYPE_NONE;
		Builder.builderList = [];
		Builder.invList = [];
		Builder.gridGfxList = [];

		Builder.buttonData = [
			{
				label: "launch",
				color: 0xff4d4d,
				action: function(){
					Builder.makeRocket();
					Builder.hide();
				}
			},
			{
				label: "build",
				color: 0xffcc00,
				action: function(){
					Builder.show();
				}
			},
			{
				label: "hide",
				color: 0x00b359,
				action: function(){
					Builder.hide();
				}
			},
			{
				label: "program",
				color: 0x3399ff,
				action: function(){
					Builder.hide();
					Editor.show();
				}
			},
			{
				label: "reset",
				color: 0xaa80ff,
				action: function(){
					Builder.reset();
				}
			}
		];
	}

	static makeCell(x, y, action, container, list) {
		var g = new PIXI.Graphics();
		g.interactive = true;
		g.redrawIcon = function(shape, color) {
			g.clear();
			g.beginFill(color, 1);
			Builder.drawShape(
				g, shape,
				x*Builder.gridSquareSize + (x+0.5)*Builder.gridMargin,
				y*Builder.gridSquareSize + (y+0.5)*Builder.gridMargin,
				Builder.gridSquareSize,
				Builder.gridSquareSize
			);
			g.endFill();
		};

		action = action.bind(this, g, x, y);
		g.on("mousedown", action);
		g.on("touchstart", action);
		action();
		g.action = action;

		var back = new PIXI.Graphics();
		back.beginFill(0xFFFFFF, 0.4);
		back.lineStyle(1, 0xFFFFFF);
		back.drawRect(
			x*(Builder.gridSquareSize + Builder.gridMargin),
			y*(Builder.gridSquareSize + Builder.gridMargin),
			Builder.gridSquareSize + Builder.gridMargin - 1,
			Builder.gridSquareSize + Builder.gridMargin - 1
		);
		back.endFill();
		back.tint = 0x101010;

		container.addChild(back);
		container.addChild(g);
		list.push(g);
		return g;
	}

	/**
	 * TODO: refactor
	 */
	static initUI() {
		Builder.inv = Builder.makeGrid(Builder.invWidth, Builder.invHeight);
		Builder.grid = Builder.makeGrid(Builder.gridWidth, Builder.gridHeight);

		Display.gridContainer = new PIXI.Container();
		Display.invContainer = new PIXI.Container();

		//make builder grid
		var uid = 0;
		var gridHandler = function(gfx, x, y, shape, color) {
			gfx.redrawIcon(shape, color);
			Builder.gridCellClicked(x,y);
		};
		for (var y=0; y<Builder.gridHeight; y++) {
	 		for (var x=0; x<Builder.gridWidth; x++) {
	 			var handler = function(gfx, x, y){
	 				gridHandler(gfx, x, y, Builder.typeSelected.shape, Builder.typeSelected.color);
	 			};
	 			var cell = Builder.makeCell(x, y, handler, Display.gridContainer, Builder.gridGfxList);
	 		}
	 	}

	 	//make inventory grid
	 	var invHandler = function(idx) {
	 		Builder.typeSelected = Game.types[idx];
	 	}
	 	for (var i=0; i<Game.types.length; i++) {
	 		var y = i%Builder.gridHeight;
	 		var x = Math.floor(i/Builder.gridHeight);
	 		var cell = Builder.makeCell(
	 			x, y,
	 			invHandler.bind(this, i), 
	 			Display.invContainer, Builder.invList
	 		);
	 		cell.redrawIcon(Game.types[i].shape, parseInt(Game.types[i].color, 16));
	 	}

	 	Display.invContainer.x = Display.width - Display.gridContainer.width - Builder.buttonWidth - Builder.marginX*2 - 64;
	 	Display.invContainer.y = Display.length + 30;
	 	Display.stage.addChild(Display.invContainer);
	 	Display.gridContainer.x = Display.width - Display.gridContainer.width - Builder.buttonWidth - Builder.marginX*2;
	 	Display.gridContainer.y = Display.length + 30;

	 	Display.stage.addChild(Display.gridContainer);
		Builder.initMenu();
		Builder.resetGrid();
		Builder.hide();
	}

	static initMenu() {
		var y = (28-Builder.marginY)/Builder.buttonHeight;

		Builder.buttonData.forEach(function(item){
			var button = new PIXI.Graphics();
			button.interactive = true;

			//create button
			button.beginFill(item.color, 0.5);
			button.lineStyle(1, item.color, 1);
			button.drawRoundedRect(0, 0, Builder.buttonWidth, Builder.buttonHeight, 5);
			button.position = {
				x: Display.width-Builder.buttonWidth-Builder.marginX,
				y: (y++)*Builder.buttonHeight+y*Builder.marginY
			};
			button.endFill();
			button.on('mousedown', item.action);
			button.on('touchstart', item.action);

			//create label
			var text = new PIXI.Text(item.label, {
				fontFamily : 'monospace',
				fontSize: 24,
				fill : 0xFFFFFF,
				align : 'center'
			});
			text.position = {x: button.position.x+8, y: button.position.y+8};
			Display.stage.addChild(button);
			Display.stage.addChild(text);
		});
	}

	static drawShape(graphics, shape, x, y, w, h) {
		var vertices = Game.shapes[shape];
		for (var i=0; i<vertices.length; i++) {
			var vertex = vertices[i];
			if (i===0)
				graphics.moveTo(
					vertex.x * (w/Game.SIDE_LENGTH) + x,
					vertex.y * (h/Game.SIDE_LENGTH) + y
				);
			else
				graphics.lineTo(
					vertex.x * (w/Game.SIDE_LENGTH) + x,
					vertex.y * (h/Game.SIDE_LENGTH) + y
				);
		}
		graphics.hitArea = new PIXI.Rectangle(x,y,w,h);
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
	 	Builder.resetGrid();
	 	Builder.typeSelected = Game.types[0];
	 	Game.reset();
	 }

	 static resetGrid() {
	 	Builder.typeSelected = Builder.TYPE_NONE;
	 	Builder.gridGfxList.forEach(function(gfx){
	 		gfx.action();
	 	});
	 	Builder.grid = Builder.makeGrid(Builder.gridWidth, Builder.gridHeight);
	 }

	/**
	 * Returns 2D array initialized to null.
	 * @param w width
	 * @param h height
	 */
	static makeGrid(w, h) {
		return createArray(w, h, Builder.TYPE_NONE);
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
		Builder.grid[x][y] =  Builder.typeSelected;
	}

	static gridCellReset(x, y) {
		Builder.typeSelected = Builder.TYPE_NONE;
		Builder.grid[x][y].click();
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
		var rocket = new Rocket();
		var temp = Builder.makeGrid(Builder.gridWidth, Builder.gridHeight);
		var list = [];

		//initialize parts != null with body and type
		for (var x=0; x<Builder.gridWidth; x++){
			for (var y=0; y<Builder.gridHeight; y++){
				if(Builder.grid[x][y] !== Builder.TYPE_NONE){	//if partType != null
					empty = false;

					//determine shape and create body
					var shape = Builder.grid[x][y].shape;
					var obj = Bodies.fromVertices(
						Game.SIDE_LENGTH*x,
						Game.SIDE_LENGTH*y,
						Game.shapes[shape]
					);

					//manually un-translate by center of mass
					// orient vertices around the centre of mass at origin (0, 0)
			        var bounds = Matter.Bounds.create(obj.vertices);
					var center = Vector.mult(Vector.add(bounds.min, bounds.max), 0.5);
			        Vertices.translate(obj.vertices, center, -1);

			        // update inertia while vertices are at origin (0, 0)
			        Body.setInertia(obj, Body._inertiaScale * Vertices.inertia(obj.vertices, obj.mass));

			        // update geometry
			        Vertices.translate(obj.vertices, obj.position);
			        Matter.Bounds.update(obj.bounds, obj.vertices, obj.velocity);

					//set color for renderer
					obj.color = parseInt(Builder.grid[x][y].color, 16);

					//add part to rocket
					list.push(obj);
					var part = new Part(obj, Builder.grid[x][y]);
					temp[x][y] = obj;
					rocket.add(part);
				}
			}
		}
		if(empty)
			return;
		var combined = Body.create({
			parts: list
		});
		combined.color = Game.INVISIBLE;
		var width = combined.bounds.max.x - combined.bounds.min.x;
		var height = combined.bounds.max.y - combined.bounds.min.y;
		Body.translate(combined, Vector.create(-Builder.gridWidth/2*Game.SIDE_LENGTH, -Builder.gridHeight*Game.SIDE_LENGTH));
		World.add(Game.engine.world, combined);
		rocket.mainBody = combined;

		Game.rocket = rocket; //make rocket global
	}

	static constrain(body1, body2, offset){
		var newConstraint = Constraint.create({
			bodyA: body1,
			positionA: offset,
			bodyB: body2,
			positionB: offset
		});
		World.add(Game.engine.world, newConstraint);
	}
}
