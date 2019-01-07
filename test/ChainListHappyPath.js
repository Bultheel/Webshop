var ChainList = artifacts.require("./ChainList.sol");

//test suite
contract('ChainList', function(accounts){
  //variables
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName1 = "article 1";
  var articleDescription1 ="Description for article 1";
  var articlePrice1 = 10;
  var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
  var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;
  var articleName2 = "article 2";
  var articleDescription2 ="Description for article 2";
  var articlePrice2 = 20;

  //first test case
  it ("should be initialized with empty values", function(){
    //get an instance of our contract asynchronously with function deployed
    return ChainList.deployed().then(function(instance){
      //when the promise resolves call getArticle function
      //return instance.getArticle();
      chainListInstance = instance
      return chainListInstance.getNumberOfArticles();
    }).then(function(data){
      //assert.equal(waarde, te verwachte waarde, tekst bij het niet gelijk zijn)
      //console.log("data[3]=", data[3]);
      assert.equal(data.toNumber(),0,"numbers of articles must be zero");
      //assert.equal(data[0],0x0, "seller must be empty");
      //assert.equal(data[1],0x0,"buyer must be empty");
      //assert.equal(data[2],"","article name must be empty");
      //assert.equal(data[3],"","article description must be empty");
      //assert.equal(data[4].toNumber(),0,"article price must be zero");
      return chainListInstance.getArticlesForSale();
    }).then (function(data){
      assert.equal(data.length, 0,"there shouldn't be any article for sale");
    });
  });


  // sell a first article
  it("should let us sell a first article", function() {
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.sellArticle(
        articleName1,
        articleDescription1,
        web3.toWei(articlePrice1, "ether"),
        {from: seller}
      );
    }).then(function(receipt){
      // check event
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");

      assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
      assert.equal(receipt.logs[0].args._id.toNumber(), 1, "id must be 1");
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._name, articleName1, "event article name must be " + articleName1);
      assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice1, "ether"), "event article price must be " + web3.toWei(articlePrice1, "ether"));

      return chainListInstance.getNumberOfArticles();
    }).then(function(data) {
      assert.equal(data, 1, "number of articles must be one");

      return chainListInstance.getArticlesForSale();
    }).then(function(data) {
      assert.equal(data.length, 1, "there must be one article for sale");
      assert.equal(data[0].toNumber(), 1, "article id must be 1");

      return chainListInstance.articles(data[0]);

    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "article id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName1, "article name must be " + articleName1);
      assert.equal(data[4], articleDescription1, "article description must be " + articleDescription1);
      assert.equal(data[5].toNumber(), web3.toWei(articlePrice1, "ether"), "article price must be " + web3.toWei(articlePrice1, "ether"));
    });
  });


  // sell a second article
  it("should let us sell a second article", function() {
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.sellArticle(
        articleName2,
        articleDescription2,
        web3.toWei(articlePrice2, "ether"),
        {from: seller}
      );
    }).then(function(receipt){
      // check event
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");

      assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
      assert.equal(receipt.logs[0].args._id.toNumber(), 2, "id must be 2");
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._name, articleName2, "event article name must be " + articleName2);
      assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice2, "ether"), "event article price must be " + web3.toWei(articlePrice2, "ether"));

      return chainListInstance.getNumberOfArticles();
    }).then(function(data) {
      assert.equal(data, 2, "number of articles must be two");

      return chainListInstance.getArticlesForSale();
    }).then(function(data) {
      assert.equal(data.length, 2, "there must be two articles for sale");
      assert.equal(data[1].toNumber(), 2, "article id must be 2");

      return chainListInstance.articles(data[1]);

    }).then(function(data) {
      assert.equal(data[0].toNumber(), 2, "article id must be 2");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName2, "article name must be " + articleName2);
      assert.equal(data[4], articleDescription2, "article description must be " + articleDescription2);
      assert.equal(data[5].toNumber(), web3.toWei(articlePrice2, "ether"), "article price must be " + web3.toWei(articlePrice2, "ether"));
    });
  });


  //second test
  /*
  it("should sell an article", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"), {from: seller})
    }).then(function(){
      return chainListInstance.getArticle();
    }).then(function(data){
      assert.equal(data[0],seller, "seller must be "+ seller);
      assert.equal(data[1],0x0, "Buyer must be empty");
      assert.equal(data[2],articleName,"article name must be " + articleName);
      assert.equal(data[3],articleDescription,"article description must be " + articleDescription);
      assert.equal(data[4].toNumber(),web3.toWei(articlePrice,"ether"),"article price must be " + web3.toWei(articlePrice,"ether"));
    })
  });*/

  //Third test
/*
  it("should trigger an event when a new article is sold", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether" ), {from:seller})
    }).then (function(receipt){
      assert.equal(receipt.logs.length, 1, "one event should have been triggerer");
      assert.equal(receipt.logs[0].event, "LogSellArticle","event should be LogSellArticle");
      assert.equal(receipt.logs[0].args._seller, seller,"event seller should be "+ seller);
      assert.equal(receipt.logs[0].args._name , articleName,"event article name should be "+ articleName);
      assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice, "ether") ,"event article price should be "+  web3.toWei(articlePrice, "ether"));
    });
  });
*/
  //fourth test
  //buy the fist article
  it("should buy an article", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      //record balances of seller and buyer before buy
      sellerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
      buyerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();
      return chainListInstance.buyArticle(1,{
        from: buyer,
        value: web3.toWei(articlePrice1, "ether")
      });
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, "one event should have been triggerer");
      assert.equal(receipt.logs[0].event, "LogBuyArticle","event should be LogBuyArticle");
      assert.equal(receipt.logs[0].args._id.toNumber(), 1, "article id must be 1");
      assert.equal(receipt.logs[0].args._seller, seller,"event seller should be "+ seller);
      assert.equal(receipt.logs[0].args._buyer, buyer,"event seller should be "+ buyer);
      assert.equal(receipt.logs[0].args._name , articleName1,"event article name should be "+ articleName1);
      assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice1, "ether") ,"event article price should be "+  web3.toWei(articlePrice1, "ether"));

      //record balances of buyer and seller after the buy
      sellerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
      buyerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

      //check the effect of the buy on balances of buyer and seller, accounting for gas
      assert(sellerBalanceAfterBuy) == sellerBalanceBeforeBuy +articlePrice1, "seller should have aerned " + articlePrice1 + " ETH"
      assert(buyerBalanceAfterBuy) <= buyerBalanceBeforeBuy -articlePrice1, "buyer should have spent " + articlePrice1 + " ETH"

      return chainListInstance.getArticlesForSale();
    }).then(function(data){
      assert.equal(data.length, 1, "there should now be only 1 article left for sale")
      assert.equal(data[0].toNumber(), 2, "article 2 should be then only article left for sale");
      return chainListInstance.getNumberOfArticles();
    }).then(function(data){
      assert.equal(data.toNumber(), 2, "there should still be 2 articles in total");
    });
  });


});
