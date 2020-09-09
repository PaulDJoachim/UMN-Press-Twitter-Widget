import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";


function* getTweets(action) {
  try {
    yield console.log(action.payload);
    let searchAmount = action.limit 
    // if the user has set the search limit to be greater than the total amount of publications
    // change the search limit to match the total amount of publications
    if (action.limit > action.payload.length) {
      searchAmount = action.payload.length
    }
    for (let i=0; i<searchAmount; i++){
      // check if the publication has include value of true
      if (action.payload[i].include){
        //hit Twitter Recent Search API with publication title, replace problem characters with "*" aka the "wild card" character
        //then normalize to replace å/a,ö/o, etc.
        // console.log('this is the API query', action.payload[i].title.replace(/["&;#^%[\|{}]/g,'*').replace(/]/g,'*').normalize('NFKD').replace(/[^\w\s.-_\*/']/g, ''));
        // let str= "['&;#^%[\|/{}]";
        // console.log('this is the normalize test', str.replace(/["&;#^%[\|/{}]/g,'*').replace(/]/g,'*').normalize('NFKD').replace(/[^\w\s.-_\*/']/g, ''));

        const response = yield axios.get('/tweets/twitter/' + action.payload[i].title.replace(/["&;#^%[\|/{}]/g,'*').replace(/]/g,'*').normalize('NFKD').replace(/[^\w\s.-_\*/']/g, ''))
        // send the response(tweet id) and the publication object from database to the save saga
        // save the tweet ids to the tweet table of the database
        yield put({
          type: "SAVE_TWEETS",
          payload: {
            tweetArray: response.data.body,
            publicationId: action.payload[i].id,
          },
        });
        // save the API rate info to the user table of the database
        yield put({
          type: "SAVE_RATE_DATA",
          payload: {
            rateLimit: response.data.header['x-rate-limit-limit'],
            rateLimitRemaining: response.data.header['x-rate-limit-remaining'],
            rateLimitReset: response.data.header['x-rate-limit-reset'],
            userId: action.userId
          }
        });
        // console.log(response)
        console.log("sending this to save tweet saga:", response.data.data);
        // update the last_searched timestamp of each publication
        yield axios.put('/publications/timestamp/' + action.payload[i].id )
      }    
      // update the user redux store with the new rate data
      yield put({ type: "FETCH_USER" });
      // update the publication redx store with new last_searched times
      yield put({ type: 'FETCH_PUBLICATIONS'})
    }
  } catch (error) {
    console.log("error with getting tweets", error);
  }
}

// gets all saved Tweets from Tweet table
function* getDbTweets(action){
  try {
    const response = yield axios.get("/tweets/database/");
    // send the response(tweet id) and the publication object from database to the save saga
    yield put({ type: "STORE_ALL_TWEETS", payload: response.data });
    console.log("sending this to tweet reducer:", response.data);
  } catch (error) {
    console.log("error with getting tweets", error);
  }
}


function onlyRetweets(tweet){  //check if tweet is only retweets
  // console.log('this is tweet id', tweet.id);
  // console.log('this is referenced tweets', tweet.referenced_tweets);
  if(tweet.hasOwnProperty('referenced_tweets')){
      for(let j=0;j<tweet.referenced_tweets.length;j++){
        // console.log('this is the ref tweets type',tweet.referenced_tweets[j].type);
          if(tweet.referenced_tweets[j].type==='quoted'||tweet.referenced_tweets[j].type==='replied_to'){
            return false;
          }
      }
      return true;
    }else{
      return false;
  }
}//end onlyRetweets



// posts Tweets to Tweet table 
function* saveTweets(action){
  try {
    let tweets = action.payload.tweetArray;
    yield console.log(action.payload);
  // filter undefined results (no results from search)
    if (tweets !== undefined){
       // take each tweet id from the publicaiton search and save to database with associated publication id
      for (let tweet of tweets) {
        const tweetId = tweet.id;
        const publicationId = action.payload.publicationId;
        //filter out sensitive tweets and retweets
        if(tweet.possibly_sensitive===false&&!onlyRetweets(tweet)){ 
          console.log("sending these to tweet save route:", {
            tweetId: tweetId,
            publicationId: publicationId,
          });
          yield axios.post("/tweets/database", {
            tweetId: tweetId,
            publicationId: publicationId,
          });
        }
      }
    }
  } catch (error) {
    console.log("error with tweet save route", error);
  }
}


function* approveTweet(action){
  try {
    const response = yield axios.put('/tweets/database/approve', {id: action.payload})
  } catch (error) {
      console.log('error with approving tweet', error);
  }
}

function* rejectTweet(action){
  try {
    const response = yield axios.put('/tweets/database/reject', {id: action.payload})
  } catch (error) {
      console.log('error with rejecting tweet', error);
  }
}

function* tweetSaga() {  
  yield takeLatest('FETCH_TWEETS', getTweets);
  yield takeLatest('FETCH_DATABASE_TWEETS', getDbTweets);
  yield takeLatest('SAVE_TWEETS', saveTweets);
  yield takeLatest('APPROVE_TWEET', approveTweet);
  yield takeLatest('REJECT_TWEET', rejectTweet);
}

export default tweetSaga;
