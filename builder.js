class Builder {
	/**
	 * Create pixi Container for builder interface.
	 * Create empty grid array
	 * Create grid cells and make clickable
	 */
	static init() {
		Builder.grid = Builder.makeGrid(Builder.gridWidth, Builder.gridHeight);
		Builder.grid = [];
		Builder.gridWidth = 8;
		Builder.gridHeight = 8;
		Builder.typeSelected = null;

		Display.gridContainer = new PIXI.Container();
		var gridSquareSize = 64;
		var margin = 8;
		for (var x=0; x<Builder.gridWidth; x++) {
			for (var y=0; y<Builder.gridHeight; y++) {
				var g = new PIXI.Graphics();
				g.beginFill(0xFFFFFF, 1);
				g.drawRect(x*gridSquareSize + x*margin, y*gridSquareSize + y*margin, gridSquareSize, gridSquareSize);
				g.endFill();
				g.tint = 0x0000FF;
				Display.gridContainer.addChild(g);
			}
		}
		Display.stage.addChild(Display.gridContainer);
	}

	/**
	 * Display the builder interface
	 */
	static show() {
		Display.gridContainer.visible = true;
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
		return createArray(w,h);
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
		Builder.grid[x][y] = click; 

	}

	/**
	 * When the user is done designing rocket,
	 * Create a physics object for each non-null grid cell.
	 * Physically link adjacent objects.
	 * Create composite.
	 * Add composite to game world.
	 */
	static makeRocket() {

	}
}