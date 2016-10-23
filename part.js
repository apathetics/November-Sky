class Part {
	constructor(body, partType) {
		//initialize properties of part
		//add default values to data??
		this.body = body;
		this.partType = partType;
	}

	update(dTime) {
		//switch on part type name?
		//do relevant updates
		//e.g. apply force to physics object

		if(this.partType.behaviors.indexOf("thruster") >= 0) {
			Body.applyForce(this.body, Vector.create(0,-this.partType.thrust));
		}
	}
}
