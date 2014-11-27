jquery-regexer
==============

Plugin to validate form elements using regular expressions

Usage
==============


Register function on document ready

```javascript
	$(document).ready(function(){
		$('#form').regexer();
	});
```

Your form markup could be like this.
Its not mandatory to have markup like this, but at least input tags should have a parent wrapper, say ```<div>```.

```html
	<form id="form" action="">
		<div>
			<label>First name</label>
			<input id="fname" type="text" value="" data-vtype="regex" data-regtype="name" data-isnull="0" >
		</div>
		<div>
			<label>Middle name</label>
			<input id="mname" type="text" value="" data-vtype="regex" data-regtype="name" data-isnull="0" >
		</div>
		<div>
			<label>Last name</label>
			<input id="lname" type="text" value="" data-vtype="regex" data-regtype="name" data-isnull="0" >
		</div>
			
		<input type="submit" id="sub" value="subm" />
	</form>
```

Data Attributes
==============

Those three data attributes are used for processing.

data-vtype: regex OR null

data-regtype: 'name', 'address', 'number', 'phone', 'zip', 'ssn', 'fssn', 'sssn', 'tssn', 'date' OR 'email'

data-isnull: 0 OR 1 (not_null OR allow_null)


