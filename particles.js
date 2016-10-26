class Particle {
	static init(n) {
		Particle.n = n;
		Particle.idx = 0;
		Particle.particles = [];
		for (var i=0; i<n; i++)
			Particle.makeParticle(0,0,0,0,0,0,0,0,0);
		Particle.gfx = new PIXI.Graphics();
	}

	static makeParticle(x,y,vx,vy,r,g,b,size,life) {
		Particle.idx = (Particle.idx+1)%Particle.n; //we only want n particles
		Particle.particles[Particle.idx] = {
			x: x,
			y: y,
			vx: vx,
			vy: vy,
			col: (r<<16) | (g<<8) | r,
			t: 0,
			size: size,
			life: life
		};
	}

	static update(timeDelta) {
		Particle.gfx.clear();
		for (var i=0,n=Particle.n; i<n; i++) {
			var p = Particle.particles[i];
			if (p.t >= p.life)
				continue;
			p.t++;
			p.x += p.vx;	//increment position of x with velocity of x
			p.y += p.vy;	//increment position of y with velocity of y
			
			//as particle gets older, its alpha decreases (particle fades)
			Particle.gfx.beginFill(p.col, Math.max(0,1-p.t/p.life));
			Particle.gfx.drawCircle(p.x - Display.view.x, p.y - Display.view.y, p.size);
			Particle.gfx.endFill();
		}
	}
}