class Part {
	constructor(body, partType) {
		this.body = body;
		this.partType = partType;
	}

	update(dTime) {
		//do not apply behaviors if there are none
		if (!(this.partType.hasOwnProperty("behaviors")))
			return;

		//apply behaviors
		if(this.partType.behaviors.indexOf("thrust") >= 0) {
			//calculate force vector
			var f = Vector.create(this.partType.thrust * this.thrust,0);
			f = Vector.rotate(f, this.body.parent.angle - Math.PI*0.5 +
				this.gimbal * this.partType.gimbalRange);
			//apply force
			Body.applyForce(
				this.body.parent,
				this.body.position,
				f
			);

			f = Vector.mult(f, 3000);
			var side = Builder.SIDE_LENGTH;
			var angle = this.body.parent.angle + Math.PI * 0.5;

			//how far has the rocket moved?
			var dx = Game.rocket.mainBody.velocity.x + f.x;
			var dy = Game.rocket.mainBody.velocity.y + f.y;
			var len = Math.sqrt(dx*dx+dy*dy);

			//interpolate between old and new position of rocket
			for (var i=0; i<len; i+=len/20) {
				//offset to edge of part, plus some randomness
				var offset = Vector.create(side * 0.5, Math.random()*side*0.5-side*0.25);
				offset = Vector.rotate(offset, angle);

				//create a particle
				Particle.makeParticle(
					this.body.position.x + dx*i/len + offset.x,
					this.body.position.y + dy*i/len + offset.y,
					Math.random()*2-1 - f.x,
					Math.random()*2 - f.y,
					255, 138, 40,
					5, 9
				);
			}
		}
	}
}
