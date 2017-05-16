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
		this.input = {};
	}

	add(part) {
		//add part to a container
		this.partContainer.push(part);
	}

	update(dTime) {
		//write "sensor" values
		this.sensors.angle = this.mainBody.angle;
		this.sensors.position = this.mainBody.position.x/Game.wallRadius;
		this.sensors.altitude = Game.altitude();

		//write input values
		Object.keys(Game.input).forEach(function(key){
			if (Game.input[key] instanceof Array) {
				this.input[key] = [];
				for (var i=0; i<Game.input[key].length; i++)
					this.input[key].push(Game.input[key][i]);
				return;
			}
			this.input[key] = Game.input[key];
		}.bind(this));

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
			if (part.partType.behaviors.indexOf("scan") >= 0){
				part.gimbal = Math.min(1, Math.max(-1, that.controls.gimbal));
			}
		});
		this.partContainer.forEach(function(part){
			part.update(dTime);
		});
	}
}
