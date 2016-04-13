(function () {
	function addRedirectButton(url) {
		var anchor = document.createElement("a");
		anchor.href = url;
		anchor.textContent = "Go to English version";
		anchor.style.position = "fixed";
		anchor.style.top = "0";
		anchor.style.right = "0";
		anchor.style.background = "red";
		anchor.style.zIndex = "99999999";
		anchor.style.padding = "20px";
		document.body.appendChild(anchor);
	}

	function testAndAddRedirectButton(url) {
		// this should work when the domain is the same (toto.com/en)
		// but not when the language is part of the domain (en.toto.com)
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 3) {
				if (xhr.status >= 200 && xhr.status < 300) {
					console.debug("Redirecting to " + url);
					addRedirectButton(url);
					//window.location = url;
				} else {
					console.debug("Page " + url + " not found");
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(null);
	}

	function areEqualsIgnoreCase(a, b) {
		return a && b && a.toLowerCase() === b.toLowerCase()
	}

	function handleMsdn(href) {
		// Change language and remove version
		return href.replace(/(.*msdn\.microsoft\.com\/)([a-z]{2}-[a-z]{2})(.*)(\(v=.*\))(\.aspx.*)/i, "$1en-us$3$5");
	}
	
	function handleMdn(href) {
		// https://developer.mozilla.org/fr/docs/Web/HTML/Element/area
		return href.replace(/(.*developer.mozilla.org\/)(?:[a-zA-Z]{2}(?:-[a-zA-Z]{2})?)(\/docs\/.*)/i, "$1en$2");
	}

	var handlers = [
		handleMsdn,
		handleMdn
	];

	var href = window.location.href;
	for (var i = 0; i < handlers.length; i++) {
		var handler = handlers[i];
		var result = handler(href);
				
		if(typeof result === "boolean" && result === true) {
			window.location.reload(false);
			return;
		}
		
		if (!areEqualsIgnoreCase(href, result)) {
			addRedirectButton(result);
			return;
		}
	}
})();