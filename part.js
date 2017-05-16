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

			//everything below this is solely to create particle effects
			f = Vector.mult(f, 3000);
			var side = Game.SIDE_LENGTH;
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

		//cast from nose to find asteroids
		if(this.partType.behaviors.indexOf("scan") >= 0) {
			var start = {x: this.body.position.x, y: this.body.position.y};
			var end = Vector.create(0,5);
			end = Vector.rotate(end, -this.body.parent.angle);
			var obstacleBodies = [];

			//replace this later. Super inefficient
			//maybe just keep track of the Bodies instead of Obstacles
			Game.obstacles.forEach(function(obstacle){
				obstacleBodies.push(obstacle.body);
			});

			//array of all collisions
			var cols = Matter.Query.ray(
				obstacleBodies,
				start,
				end,
				5
			);

			cols.forEach(function(col){
				//this doesn't quite work yet
				console.log("hit");
				Particle.makeParticle(
					start.x,
					start.y,
					Math.random(),
					Math.random(),
					100, 255, 40,
					5, 9
				);
			});
		}
	}
}
