module.exports = {
	'Initial result; updated result' : function(browser) {
		// initial
		browser.url("file://"+__dirname+"/../example/index.html")
			.waitForElementVisible('#result', 1000)
			.expect.element("#result").text.to.equal("3");
		browser.expect.element("#count").text.to.equal("1");

		// updated
		browser.setValue("#a", [browser.Keys.BACK_SPACE, 8])
			.pause(100)
			.waitForElementVisible('#result', 1000)
			.expect.element("#result").text.to.equal("10");
		browser.expect.element("#first_result").text.to.equal("3");
		browser.expect.element("#count").text.to.equal("2");
		browser.end();
	}
}
