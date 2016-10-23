var Util = {
	load: {
		/**
		 * Loads any file and passes the text result to success callback.
		 * If the file cannot be loaded, calls the fail callback.
		 */
		url: function(url, success, fail) {
			var r = new XMLHttpRequest();
			r.addEventListener("readystatechange", function(){
				if (r.readyState === 4) {
					if (r.status === 200) {
						success(r.responseText);
					}
					else {
						fail();
					}
				}
			});
			r.open("GET", url);
			r.send();
		},
		
		/**
		 * Loads a JSON file and passes the parsed result to success callback.
		 * If the file cannot be loaded, calls the fail callback.
		 */
		json: function(url, success, fail) {
			Util.load.url(url+"?"+Math.floor(Math.random()*10000), function s(json){
				json = JSON.parse(json);
				success(json);
			}, function f(){
				fail();
			});
		},

		/**
		 * Loads several scripts sequentially.
		 * Calls progress callback on script load.
		 * Calls complete callback on completion.
		 */
		scripts: function(list, progress, complete) {
			var len = list.length;
			var loadFunction = function(){
				if (list.length === 0) {
					complete();
					return;
				}
				var src = list.shift();
				Util.log("loading "+src+"...");
				var script = document.createElement("script");
				script.addEventListener("load", function(){
					progress(1 - (list.length / len));
					loadFunction();
				});
				script.src = src;
				document.body.appendChild(script);
			};
			loadFunction();
		}
	}
};