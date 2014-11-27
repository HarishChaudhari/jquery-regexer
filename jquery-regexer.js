/**
 * Regexer: Plugin to validate form elements using regular expressions
 *
 * Version 0.5
 * 
 * @author Harish Chaudhari <contact@harishchaudhari.com>
 * http://harishchaudhari.com/
 *
 * License GNU/GPL
 */

(function($) {
	/**
	 * Register Main class for Regexer
	 * 
	 * @param string element a valid jQuery selector for the parent element of clones
	 * @param object options options that can be passed to each instance
	 */
	var Regexer = function(element, options) {

		// store jQuery object
		var form = $(element);

		// Default options
		var rxDefaults = {
			// Holds elements to be excluded from Vaildation
			reqFieldMsg: 'This field is required',
			incorrecFormatMsg: 'Incorrect Format',
			errAlertMsg: 'There are validation errors in this step.',
			exclude: ''
		};

		// merge user passed options object with rxDefaults
		var rxConfig = $.extend(rxDefaults, options || {});

		// get rxConfig
		this.getOption = function() {
			return rxConfig;
		};
		
		// set rxConfig
		this.setOption = function(postoptions) {
			$.extend(rxConfig, postoptions || {});
		};
		
		// Attach submit event to Form
		form.on('submit', function(event) {
			event.preventDefault();
			rxformValidation();
		});
		
		/**
		 * Valdiation initiator
		 * 
		 * @since 0.5
		 */
		var rxformValidation = function() {
			// For counting
			var i = 0;
			
			// Array for holding success/failed  ( 'y' or 'f' )  responses
			var rxErrFlag = new Array();
			
			// Run loop for each element in form exlcuding elements provided in rxConfig
			form.find('input, textarea, select').not(rxConfig.exclude).not('input[type="submit"], input[type="button"]').each(function(){
				// ID of element
				var rxElemID = '#' + $(this).attr('id');
				
				// Valdiation Type
				// Possible values: 'regex' or 'null'
				// For required elements use 'regex' : Use of 'regex' allows ONLY appropriate value for element. Value cannot be blank
				// For non-required elements use 'null' : Use of 'null' allows zero length value for element. Value can be blank.
				// But value will be checked against regtype if isnull = 1 if value.length > 0
				var rxValidationType = $(this).data('vtype');
				
				// Type of regex
				// Possible values: 'name', 'address', 'number', 'phone', 'zip', 'ssn', 'fssn', 'sssn', 'tssn', 'date', 'email'
				// Regex following US standards of data structure
				// If used in conjuction with vtype 'null' & isnull = 1, then it will validate the value if it is filled with appropriate regtype provided
				var rxRegexType = $(this).data('regtype');
				
				// Is Null
				// Possible values: 0 or 1
				// if 1 then, element can have null value
				// if 0, then, element must have some value
				var rxIsNull = ($(this).data('isnull') == 1) ? 'allow_null' : 'not_null';
				
				// Okay, we got our variables set, now call the validator and get it done.
				rxErrFlag[i] = rxRegexValidator(rxElemID, rxValidationType, rxRegexType, rxIsNull );
				i = i + 1;
			});
			
			if( $.inArray("f", rxErrFlag) !== -1 ) {
				// Oh crap..it failed, now what stop JS from proceeding
				alert(rxConfig.errAlertMsg);
				return;
			} else {
				// Whoa, success :)
				form.submit();
			}
		};
		/* End of function rxformValidation() */
		
		/**
		 * Regular Expression Validator
		 * Parameters passed are read from data attributes of form elements
		 * 
		 * @param rxElemID 	Currently processing element ID
		 * @param rxValidation 	Type Type of valdiation you want to carry out
		 * @param rxRegexType 	Type of regex to use from list of available
		 * @param rxIsNull 	If element needs to be allow null or not
		 * 
		 * @since 0.5
		 */
		var rxRegexValidator = function (rxElemID, rxValidationType, rxRegexType, rxIsNull) {
			if( $(rxElemID).length > 0) {
				var value = $(rxElemID).val();
				
				// For type null, most probably used in case of non-required elements
				if( rxValidationType == 'null' ) {
					// Fist check for NULL
					switch( rxIsNull ) {
						case 'allow_null':
							var is_null = true;
							break;
						case 'not_null':
						case '':
						default:
							var is_null = false;
							break;
					}
					$(rxElemID).parent().find('.rx-err-msg').remove();
					
					if( !is_null && value.length == 0 ) {
						// Failed
						$(rxElemID).parent().append('<span class="rx-err-msg">'+rxConfig.reqFieldMsg+'</span>');
						$(rxElemID).addClass('error').addClass('rx-error-border');
						return 'f';
					} else if( !is_null && value.length > 0 ) {
						// Success for not_null elements
						$(rxElemID).parent().find('.rx-err-msg').remove();
						$(rxElemID).removeClass('error').removeClass('rx-error-border');
						return 'y';
					} else if( is_null && value.length == 0 ) {
						// Success for allow_null elements
						$(rxElemID).parent().find('.rx-err-msg').remove();
						$(rxElemID).removeClass('error').removeClass('rx-error-border');
						return 'y';
					}
				}
				
				// Run this for both validation types,
				// as null needs to be checked against its associated regex type
				if( (rxValidationType == 'regex' || rxValidationType == 'null') ) {
					// RegEx will not be validated for elements allowing NULL(not required) which should have data-regtype = 'null'
					// Select the Regex Type
					switch( rxRegexType ) {
						case 'name':
							var reg = /^([a-zA-Z \-.\'.\_]+)$/;
							break;
						case 'address':
							var reg = /^([a-zA-Z0-9 \(\)\#\&.\,.\-.\'.\_]+)$/;
							break;
						case 'number':
							var reg = /^([0-9]+)$/;
							break;
						case 'phone':
							var reg = /^(?:\([0-9]\d{2}\)\ ?|(?:[0-9]\d{2}\-))[0-9]\d{2}\-\d{4}$/;
							break;
						case 'zip':
							var reg = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
							break;
						case 'ssn':
							var reg = /^([0-6]\d{2}|7[0-6]\d|77[0-2])([ \-]?)(\d{2})\2(\d{4})$/;
							break;
						case 'fssn':
							var reg = /^\d{3,}$/;
							break;
						case 'sssn':
							var reg = /^\d{2,}$/;
							break;
						case 'tssn':
							var reg = /^\d{4,}$/;
							break;
						case 'date':
							var reg = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
							break;
						case 'email':
							var reg =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
							break;
						case '':
						default:
							var reg = false;
							break;
					}
					if( reg ) {
						// Test the RegEx
						$(rxElemID).parent().find('.rx-err-msg').remove();
						if (!reg.test(value)) {
							// failed
							if( value.length == 0 ) {
								$(rxElemID).parent().append('<span class="rx-err-msg">'+rxConfig.reqFieldMsg+'</span>');
							} else {
								$(rxElemID).parent().append('<span class="rx-err-msg">'+rxConfig.incorrecFormatMsg+'</span>');
							}
							$(rxElemID).addClass('error').addClass('rx-error-border');
							return 'f';
						} else {
							// Success
							$(rxElemID).parent().find('.rx-err-msg').remove();
							$(rxElemID).removeClass('error').removeClass('rx-error-border');
							return 'y';
						}
					}
				}
			}
		}
	};
	
	// Add the Regexer to the global object
	$.fn.regexer = function(options) {
		return this.each(function() {
			var element = $(this);
			
			// Return if plugin is already attached
			if (element.data('regexer'))
				return;
			
			// pass options to plugin constructor and create a new instance
			var regexer = new Regexer(this, options);
			
			// Store plugin object in this element's data
			element.data('regexer', regexer);
		});
	};
})(jQuery);
