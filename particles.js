class Particle {
	static init(n) {
		Particle.n = n;
		Particle.idx = 0;
		Particle.particles = [];
		for (var i=0; i<n; i++)
			Particle.makeParticle(0,0,0,0,0,0,0,0,0);
		Particle.gfx = new PIXI.Graphics();
		// Particle.gfx.blendMode = PIXI.BLEND_MODES.ADD;
	}

	static makeParticle(x,y,vx,vy,r,g,b,size,life) {
		Particle.idx = (Particle.idx+1)%Particle.n; //we only want n particles
		Particle.particles[Particle.idx] = {
			x: x,
			y: y,
			vx: vx,
			vy: vy,
			r: r,
			g: g,
			b: b,
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
			var fader = Math.max(0,1-p.t/p.life);
			var idxDiff = i - Particle.idx;
			var modDiff = ((idxDiff % Particle.n) + Particle.n) % Particle.n;
			fader = Math.min(fader, modDiff / Particle.n);
			var col = ((p.r*fader)<<16) | ((p.g*fader)<<8) | (p.b*fader);
			Particle.gfx.beginFill(col, fader);
			Particle.gfx.drawRect(p.x - Display.view.x - p.size, p.y - Display.view.y - p.size, p.size*2, p.size*2);
			Particle.gfx.endFill();
		}
	}
}
