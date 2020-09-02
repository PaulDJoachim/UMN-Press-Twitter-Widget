import { combineReducers } from 'redux';
import errors from './errorsReducer';
import loginMode from './loginModeReducer';
import user from './userReducer';
import selectTweetID from './tweetidReducer'
import csvReducer from "./csvReducer";
import publication from './publicationReducer';
import tweets from './tweetsReducer';
import dbTweets from './dbTweetReducer';



// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  loginMode, // will have a value of 'login' or 'registration' to control which screen is shown
  user, // will have an id and username if someone is logged in
  selectTweetID,
  csvReducer,
  publication, // contains all publications from database 'publication' table
  tweets, // contains tweets returned from Axios request to Twitter API
  dbTweets, // contains all tweets pulled from local database "tweet" table
});

export default rootReducer;
