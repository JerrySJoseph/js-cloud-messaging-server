//import required dependencies
const express = require("express");
const cloudEngine=require("./cloud-engine");

let cloud; 

//Assigning port
const REQ_PORT = process.env.PORT || 3000;
const SOCKET_PORT = 3001;

//Initialising express app
const app = express();

//enable json in request
app.use(express.json());

//Registering all queues
async function registerRoutesAndStartListening() {

  cloud = await cloudEngine.initEngine(app, SOCKET_PORT);
  
  app.post('/send-push',(req,res)=>{
      cloudEngine.notifyUser(cloud, "68570763210eabbb","Push Notification","This is notification");
  })
  app.post("/send-message", (req, res) => {
   cloudEngine.send(cloud, "68570763210eabbb", "Message", "Hi advanced, this is a send message");
 });
  app.post("/notifyall", (req, res) => {
    cloudEngine.notifyAll(cloud, "Hi", "Advanced");
  });
  app.listen(REQ_PORT, () =>
    console.log("CM Server is listening on localhost:" + REQ_PORT)
  );
}

registerRoutesAndStartListening();