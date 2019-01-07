App = {
     web3Provider: null,
     contracts: {},
     //address van de account by default
     account:0x0,
     loading: false,

     init: function() {
        //load articlesRow
        // Hardcode
        /*
        var articlesRow = $('#articlesRow');
        var articleTemplate = $('#articleTemplate');

        articleTemplate.find('.panel-title').text('article 1');
        articleTemplate.find('.article-description').text('description for article 1');
        articleTemplate.find('.article-price').text("10.23");
        articleTemplate.find('.article-seller').text("0x12345678901234567890");

        articlesRow.append(articleTemplate.html());
        */


        return App.initWeb3();
     },

     initWeb3: function() {
          //initialize web 3
          if(typeof web3 !== 'undefined'){
            //reuse the provider of the web3 object injected by Metamask (gebruik Metamask)
            App.web3Provider = web3.currentProvider;
          } else {
            //create a new provider and plug it directly into our local node (bijvoorbeeld wanneer metamosk niet geinstalleerd is)
            // in ons geval is het de running instance van Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
          }
          //instanciate een nieuw web3 object met de bovenstaande geinstantieerde provider
          web3 = new Web3(App.web3Provider);
          //
          App.displayAccountInfo();

          return App.initContract();
     },

     displayAccountInfo: function(){
       //console.log(web3.eth.accounts);
       //getCoinBase is een async function met callback
       web3.eth.getCoinbase(function(err, account){
         //wanneer er geen error is
         if (err === null){
           //account wordt helemaal bovenaan geinitialiseerd
           App.account = account;
           //display in page
           $('#account').text(account);
           //callback function
           web3.eth.getBalance(account, function(err, balance){
             if (err === null){
               //display in page
               $('#accountBalance').text(web3.fromWei(balance, "ether")+ " ETH");
             }
           })
         }
       });
     },

     initContract: function() {
      //Jquery ajax call (async)
      $.getJSON('ChainList.json', function(chainListArtifact){
        //get the contract artifact file and use it to instantiate a truffle contract abstaction
        //(in voorgaande voorbeelden deed truffle deze stap)
        //voeg een nieuw veld ChainList to aan het javascript object
        App.contracts.ChainList = TruffleContract(chainListArtifact);
        //connect contract with providers
        App.contracts.ChainList.setProvider(App.web3Provider);
        //listen to events
        App.listenToEvents();

        //retrieve the article form the contract
        return App.reloadArticles();
      });
     },

     reloadArticles: function(){
        //avoid reentry
        if(App.loading){
          return;
        }
       App.loading = true;

        //refresh account information because the balance might have changed
        App.displayAccountInfo();

        var chainListInstance;

        //get een instance van ons deployed contract
        App.contracts.ChainList.deployed().then(function(instance){
          chainListInstance = instance;
          return chainListInstance.getArticlesForSale();
        }).then (function(articleIds){

        //retrieve the aritcle placeholder and clear it (gebruik maken van jQuery)
        $('#articlesRow').empty();

        //iterate over articleIds
        for(var i=0;i< articleIds.length; i++){
          var articleId = articleIds[i];
          chainListInstance.articles(articleId.toNumber()).then(function(article){
            App.displayArticle(article[0], article[1], article[3], article[4], article[5]);
          });
        }

        App.loading = false;

          /*  OUDE code
          var price = web3.fromWei(article[4],"ether");

          //retrieve the article template and fill interval
          var articleTemplate = $('#articleTemplate');
          articleTemplate.find('.panel-title').text(article[2]);
          articleTemplate.find('.article-description').text(article[3]);
          articleTemplate.find('.article-price').text(price);
          articleTemplate.find('.btn-buy').attr('data-value',price);

          var seller = article[0];
          if (seller == App.account){
            seller = "You";
          }

          articleTemplate.find('.article-seller').text(seller);

          //buyer
          var buyer = article[1];
          if (buyer == App.account){
            buyer = "You";
          } else if (buyer == 0x0){
            buyer = "No one yet";
          }

          articleTemplate.find('.article-buyer').text(buyer);

          //hide button
          if(article[0]==App.account || article[1]!=0x0){
            articleTemplate.find('.btn-buy').hide();
          } else {
            articleTemplate.find('.btn-buy').show();
          }

          //add this article
          $('#articlesRow').append(articleTemplate.html());*/
        }).catch(function(err){
          console.error(err.message);
          App.loading = false;
        });

     },

     displayArticle: function(id, seller, name, description, price){
       var articlesRow = $('#articlesRow');
       var etherPrice = web3.fromWei(price, "ether");

       var articleTemplate = $("#articleTemplate");
       articleTemplate.find('.panel-title').text(name);
       articleTemplate.find('.article-description').text(description);
       articleTemplate.find('.article-price').text(etherPrice + " ETH");
       articleTemplate.find('.btn-buy').attr('data-id', id);
       articleTemplate.find('.btn-buy').attr('data-value', etherPrice);

       //seller
       if(seller==App.account){
          articleTemplate.find('.article-seller').text("You");
          articleTemplate.find('.btn-buy').hide();
        } else {
          articleTemplate.find('.article-seller').text(seller);
          articleTemplate.find('.btn-buy').show();
        }

        //add this new article
        articlesRow.append(articleTemplate.html());
     },

     sellArticle: function(){
       //retrieve the detail of the article
       var _article_name = $('#article_name').val();
       var _description = $('#article_description').val();
       var _price = web3.toWei(parseFloat($('#article_price').val()||0),"ether");

       if ((_article_name.trim() == '') || (_price == 0)){
         //nothing to sell
         return false;
       }

       App.contracts.ChainList.deployed().then(function(instance){
         return instance.sellArticle(_article_name, _description, _price , {
           from: App.account,
           gas: 500000
         });
       }).then(function(result){
        // App.reloadArticles(); => zit nu in listenToEvents
       }).catch(function(err){
         console.error(err);
       });

     },

     // listen to events triggered by the contract
     listenToEvents: function(){
       App.contracts.ChainList.deployed().then(function(instance){
         instance.LogSellArticle({},{}).watch(function(error, event){
           if(!error){
             $("#events").append('<li class="list-group-item">' + event.args._name + ' is now for sale</li>');
           } else {
             console.error(error);
           }
           App.reloadArticles();
         });

         instance.LogBuyArticle({},{}).watch(function(error, event){
           if(!error){
             $("#events").append('<li class="list-group-item">' + event.args._buyer + ' bought ' + event.args._name +'</li>');
           } else {
             console.error(error);
           }
           App.reloadArticles();
         });
       });
     },

     buyArticle: function(){
       event.preventDefault();

       //retrieve the article price
       var _articleId = $(event.target).data('id');
       var _price = parseFloat($(event.target).data('value'));  //Jquery


       App.contracts.ChainList.deployed().then (function(instance){
         return instance.buyArticle(_articleId , {
           from: App.account,
           value: web3.toWei(_price, "ether"),
           gas: 500000
         });
         }).catch(function(error){
           console.error(error);
       });
      }
};

$(function() {
     $(window).load(function() {
          App.init();
     });
});
