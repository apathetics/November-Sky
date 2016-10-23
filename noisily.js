var Noisily = function(seed) {
	if (typeof seed === "undefined") seed = Math.floor(Math.random()*0x7fffffff);
	this.seed(this.seedNumber);
};

/**
 * Shuffles an array in place using Fisher-Yates.
 */
Noisily.shuffleArray = function(a, seed) {
	if (typeof seed === "undefined") seed = Math.floor(Math.random()*0x7fffffff);
	for (var i=a.length; i>0;) {
		var idx = Math.floor(Noisily.rand(seed)*(i--));
		var temp = a[i];
		a[i] = a[idx];
		a[idx] = temp;
	}
	return a;
};

Noisily.perlinFade = function(x) {
	return x * x * x * (x * (x * 6 - 15) + 10);
};
Noisily.perlinGrad = function(hash, x, y, z) {
	var h = hash & 0xF;
	var u = h<8 ? x : y;
	var v = h<4 ? y : (h === 12 || h === 14 ? x : z);
	return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};
Noisily.lerp = function(x, from, to) {
	return from + x*(to - from);
};

/**
 * A seedable 1D random noise function.
 * Adapted from http://libnoise.sourceforge.net/noisegen/index.html
 */
Noisily.rand = function(seed) {
	var n = seed;
	n = (n >> 13) ^ n;
	var nn = (n * (n * n * 60493 + 19990303) + 1376312589) & 0x7fffffff;
	return 1.0 - (nn / 1073741824.0) * 0.5;
};

Noisily.prototype.rand = function() {
	return Noisily.rand(this.seedNumber);
};

/**
 * Re-generate the permutation table using a given seed.
 * This is *slow*, therefore it should be used as infrequently as possible.
 */
Noisily.prototype.seed = function(seed) {
	this.seedNumber = ~~seed;
	this.P = [];
	for (var i=0; i<256; i++) this.P[i] = i;
	Noisily.shuffleArray(this.P, this.seedNumber);
	this.P2 = this.P.concat(this.P);
};

/**
 * Return the 3D Perlin noise value at a given point.
 * Adapted from http://http://mrl.nyu.edu/~perlin/noise/
 */
Noisily.prototype.perlin3d = function(x, y, z, fadeFunction) {
	if (typeof fadeFunction === "undefined") fadeFunction = Noisily.perlinFade;
	x = Math.abs(x);
	y = Math.abs(y);
	z = Math.abs(z);

	//unit cube
	var cubeX = x & 255;
	var cubeY = y & 255;
	var cubeZ = z & 255;

	//relative pos
	x -= ~~x;
	y -= ~~y;
	z -= ~~z;

	//fade curves
	var u = fadeFunction(x);
	var v = fadeFunction(y);
	var w = fadeFunction(z);

	//hash coords of cube corners
	var A = this.P[cubeX]+cubeY, AA = this.P[A]+cubeZ, AB = this.P[A+1]+cubeZ;
	var B = this.P[cubeX+1]+cubeY, BA = this.P[B]+cubeZ, BB = this.P[B+1]+cubeZ;

	//gradient values
	var g0 = Noisily.perlinGrad(this.P[AA], x,  y,  z);
	var g1 = Noisily.perlinGrad(this.P[BA], x-1,y,  z);
	var g2 = Noisily.perlinGrad(this.P[AB], x,  y-1,z);
	var g3 = Noisily.perlinGrad(this.P[BB], x-1,y-1,z);
	var g4 = Noisily.perlinGrad(this.P[AA+1], x,  y,  z-1);
	var g5 = Noisily.perlinGrad(this.P[BA+1], x-1,y,  z-1);
	var g6 = Noisily.perlinGrad(this.P[AB+1], x,  y-1,z-1);
	var g7 = Noisily.perlinGrad(this.P[BB+1], x-1,y-1,z-1);

	return Noisily.lerp(w, Noisily.lerp(v, Noisily.lerp(u, g0, g1), Noisily.lerp(u, g2, g3)), Noisily.lerp(v, Noisily.lerp(u, g4, g5), Noisily.lerp(u, g6, g7)));
};
