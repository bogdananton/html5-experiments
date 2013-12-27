var Bant = (function(Bant) {

	Bant.colorpicker = function($element) {

		var elSelector = $element;
		var elInstance = document.querySelector($element);

		// shadow dom helper
		function createSR(element) {
			if (element.createShadowRoot) {
				return element.createShadowRoot(); 
			}
			if (element.webkitCreateShadowRoot) {
				return element.webkitCreateShadowRoot();
			}
		}

		// validate color
		function getIsColorValid(newColor){
			if(newColor == ''){
				return false;
			}

			var isValid = false;
			var limitLength = 0; // used to explode string
			newColor = newColor.substr(1); // strip #

			switch(newColor.length){
				case 3:  limitLength = 1; break;
				case 6:  limitLength = 2; break;
				default: limitLength = 0; break;
			}

			if(limitLength > 0){
				var r = newColor.substr(0,				limitLength);
				var g = newColor.substr(limitLength,	limitLength);
				var b = newColor.substr(limitLength*2,	limitLength);

				var hexaTester = new RegExp('[0-9A-F]{'+limitLength+'}','i');
				isValid = (hexaTester.test(r) && hexaTester.test(g) && hexaTester.test(b));
			}

			return isValid;
		}

		// build style
		function templateStyle(){
			var style = document.createElement('style');
			style.textContent = 
				'#color, #picker, #colorwheel {border:none;float:left;outline:none} '+
				'#color {width:60px;text-align:center;font-family:Arial;font-size:13px;line-height:13px;padding:0 5px} '+
				'#picker {background:#777;border-radius:6px;margin:4px 5px 0 0;width:12px;height:12px;cursor:pointer } '+
				'#colorwheel {position:absolute; margin:25px 0 0 0; cursor:pointer; display:none}';
			return style;
		}

		// build template
		function templateHtmlPicker(){
			var templateHtml = document.createElement('div');
			templateHtml.innerHTML = 
			'<input type="text" maxlength="7" id="color">'+
			'<button title="pick color" id="picker"></button>'+
			'<div id="colorwheel"></div>';

			return templateHtml;
		}

		// preview and reset picker
		function previewButtonColor(color) {
			pickerButton.style.background = color;
			setTimeout(function(){
				pickerButton.style.background = '#777';
			}, 2000);
		}

		// trigger change event (compatibility for host element)
		function triggerChange(element){
			if ("createEvent" in document) {
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent("change", false, true);
				element.dispatchEvent(evt);
			} else {
				element.fireEvent("onchange");
			}
		}

		// validate new color and update host 
		function updateColorInput(){
			var color = colorInput.value;
			
			if(getIsColorValid(color)){
				elInstance.setAttribute('value', color);
				previewButtonColor(color);
				triggerChange(elInstance);

			} else {
				// rollback using host color
				color = elInstance.value;
			}

			colorInput.setAttribute('value', color);
		}

		// load HTML
		var shadow = createSR(elInstance);
		shadow.appendChild(templateHtmlPicker());
		shadow.appendChild(templateStyle());

		// add color wheel
		var colorwheel_canvas = Bant.colorwheel(shadow.querySelector('#colorwheel'), 75);
		var colorwheel_ctx = colorwheel_canvas.getContext('2d');

		// init and setup events
		var pickerButton = shadow.querySelector('#picker');
		var colorInput = shadow.querySelector('#color');
		colorInput.value = elInstance.value;

		colorInput.addEventListener('change', updateColorInput);

		colorwheel_canvas.addEventListener('mousemove', function(ev) {
	        var mouseX, mouseY;

	        if(ev.offsetX) {
	            mouseX = ev.offsetX;
	            mouseY = ev.offsetY;
	        }
	        else if(ev.layerX) {
	            mouseX = ev.layerX;
	            mouseY = ev.layerY;
	        }
	        var c = colorwheel_ctx.getImageData(mouseX, mouseY, 1, 1).data;
	        var newColor = '000000'+((c[0] << 16) + (c[1] << 8) + c[2]).toString(16);
	        newColor = '#'+newColor.substr(newColor.length-6);

			pickerButton.style.background = newColor;
			colorInput.value = newColor;
		});

		pickerButton.addEventListener('click', function(ev) {
			shadow.querySelector('#colorwheel').style.display = 'block';
		});

		colorwheel_canvas.addEventListener('click', function(ev) {
			shadow.querySelector('#colorwheel').style.display = 'none';
			triggerChange(colorInput);
		});

		// return host element
		return elInstance;
	
	}

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