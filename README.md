#### html5-experiments

This repository contains some HTML5 experiments and serves as a playground for future development.

##### Current libraries:

[Colorpicker component](https://dl.dropboxusercontent.com/u/108661300/github/html5-experiments/demo/colorpicker.html) - Encapsulation experiment using Shadow DOM.

Browser support: Chrome, Opera 15

Usage:

```html
<!-- Load library -->
<script type="text/javascript" src="js/bant.colorpicker.min.js"></script>

<!-- Add host element -->
<input type="text" value="#FFFFFF" id="dom-color-picker" />

<!-- Initialize at document load -->
<script type="text/javascript">
var domcolorpicker = Bant.colorpicker('#dom-color-picker');
</script>
```


[ColorWheel Canvas](https://dl.dropboxusercontent.com/u/108661300/github/html5-experiments/demo/colorwheel.html) - Canvas experiment, ported from [Jackson Gabbard's Python script](http://jacksongabbard.com/generating-a-color-picker-style-color-wheel-in-python.html).

Usage:

```html
<!-- Load library -->
<script type="text/javascript" src="js/bant.colorwheel.min.js"></script>

<!-- Add host element -->
<div id="placeholder-color-wheel"></div>

<!-- Initialize at document load -->
<script type="text/javascript">
	window.addEventListener('load',function(){
		// Parameters: element selector and radius. Returns injected canvas element
		Bant.colorwheel('#placeholder-color-wheel', 150);
	})
</script>
```
