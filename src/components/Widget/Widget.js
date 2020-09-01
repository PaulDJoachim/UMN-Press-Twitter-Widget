import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { connect } from 'react-redux';
import { withRouter } from "react-router";



const Widget = () => {


function fetchTweets() {

    //pull out url into variable to be easily swapped out

    fetch('/api/tweets/'+ window.location.href.replace('http://localhost:3000/#/books/',''),
    { method: 'GET',
      mode: 'no-cors',
                      }
    ).then( response => response.json()
    
    ).then(data=> {
        console.log('tweet ids:',data);

        for(let i=0;i<data.length;i++){
            console.log('tweet id', data[i].tweet_id);
            
            fetch('/api/tweets/'+ window.location.href.replace('http://localhost:3000/#/books/','') + '/' +data[i].tweet_id,
            { method: 'GET',
            mode: 'no-cors',
                            }

            ).then(response=> response.text()
            
            ).then(html => {console.log('this is the tweet html', html)

                let tweetContainer = document.getElementById('viewTweets');
                console.log(tweetContainer);

                let tweetDiv = document.createElement('div');
                console.log(html);

                tweetDiv.innerHTML = html;
                // console.log(tweetLi);
                tweetContainer.append(tweetDiv);

            })

        }}
            ).catch((error) => {console.error('Error fetching embed html', error);}
    
    ).catch( error => console.error('Error fetching tweet ID', error) )

    }
// function fetchEmbedTweets(data) {
//     console.log('this is the data', data);
    
//     for (let i=0; i<data.length; i++){

//         console.log('this is the tweet_id', data[i].tweet_id);

//         fetch('https://publish.twitter.com/oembed?url=https://twitter.com/anyuser/status/'+ data[i].tweet_id,
//         {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer AAAAAAAAAAAAAAAAAAAAALo%2FHAEAAAAADac6xyDfgK5%2F8F%2FOuotBdu5ScAQ%3D9KfnjQfZnNeDoS7yHkm9IKV833yOTRGNLFalNxa4aNHIpH0YDw`
//                 },
//             mode: 'no-cors',
//           })
//           .then(response => response.json())

//           .then(json => console.log(json))


//           .catch( error => console.error('error:', error))
//     }
 
// }

 fetchTweets()

 return <div id="viewTweets"></div>

}
  
export default connect()(Widget);


   