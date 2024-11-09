import extractLinks from "../inspect.js";
import assert from "assert";

const html = `
<p> Hello, welcome to our site!</p>
<a href="https://www.google.com">Google</a>
<a href="https://www.bing.com">Bing</a>
<div>
  <a href="https://www.example.com">Example</a>
  <p>This is a paragraph inside a div.</p>
  <a href="https://www.yahoo.com">Yahoo</a>
</div>
<img src="image.jpg" alt="An image" />
<a href="https://www.reddit.com">Reddit</a>
`; // Complex HTML string

describe("extractLinks", function () {
  describe("#indexOf()", function () {
    it("should find specific link", function () {
      const links = extractLinks(html, ["Google", "Yahoo"]);
      console.log(links);

      assert.equal("https://www.google.com", links[0][1]); // Google link
      assert.equal("https://www.yahoo.com", links[1][1]); // Yahoo link
    });

    it("should not return links not included in options", function () {
      // Extract links for 'Google' only
      const links = extractLinks(html, ["Google"]);

      // Assert only 'Google' link is returned
      assert.equal(links.length, 1);
      assert.equal("https://www.google.com", links[0][1]);
    });

    it("should handle HTML with multiple links", function () {
      // Extract all links
      const links = extractLinks(html, [
        "Google",
        "Bing",
        "Reddit",
        "Yahoo",
        "Example",
      ]);
      console.log(links);
      assert.equal(links.length, 5);
      assert.equal("https://www.google.com", links[0][1]);
      assert.equal("https://www.bing.com", links[1][1]);
      assert.equal("https://www.reddit.com", links[4][1]);
      assert.equal("https://www.yahoo.com", links[3][1]);
      assert.equal("https://www.example.com", links[2][1]);
    });
  });
});
