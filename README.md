# LancerFrame
A simple Web Frontend MVVM Framework. Still under construction.

造个轮子，还在制造中。

## Simple Introduction.
### Using Controller.
1. Define a controller.
	```
	<div lc-controller="demoCtrl">
	    <p lc-text="greeting"></p>	    
	</div>
	
	<script>
	    $lc.controller("demoCtrl", function (scope) {
	        scope.greeting = "Hello LancerFrame!";    
	    });
	</script>
	```

2. Define a controller by requiring another controller.
	```
	<div lc-controller="ctrl1"></div>
	<div lc-controller="ctrl2"></div>
	
	<script>
	    $lc.controller("ctrl1", function (scope) {
	        scope.name = "LancerComet";    
	    });
	
		$lc.controller("ctrl2", ["ctrl1"], function (scope, ctrl1) {
			// "ctrl1" is required.
	        scope.name = "Craig Mullins";
	        console.log(ctrl1.name);  // LancerComet    
	    });
	</script>
	```

### Duplex data binding.
```
<div lc-controller="demoCtrl">
    <p lc-text="greeting"></p>
	<input type="text" lc-model="greeting">	    
</div>

<script>
    $lc.controller("demoCtrl", function (scope) {
        scope.greeting = "Hello LancerFrame!";    
    });
</script>
```

### Using custom directives.
```
<div lc-controller="testCtrl">
	<div lc-alert></div>
</div>

<script>
	$lc.controller("testCtrl", function (scope) {
		scope.alertInited = false;
	});

	// Example: lc-alert.
	$lc.directive("alert", {
		$init: function () {
			console.log("Start to init lc-alert.");
		},
		$done: function () {
			// Will be called when initization is done.
			this.$element.innerHTML = "Wow!";  // "this.$element" is the dom element of this directive.
			this.$scope.alertInited = true;  // "this.$scope" is the scope of the controller that this directive belongs to.
			alert("Wow! Alert!"); 
		},
		$update: funciton () {
			// When "this.$scope[this.$expr]" has been changed, "$update" will be called.
			// For example, if you use this directive as "<div lc-alert="alert1"></div>", then "this.$expr" is "alert1". If value of "scope.alert1" is going to be changed, "$update" will be called.
			// For now, there is no "$expr" provided (because "lc-alert" equals nothing) and $update will never be called.
		},
		$destory: function () {

		}
	});
</script>
```


### Using components.
```
<div lc-controller="testCtrl">
    <lc-greeting></lc-greeting>
</div>

<script>
$lc.controller("testCtrl", function () {
    this.greeting = "Hello!";
});

$lc.component("lc-greeting", {
    $init: function (element, scope) {
		// "element" is the element of this component.
		// "scope" is the scope object of the controller that this component belongs to. 
		console.log("I'm going to define the component called 'lc-greeting'!");
		console.dir(element.innerHTML);
		console.log(scope); 
	},
	$done: function (element, scope) {
		console.dir(element.innerHTML);
		console.log(scope); 
	},
	$template: '<h1 lc-text="greeting"></h1>'
});
</script>
```


## Directive finished.
 - lc-controller
 - lc-model
 - lc-text
 - lc-click
 - lc-mouseenter
 - lc-mouseleave
 - lc-skip
 - lc-cloak