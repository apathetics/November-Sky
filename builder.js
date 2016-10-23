class Builder {
	/**
	 * Create pixi Container for builder interface.
	 * Create empty grid array
	 * Create grid cells and make clickable
	 */
	static init() {
		Builder.gridWidth = 8;
		Builder.gridHeight = 8;
		Builder.grid = makeGrid(Builder.gridWidth, Builder.gridHeight);
		Builder.typeSelected = null;

	}

	/**
	 * Display the builder interface
	 */
	static show() {

	}

	/**
	 * Hide the builder interface
	 */
	static hide() {

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