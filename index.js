var Twit = require("twit");

require("dotenv").config();

const realityBot = new Twit({

    consumer_key: process.env.CONSUMER_KEY,  
  
    consumer_secret: process.env.CONSUMER_SECRET,    
    access_token: process.env.ACCESS_TOKEN,  
  
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

function Posting() {

    var postTweet = "Test post!";
    realityBot.post(
       
       'statuses/update', 
       {status: postTweet},
       function(err, data, response) { 
          
          if (err) {
             
             console.log("ERRO: " + err);                    
             return false;
          }
   
          console.log("Tweet postado com sucesso!\n");
       }
    )
}

function Retweet(searchText) {
    // Params to be passed to the 'search/tweets' API endpoint
    let params = {
        q : searchText + '',
        result_type : 'mixed',
        count : 25,
    }

    realityBot.get('search/tweets', params, function(err_search, data_search, response_search){

        let tweets = data_search.statuses
        if (!err_search)
        {
            let tweetIDList = []
            for(let tweet of tweets) {
                tweetIDList.push(tweet.id_str);
            }

            // Call the 'statuses/retweet/:id' API endpoint for retweeting EACH of the tweetID
            for (let tweetID of tweetIDList) {
                realityBot.post('statuses/retweet/:id', {id : tweetID}, function(err_rt, data_rt, response_rt){
                    if(!err_rt){
                        console.log("\n\nRetweet efetuado com sucesso! ID - " + tweetID)
                    }
                    else {
                        console.log("Error = " + err_rt)
                    }
                })
            }
        }
        else {
            console.log("Error na pesquisa" + err_search)
            process.exit(1)
        }
    })
}

setInterval(function() { Retweet('#AFazenda OR #BBB'); }, 60000)
