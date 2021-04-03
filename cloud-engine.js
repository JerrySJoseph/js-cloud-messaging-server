const deviceConnection = require("./connections/client-connection");

const users = {};

const initEngine = (app, PORT) => {
  return new Promise((resolve, reject) => {
    deviceConnection.initConnection(app, PORT).then((io) => {
        registerEvents(io);
        resolve(io);
    }).catch(err=>reject(err));
  });
};

function registerEvents(io) {

  //To listen to messages
  io.on("connection", (socket) => {

    let clientID = null;
    console.log("connected to socket " + socket.id);
    
    socket.on("disconnect", () => {
      console.log("Disconnected");
      if (clientID != null) users[clientID] = null;
      console.log(users);
    });
    
    socket.on("message", (msg) => console.log(msg));
    
    socket.on("client-handshake", (client, ack) => {
      console.log("handshake-recieved");
      client = JSON.parse(client);
      clientID = client.clientID;
      users[client.clientID] = socket.id;
      console.log("active users are:");
      console.log(users);
      ack("OK");
    });
    
    socket.on("comand", (cmd, ack) => {
      console.log("command-recieved");
      console.log(cmd);
      ack("OK");
    });

    console.log("user connected");
  });
}

const notifyUser = (io,uid, title, content) => {
  return new Promise((resolve, reject) => {
    try {
      io.to(users[uid]).emit("cloud-event-push", title, content);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

const send=(io,uid,eventName,...args)=>{
  return new Promise((resolve, reject) => {
    try {
      io.to(users[uid]).emit(eventName,args);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}

const notifyAll = (io, title, content) => {
  return new Promise((resolve, reject) => {
    try {
      io.emit("cloud-event-push", title, content);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { initEngine, send, notifyUser, notifyAll };