// add the requiered modules 
var express = require('express');
var http = require('http');
var io = require('socket.io');
const superagent = require('superagent');
 
//Specifying the public folder of the server to make the html accesible using the static middleware 
var app = express();
app.use(express.static('./public'));
 
//Server listens on the port 8124
var server =http.createServer(app).listen(8124);
/*initializing the websockets communication , server instance has to be sent as the argument */
io = io.listen(server); 
 
io.sockets.on("connection",(socket)=>{
  getData({}).then((data)=>{
    socket.send(data);
  }).catch((err)=>console.log(err));
  socket.on("message",(data)=>{
      getData(JSON.parse(data)).then((data)=>{
        socket.send(data);
      }).catch((err)=>console.log(err));
    /*Sending the Acknowledgement back to the client , this will trigger "message" event on the clients side*/
  }); 
});

/**
 * declare async function to return the data
 * 
 * @param {string} subQueryObj 
 * @returns {Promise<any>}
 */
function getData(subQueryObj){
  // decalre 
  let mainQueryParam={
    scenario:'deal-finder',
     page:'foo',
     uid:'foo',
     productType:'Hotel'
    };
    // Assign the sub query to the main query object
    Object.assign(mainQueryParam, subQueryObj);
  return new Promise((resolve,reject)=>{
    superagent.get(`https://offersvc.expedia.com/offers/v2/getOffers?`).set('Content-Type', 'application/json')
    .query(mainQueryParam)
    .end((err, res) => {
      if (err) { 
        reject(err); 
      }
      resolve(res.text);
    });
  })

}


