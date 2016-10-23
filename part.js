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
			var f = Vector.create(this.partType.thrust * this.thrust,0);
			Body.applyForce(this.body.parent, this.body.position, Vector.rotate(f, this.body.parent.angle - Math.PI*0.5 + this.gimbal * this.partType.gimbalRange));
		}
	}
}
