jquery-regexer
==============

Plugin to validate form elements using regular expressions

## Usage

Register function on document ready

```javascript
	$(document).ready(function(){
		$('#form').regexer();
	});
```

You may wish to configure few variables like this

```javascript
	$(document).ready(function(){
        	$('#form').regexer({
			reqFieldMsg: 		'This field is required',
			incorrecFormatMsg: 	'Incorrect Format',
			errAlertMsg:		'There are validation errors in this step.',
			exclude:		'button, .dont-validate'
		});
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

## Data Attributes

Those three data attributes are used for processing.

**data-vtype:** *Valdiation Type*

Possible values: 'regex' or 'null'

For required elements use 'regex' : Use of 'regex' allows ONLY appropriate value for element. Value cannot be blank.
For non-required elements use 'null' : Use of 'null' allows zero length value for element. Value can be blank.
But value will be checked against regtype if isnull = 1 if value.length > 0

**data-regtype:** *Type of regex*

Possible values: 'name', 'address', 'number', 'phone', 'zip', 'ssn', 'fssn', 'sssn', 'tssn', 'date', 'email'

Please note that regular expression used in this script are following US standards of data structure.
If this is used in conjuction with data-vtype 'null' & isnull = 1, then it will validate the value if
it is filled with appropriate regtype provided.

**data-isnull:** *Is Null*

Possible values: 0 or 1 (not_null OR allow_null)

if 1 then, element can have null value
if 0, then, element must have some value
