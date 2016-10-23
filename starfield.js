class Starfield {
	static init(n) {
		this.n = n;
		this.stars = [];
		for (var i=0; i<n; i++) {
			this.stars.push({
				x: Math.random()*Display.width,
				y: Math.random()*Display.height,
				z: 11-Math.random()*Math.random()*10
			});
		}
		this.gfx = new PIXI.Graphics();
	}

	static update(timeDelta) {
		this.gfx.clear();
		for (var i=0,n=this.n; i<n; i++) {
			var p = this.stars[i];
			
			var vx=0, vy=0;
			if (Game.rocket instanceof Rocket) {
				vx = Game.rocket.mainBody.velocity.x * 1.5;
				vy = Game.rocket.mainBody.velocity.y * 1.5;
			}
			vx += 1.42;
			vy += 1.64;
			
			p.x = (p.x - vx/p.z) % Display.width;
			if (p.x < 0) p.x += Display.width;
			p.y = (p.y - vy/p.z) % Display.height;
			if (p.y < 0) p.y += Display.height;

			var val = 255 - (255 * p.z/11);
			this.gfx.lineStyle(1, val | (val<<8) | (val<<16));
			this.gfx.moveTo(p.x, p.y);
			this.gfx.lineTo(p.x - vx/p.z, p.y - vy/p.z + 1);
		}
	}
}