class Builder {
	/**
	 * Create pixi Container for builder interface.
	 * Create empty grid array
	 * Create grid cells and make clickable
	 */
	static init() {
		this.grid = [];
		this.gridWidth = 8;
		this.gridHeight = 8;
		this.typeSelected = null;


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

	/**
	 * Returns 2D array initialized to null.
	 * @param w width
	 * @param h height
	 */
	static makeGrid(w, h) {
		
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