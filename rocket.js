class Rocket {
	constructor() {
		//needs container for parts
		var partContainer = [];
	}

	add(part) {
		//add part to a container
		partContainer.push(part);
	}

	update(dTime) {
		for(i=0; i<partContainer.length; i++) {
			partContainer[i].update(dTime);
		}
	}
}
