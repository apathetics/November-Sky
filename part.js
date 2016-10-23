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

		//do not apply behaviors if there are none
		if (!(this.partType.hasOwnProperty("behaviors")))
			return;

		//apply behaviors
		if(this.partType.behaviors.indexOf("thrust") >= 0) {
			Body.applyForce(this.body, Vector.create(0,0), Vector.create(0,-this.partType.thrust));
		}
	}
}
