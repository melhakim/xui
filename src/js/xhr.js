/**
	XHR
	===

	Everything related to remote network connections.

 */
xui.extend({	
/**
	xhr
	---

	The classic `XMLHttpRequest` sometimes also known as the Greek God: _Ajax_. Not to be confused with _AJAX_ the cleaning agent.

	### detail ###

	This method has a few new tricks.

	It is always invoked on an element collection and uses the behaviour of `html`.

	If there no callback, then the `responseText` will be inserted into the elements in the collection.

	### syntax ###

		x$( selector ).xhr( location, url, options )

	or accept a url with a default behavior of inner:

		x$( selector ).xhr( url, options );

	or accept a url with a callback:
	
		x$( selector ).xhr( url, fn );

	### arguments ###

	- location `String` is the location to insert the `responseText`. See `html` for values.
	- url `String` is where to send the request.
	- fn `Function` is called on status 200 (i.e. sucess callback).
	- options `Object` is a JSON object with one or more of the following:
		- method `String` can be _get_, _put_, _delete_, _post_. Default is _get_.
		- async `Boolean` enables an asynchronous request. Defaults to _false_.
		- data `String` is a url encoded string of parameters to send.
		- callback `Function` is called on status 200 (i.e. success callback).

	### response ###

	- The response is available to the callback function as `this`.
	- The response is not passed into the callback.
	- `this.reponseText` will have the resulting data from the file.

	### example ###

		x$('#status').xhr('inner', '/status.html');
		x$('#status').xhr('outer', '/status.html');
		x$('#status').xhr('top',   '/status.html');
		x$('#status').xhr('bottom','/status.html');
		x$('#status').xhr('before','/status.html');
		x$('#status').xhr('after', '/status.html');

	or

		// same as using 'inner'
		x$('#status').xhr('/status.html');

		// define a callback and enable async execution
		x$('#left-panel').xhr('/panel', {
		    async: true,
		    callback: function() {
		        alert("The response is " + this.responseText);
		    }
		});

		// define a callback with the shorthand syntax
		x$('#left-panel').xhr('/panel', function() {
		    alert("The response is " + this.responseText);
		});
*/
    xhr:function(location, url, options) {

      // this is to keep support for the old syntax (easy as that)
		if (!/^(inner|outer|top|bottom|before|after)$/.test(location)) {
            options = url;
            url = location;
            location = 'inner';
        }

        var o = options ? options : {};
        
        if (typeof options == "function") {
            // FIXME kill the console logging
            // console.log('we been passed a func ' + options);
            // console.log(this);
            o = {};
            o.callback = options;
        };
        
        var that   = this,
            req    = new XMLHttpRequest(),
            method = o.method || 'get',
            async  = (typeof o.async != 'undefined'?o.async:true),           
            params = o.data || null,
            i = 0;

        req.queryString = params;
        req.open(method, url, async);

        if (o.headers) {
            for (; i<o.headers.length; i++) {
              req.setRequestHeader(o.headers[i].name, o.headers[i].value);
            }
        }

        req.handleResp = (o.callback != null) ? o.callback : function() { that.html(location, req.responseText); };
        req.handleError = (o.error && typeof o.error == 'function') ? o.error : function () {};
        function hdl(){ 
            if(req.readyState==4) {
                delete(that.xmlHttpRequest);
                if(req.status===0 || req.status==200) req.handleResp(); 
                if((/^[45]/).test(req.status)) req.handleError();
            }
        }
        if(async) {
            req.onreadystatechange = hdl;
            this.xmlHttpRequest = req;
        }
        req.send(params);
        if(!async) hdl();

        return this;
    }
});