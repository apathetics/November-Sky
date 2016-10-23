class Rocket {
	constructor() {
		//needs container for parts
		this.partContainer = [];
		this.mainBody = null;
		this.sensors = {};
		this.controls = {};
		this.usrLoop = function(){};
	}

	add(part) {
		//add part to a container
		this.partContainer.push(part);
	}

	update(dTime) {
		for(var i=0; i<this.partContainer.length; i++) {
			this.partContainer[i].update(dTime);
		}
	}
}
