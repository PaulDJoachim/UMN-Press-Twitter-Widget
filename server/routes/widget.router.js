const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {default: axios} = require('axios');
const token = process.env.BEARER_TOKEN;


// gets a tweets for a specific publication
router.get( '/:publication_id', ( req, res )=>{
    pool.query( `SELECT "tweet_id" FROM "tweet" WHERE "publication_id"=$1 AND "approved"=TRUE;`,[req.params.publication_id])
    .then( ( result )=>{
        res.send( result.rows );
    }).catch( ( err )=>{
        res.sendStatus( 500 );
    })
})



// GET Tweet from Twitter Embed API -
// The response is a code block that displays embedded Tweets.
router.get('/:publication_id/:tweet_id', (req, res) => {
    console.log( 'in router /api/tweets GET embed html', req.params );
    axios.get(`https://publish.twitter.com/oembed?url=https://twitter.com/anyuser/status/${req.params.tweet_id}`)
        .then((response)=>{
            console.log('sending back:', response.data.html);
            res.send(response.data.html);
        })
        .catch((error)=>{
            console.log('error with Twitter GET', error);
            res.sendStatus(500);
        });
})


module.exports = router;