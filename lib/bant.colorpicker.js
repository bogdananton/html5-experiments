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
				'#color, #picker {border:none;float:left;outline:none} '+
				'#color {width:60px;text-align:center;font-family:Arial;font-size:13px;line-height:13px;padding:0 5px} '+
				'#picker {background:#777;border-radius:6px;margin:4px 5px 0 0;width:12px;height:12px;cursor:pointer } ';
			return style;
		}

		// build template
		function templateHtmlPicker(){
			var templateHtml = document.createElement('div');
			templateHtml.innerHTML = 
			'<input type="text" maxlength="7" id="color">'+
			'<button title="pick color" id="picker"></button>';

			// TODO: add color wheel
			// ...

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

		// init and setup events
		var pickerButton = shadow.querySelector('#picker');
		var colorInput = shadow.querySelector('#color');
		colorInput.value = elInstance.value;

		colorInput.addEventListener('change', updateColorInput);

		// TODO: add events for color wheel
		// ...

		// return host element
		return elInstance;
	}

	return Bant;
})(Bant || {});