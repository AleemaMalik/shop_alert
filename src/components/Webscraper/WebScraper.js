const axios = require("axios");
const cheerio = require("cheerio");

class WebScraper {
  //html element locators
  #amazonElementLocators;
  #amazonSearchElementLocators;
  #ebayElementLocators;
  #ebaySearchElementLocators;
  #walmartElementLocators;
  //mapping of supported domains to domain currency
  #supportedDomains;
  //mapping of supported websites to private method to get info
  #supportedWebsites;
  //the User Agent String
  #userAgent;

  constructor() {
    this.#amazonElementLocators = {
      ca: {
        price: [["#corePrice_feature_div"], ["div"], ["span"], [".a-offscreen"]],
        imageURL: [["#landingImage"]],
        name: [["#productTitle"]],
        availability: [["#availability"], ["span"]],
        productID: [["#ASIN"]],
        options: {
          outerDiv: [["#twister"], ["div"]],
          dropdownLabel: [['div[class*="a-row"]'], ["label"]],
          dropdownValues: [['span[class*="dropdown"]'], ['span[class*="dropdown"]'], ['select[class*="dropdown"]'], ['option[class*="dropdown"]']],
          rowLabel: [['div[class*="a-row"]'], ["label"]],
          rowValues: [["ul"], ["li"]],
        },
      },
    };
    this.#amazonSearchElementLocators = {
      ca: {
        outerDiv: ['div[data-component-type="s-search-result"]'],
        name: [[".a-color-base", ".a-text-normal"]],
        price: [[".a-price"], [".a-offscreen"]],
        imageURL: [["img"]],
        itemURL: [['span[data-component-type="s-product-image"]'], ["a"]],
      },
    };
    this.#ebayElementLocators = {
      ca: {
        price: [["#convbidPrice"]],
        priceAlt: [['span[itemprop="price"]']],
        imageURL: [["#icImg"]],
        name: [['div[class*="x-item-title"]'], ["h1"], ["span"]],
        availability: [["#qtySubTxt"]],
        productID: [["#descItemNumber"]],
      },
    };
    this.#ebaySearchElementLocators = {
      ca: {
        outerDiv: [[".srp-results"], ["li"]],
        itemURL: [["a"]],
        name: [[".s-item__title"]],
        price: [['span[class*="s-item__price"]']],
        imageURL: [["img"]],
      },
    };
    this.#supportedDomains = { ca: "CAD", com: "USD" };
    this.#supportedWebsites = {
      amazon: { itemInfo: this.#getAmazonItemInfo, searchInfo: this.#getAmazonSearchInfo },
      ebay: { itemInfo: this.#getEbayItemInfo, searchInfo: this.#getEbaySearchInfo },
      walmart: { itemInfo: this.#getWalmartItemInfo, searchInfo: this.#getWalmartSearchInfo },
    };
    this.#userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36";
  }

  //helper function for traversing html elements with a Cheerio loader
  #getElementWithLoader(loader, pathList) {
    let currentElement = loader(...pathList[0]);
    for (let i = 1; i < pathList.length; i++) {
      currentElement = currentElement.children(...pathList[i]);
    }
    return currentElement;
  }

  //helper function for traversing html elements from a starting point
  #getElementFromStart(start, pathList) {
    let currentNode = start;
    for (let i = 0; i < pathList.length; i++) {
      currentNode = currentNode.children(...pathList[i]);
    }
    return currentNode;
  }

  #getAmazonItemName(loader, domain) {
    const node = this.#getElementWithLoader(loader, this.#amazonElementLocators[domain].name);
    const itemName = node.html();
    if (itemName == null) {
      return "Name not found";
    }
    //remove any leading or ending white space before returning the item name
    return itemName.trim();
  }

  #getAmazonItemImageURL(loader, domain) {
    const node = this.#getElementWithLoader(loader, this.#amazonElementLocators[domain].imageURL);
    const imageURL = node.attr("src");
    if (imageURL == null) {
      return "Image URL not found";
    }
    return imageURL;
  }

  #getAmazonItemPrice(loader, domain) {
    const node = this.#getElementWithLoader(loader, this.#amazonElementLocators[domain].price);
    let amount = node.html();
    if (amount == null) {
      amount = "Price not found";
    }
    return { amount: amount, currency: this.#supportedDomains[domain] };
  }

  #getAmazonItemStock(loader, domain) {
    const node = this.#getElementWithLoader(loader, this.#amazonElementLocators[domain].availability);
    const availability = node.html();
    if (availability != null && availability.toLowerCase().includes("in stock")) {
      return true;
    }
    return false;
  }
  #getAmazonProductID(loader, domain) {
    const node = this.#getElementWithLoader(loader, this.#amazonElementLocators[domain].productID);
    let productID = node.attr("value");
    if (productID == null) {
      return "ProductID not found";
    }
    return productID.trim();
  }
  #getAmazonItemOptions(loader, domain) {
    //get the outer divs containing the available options (outer divs may contain dropdowns or row selection)
    let options = {};
    let node = this.#getElementWithLoader(loader, this.#amazonElementLocators[domain].options.outerDiv);
    //create a list where each element is a div containing a set of options
    const numOptions = node.length;
    let optionsArray = [];
    let currentOption = node.first();
    optionsArray.push(currentOption);
    for (let i = 1; i < numOptions; i++) {
      currentOption = currentOption.next();
      optionsArray.push(currentOption);
    }

    for (let i = 0; i < numOptions; i++) {
      if (optionsArray[i].attr("class").toLowerCase().includes("dropdown")) {
        //if options are in a dropdown format
        //get the option label
        let labelNode = this.#getElementFromStart(optionsArray[i], this.#amazonElementLocators[domain].options.dropdownLabel);
        const label = labelNode.text();
        if (label == null || label == "") {
          continue;
        }
        //populate the label object with <option value: Product ID> pairs
        let optionsNode = this.#getElementFromStart(optionsArray[i], this.#amazonElementLocators[domain].options.dropdownValues);
        if (optionsNode == null) {
          continue;
        }
        options[label] = {};
        let option = optionsNode.first();
        const numOptionValues = optionsNode.length;
        for (let j = 0; j < numOptionValues; j++) {
          let optionName = option.text().trim();
          //the productID will look like: '5,B092SG8Q23', we want the value after comma
          let optionProductID = option.attr("value").split(",").at(-1);
          options[label][optionName] = optionProductID;
          option = option.next();
        }
      } else {
        //if not dropdown, must be row options
        //get the option label
        let labelNode = this.#getElementFromStart(optionsArray[i], this.#amazonElementLocators[domain].options.rowLabel);
        if (labelNode == null) {
          continue;
        }
        const label = labelNode.text().trim();
        //populate the label object with <option value: Product ID> pairs
        let optionsNode = this.#getElementFromStart(optionsArray[i], this.#amazonElementLocators[domain].options.rowValues);
        if (optionsNode == null) {
          continue;
        }
        options[label] = {};
        let option = optionsNode.first();
        const numOptionValues = optionsNode.length;
        for (let j = 0; j < numOptionValues; j++) {
          //option names will look like "Click to select <option>", we just want the option
          let optionName = option.attr("title").toLowerCase().replace("click to select ", "");
          let optionProductID = option.attr("data-defaultAsin");
          options[label][optionName] = optionProductID;
          option = option.next();
        }
      }
    }

    return options;
  }
  #getAmazonItemInfo(self, loader, domain) {
    let info = {};
    info["site"] = "amazon." + domain;
    info["price"] = self.#getAmazonItemPrice(loader, domain);
    info["imageURL"] = self.#getAmazonItemImageURL(loader, domain);
    info["name"] = self.#getAmazonItemName(loader, domain);
    info["stock"] = self.#getAmazonItemStock(loader, domain);
    info["productID"] = self.#getAmazonProductID(loader, domain);
    info["options"] = self.#getAmazonItemOptions(loader, domain);
    return info;
  }

  #getAmazonSearchInfo(self, html, domain) {
    //load the HTML into a cheerio loader object
    const loader = cheerio.load(html, {
      xml: {
        normalizeWhitespace: true,
      },
    });

    let info = [];
    const numItems = loader(...self.#amazonSearchElementLocators[domain].outerDiv).length;

    //each search result item will be contained in a div element. Iterate through each of these divs in a for loop
    let current = loader(...self.#amazonSearchElementLocators[domain].outerDiv).first();
    for (let i = 0; i < numItems; i++) {
      let currentItemInfo = {};
      //get the productID of the item
      currentItemInfo["productID"] = current.attr("data-asin");
      // if the productID was not found, skip this item
      if (currentItemInfo["productID"] == "") {
        current = current.next();
        continue;
      }

      const currentItemLoader = cheerio.load(current.html(), {
        xml: {
          normalizeWhitespace: true,
        },
      });
      //get the product name
      currentItemInfo["name"] = self.#getElementWithLoader(currentItemLoader, self.#amazonSearchElementLocators[domain].name).text();
      //get the product price
      currentItemInfo["price"] = self.#getElementWithLoader(currentItemLoader, self.#amazonSearchElementLocators[domain].price).html();
      //get the image URL
      currentItemInfo["imageURL"] = self.#getElementWithLoader(currentItemLoader, self.#amazonSearchElementLocators[domain].imageURL).attr("src");
      //get the URL of the item
      const relativeURL = self.#getElementWithLoader(currentItemLoader, self.#amazonSearchElementLocators[domain].itemURL).attr("href");
      currentItemInfo["URL"] = "https://www.amazon." + domain + relativeURL;

      current = current.next();
      info.push(currentItemInfo);
    }

    return info;
  }

  #getEbayItemPrice(loader, domain) {
    let node = this.#getElementWithLoader(loader, this.#ebayElementLocators[domain].price);
    let price = node.text();
    if (price == "") {
      node = this.#getElementWithLoader(loader, this.#ebayElementLocators[domain].priceAlt);
      price = node.attr("content");
    } else {
      //need to extract the number only from the string
      price = price.match(/\d+/g).join(".");
    }
    return { amount: price, currency: this.#supportedDomains[domain] };
  }

  #getEbayItemImageURL(loader, domain) {
    const node = this.#getElementWithLoader(loader, this.#ebayElementLocators[domain].imageURL);
    // console.log(node.html());
    const imageURL = node.attr("src");
    return imageURL;
  }

  #getEbayItemName(loader, domain) {
    const node = this.#getElementWithLoader(loader, this.#ebayElementLocators[domain].name);
    const name = node.text();
    return name;
  }

  #getEbayItemStock(loader, domain) {
    const node = this.#getElementWithLoader(loader, this.#ebayElementLocators[domain].availability);
    const availability = node.text();
    //check if the availability string contains a number, or has substring "one left" indicating that item is in stock
    if (availability.toLowerCase().includes("last one") || /\d/.test(availability)) {
      return true;
    }
    return false;
  }
  #getEbayProductID(loader, domain) {
    const node = this.#getElementWithLoader(loader, this.#ebayElementLocators[domain].productID);
    const productID = node.text();
    return productID;
  }

  #getEbayItemInfo(self, loader, domain) {
    let info = {};
    info["site"] = "ebay." + domain;
    info["price"] = self.#getEbayItemPrice(loader, domain);
    info["imageURL"] = self.#getEbayItemImageURL(loader, domain);
    info["name"] = self.#getEbayItemName(loader, domain);
    info["stock"] = self.#getEbayItemStock(loader, domain);
    info["productID"] = self.#getEbayProductID(loader, domain);
    info["options"] = {};
    return info;
  }

  #getEbaySearchInfo(self, html, domain) {
    //load the HTML into a cheerio loader object
    const loader = cheerio.load(html, {
      xml: {
        normalizeWhitespace: true,
      },
    });

    let info = [];
    const searchResults = self.#getElementWithLoader(loader, self.#ebaySearchElementLocators[domain].outerDiv);
    const numItems = searchResults.length;

    let current = searchResults.first();

    for (let i = 0; i < numItems; i++) {
      if (current[0].name != "li") {
        current = current.next();
        continue;
      }

      let currentItemInfo = {};

      const currentItemLoader = cheerio.load(current.html(), {
        xml: {
          normalizeWhitespace: true,
        },
      });

      //get the URL of the item
      currentItemInfo["URL"] = self.#getElementWithLoader(currentItemLoader, self.#ebaySearchElementLocators[domain].itemURL).attr("href");

      //get the productID of the item from the URL iteself
      currentItemInfo["productID"] = currentItemInfo["URL"].match(/\d+/g)[0];

      //get the item name
      currentItemInfo["name"] = self.#getElementWithLoader(currentItemLoader, self.#ebaySearchElementLocators[domain].name).text();

      //get the item price
      currentItemInfo["price"] = self.#getElementWithLoader(currentItemLoader, self.#ebaySearchElementLocators[domain].price).text().match(/\d+/g).join(".");

      //get the item image URL
      currentItemInfo["imageURL"] = self.#getElementWithLoader(currentItemLoader, self.#ebaySearchElementLocators[domain].imageURL).attr("src");

      current = current.next();
      info.push(currentItemInfo);
    }

    return info;
  }

  #getWalmartItemInfo(self, loader, domain) {}

  #getWalmartSearchInfo(self, html, domain) {}

  async getInfoFromURL(url) {
    const { data } = await axios.get(url, {
      headers: {
        "Accept-Encoding": "gzip, deflate, br",
      },
    });
    const loader = cheerio.load(data, {
      xml: {
        normalizeWhitespace: true,
      },
    });

    let site;
    let domain;
    [, , site, domain] = url.split(/[/. ]+/);
    if (!(site in this.#supportedWebsites)) {
      return {};
    }
    if (!(domain in this.#supportedDomains)) {
      return {};
    }
    let info = this.#supportedWebsites[site].itemInfo(this, loader, domain);
    info["URL"] = url;
    return info;
  }
  async getInfoFromItemID(productID, ecommerceSite) {
    //ecommerceSite must be a string of the form <site>.<domain> e.g amazon.ca
    const site = ecommerceSite.split(".")[0];
    const domain = ecommerceSite.split(".")[1];
    let URL = "";
    if (site == "amazon") {
      if (domain == "ca") {
        URL = `https://www.amazon.ca/dp/${productID}?th=1&psc=1=`;
      }
    }
    const info = await this.getInfoFromURL(URL);
    return info;
  }
  async getItemsFromSearch(searchString, ecommerceSite) {
    //ecommerceSite must be a string of the form <site>.<domain> e.g amazon.ca
    const site = ecommerceSite.split(".")[0];
    const domain = ecommerceSite.split(".")[1];
    let URL = "";
    if (site == "amazon") {
      if (domain == "ca") {
        URL = `https://www.amazon.ca/s?k=${encodeURIComponent(searchString)}`;
      }
    }
    if (site == "ebay") {
      if (domain == "ca") {
        URL = `https://www.ebay.ca/sch/i.html?_nkw=${encodeURIComponent(searchString)}`;
      }
    }

    //get the HTML contents of the webpage corresponding to the URL
    const { data } = await axios.get(URL, {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
      },
    });

    //call the corresponding private class method to get the list of search items and their info
    const searchList = this.#supportedWebsites[site].searchInfo(this, data, domain);
    return searchList;
  }
}

export default WebScraper;
