var Bant = {
	colorpicker : function($element, $withAlpha) {
		var wrapper = {
			withAlpha : (null === $withAlpha) ? false : $withAlpha,
			elSelector : $element,
			elInstance : document.querySelector($element),
			color : document.querySelector($element).value,
			colorInput : null,
			pickerButton : null
		};

		// helper
		function createSR(element) {
			if (element.createShadowRoot) {
				return element.createShadowRoot(); 
			}
			if (element.webkitCreateShadowRoot) {
				return element.webkitCreateShadowRoot();
			}
		}

		// load HTML
		var shadow = createSR(wrapper.elInstance);
		var templateHtml = document.createElement('template');

		// TODO: improve template loading method 
		templateHtml.innerHTML = 
			'<input type="text" maxlength="7" id="color">'+
			'<button title="pick color" id="picker"></button>';

		// TODO: add support for alpha & slider
		if(false && wrapper.withAlpha){
			templateHtml.innerHTML += 
				'<input type="hidden" value="100" id="alpha">'+
				'<div id="slide_alpha" title="Set transparency">'+
					'<div id="bar"></div>'+
					'<div id="ball"></div>'+
				'</div>';
		}

		templateHtml.innerHTML += 
		'<style type="text/css">'+
			'#color, #picker {border:none;float:left;outline:none} '+
			'#color {width:60px;text-align:center;font-family:Arial;font-size:13px;line-height:13px;padding:0 5px} '+
			'#picker {background:#777;border-radius:6px;margin:4px 5px 0 0;width:12px;height:12px;cursor:pointer } '+
		'</style>';


		document.body.appendChild(templateHtml);
		shadow.appendChild(templateHtml.content);
		templateHtml.remove();

		// init and setup events
		wrapper.colorInput = shadow.querySelector('#color');
		wrapper.colorInput.value = wrapper.color;

		wrapper.pickerButton = shadow.querySelector('#picker');
 
		wrapper.colorInput.addEventListener('change', function(){
			// validate
			var newColor = wrapper.colorInput.value;
			var isValid = false;

			if(newColor != ''){
				newColor = newColor.substr(1); // strip #
				var limitLength = 0; // used to explode string

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
			}

			if(isValid){
				// apply update
				wrapper.elInstance.value = wrapper.colorInput.value;

				// preview and reset picker
				wrapper.pickerButton.style.background = wrapper.colorInput.value;
				setTimeout(function(){
					wrapper.pickerButton.style.background = '#777';
				},3000);

			
			} else {
				// rollback using host color
				wrapper.colorInput.value = wrapper.elInstance.value;
			}
		});

		return wrapper;
	}
};
