class Rocket {
	constructor() {
		//needs container for parts
		this.partContainer = [];
		this.mainBody = null;
		this.userLoop = function(){};
		this.controls = {
			thrust: 0,
			gimbal: 0
		};
		this.sensors = {};
	}

	add(part) {
		//add part to a container
		this.partContainer.push(part);
	}

	update(dTime) {

		//write "sensor" values
		this.sensors.angle = this.mainBody.angle;
		this.sensors.position = this.mainBody.position.x;
		this.sensors.altitude = this.mainBody.position.y;

		//run user code
		this.userLoop();

		//read params and do things
		var that = this;
		this.partContainer.forEach(function(part){
			if (!(part.partType.hasOwnProperty("behaviors")))
				return;
			if (part.partType.behaviors.indexOf("thrust") >= 0) {
				part.thrust = Math.min(100, Math.max(0, that.controls.thrust)) / 100;
				part.gimbal = Math.min(1, Math.max(-1, that.controls.gimbal));
			}
		});
		
		for(var i=0; i<this.partContainer.length; i++) {
			this.partContainer[i].update(dTime);
		}
	}
}
