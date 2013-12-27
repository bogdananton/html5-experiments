var Bant = (function(Bant) {

	Bant.colorwheel = function($element, $radius) {

		// PORTED FROM http://jacksongabbard.com/generating-a-color-picker-style-color-wheel-in-python.html
		this.drawWheel = function(ctx) {

			this.colorBase = [
				[255, 	  0, 	255],
				[255, 	  0, 	  0],
				[255, 	255, 	  0],
				[  0, 	255, 	  0],
				[  0, 	255, 	255],
				[  0, 	  0, 	255],
				[255, 	  0, 	255]
			];

			var radius = this.radius;
			var size = radius * 2;

			var pixel = ctx.createImageData(1,1);
			var d  = pixel.data;

			for(var x = 0; x < size; x++) {
				for(var y = 0; y < size; y++) {
					
					var distance = Math.abs(Math.sqrt(Math.pow(x - radius, 2) + Math.pow(y - radius, 2)));

					if(distance > radius){
						continue;
					}

					var shade = 2 * (distance+10) / radius;
					var angle = (x - radius == 0) ? ((y>radius) ? 90 : -90) : Math.atan2((y-radius), (x-radius))*180/Math.PI;

					angle = (angle + 30) % 360;

					var idx = angle / 60;
					if(idx < 0) {
						idx = 6 + idx;
					}

					var base = parseInt(Math.round(idx));

					var adj = (6 + base + ((base > idx) ? -1 : 1)) % 6;
					var ratio = Math.max(idx, base) - Math.min(idx, base);
					var color = this.makeColor(base, adj, ratio, shade, false);

					d[0] = color[0];
					d[1] = color[1];
					d[2] = color[2];
					d[3] = 255;

					ctx.putImageData( pixel, x, y );
				}
			}
		}

		this.makeColor = function(base, adj, ratio, shade, toString){
			var outputColor = [];

			for (var pos = 0; pos < 3; pos++) {
				var base_channel = this.colorBase[base][pos];
				var adj_channel =  this.colorBase[adj][pos];
				var new_channel =  parseInt(Math.round(base_channel * (1 - ratio) + adj_channel * ratio));

				if(shade < 1){
					new_channel = new_channel * shade;
				} else if(shade > 1) {
					var shade_ratio = shade - 1;
					new_channel = (255 * shade_ratio) + (new_channel * (1 - shade_ratio))
				}

				outputColor.push(new_channel);
			};

			if(toString){
				var newColor = '000000'+((outputColor[0] << 16) + (outputColor[1] << 8) + outputColor[2]).toString(16);
	        	return '#'+newColor.substr(newColor.length-6);
			}

			return outputColor;
		}

		this.initialize = function($element, $radius){

			if(typeof $element == 'string'){
				this.elInstance = document.querySelector($element);
			} else {
				this.elInstance = $element;
			}

			this.radius = $radius;
			
			this.canvas = document.createElement("canvas");
			this.elInstance.appendChild(this.canvas);

			var size = $radius * 2;
			this.ctx = this.canvas.getContext('2d');
			this.canvas.setAttribute('width', size);
			this.canvas.setAttribute('height', size);

			this.drawWheel(this.ctx);
		}

		this.canvas = null;
		this.initialize($element, $radius);

		return this.canvas;
	}

	return Bant;
})(Bant || {});