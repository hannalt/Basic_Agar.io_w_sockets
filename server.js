//to run node server.js in terminal then go to localhost::3000 
// This server code was created by watching Web Sockets and p5.js Tutoral from The Coding Train on Youtube 

//type = module was messing up require

var blobs = [];

//min must be -max or 0;
//my own random function to create more functionality.
function random(min, max){
    let val = Math.round(Math.random() * max);

    if (min == 0){
        return val;
    } else if (min == 1){
        return val + 1;
    }else {
        if (Math.round(Math.random())) {
            return val;
        } else {
            return -1 * val;
        }
    }

}

//Makes 200 non user blobs that should be the starter food.
for (let i = 0; i < 200; i++) {
    blobs[i] = new Blob(random(-600, 600), random(-600, 600), i, random(1,5), random(0,255), random(0,255), random(0,255), "no user");
}

//defintion of the Blob class for the server
//Name will be the username once I create the backend
function Blob (x, y, id, r, red, green, blue, name) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.r = r;
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.name = name;
}

let express = require('express');
let app = express();

//3000 is the port number
//process.env.PORT --> deploying on heroku (Right now only on local)
let server = app.listen(3000);
app.use(express.static('public'));
let io = require('socket.io')(server);

//This sets how often the server updates all clients abou the active blobs (both user and nonuser)
setInterval(heartbeat, 33)
function heartbeat(){
    io.sockets.emit('heartbeat', blobs);
}

//This sets up what a new connection to a new socket should look like
function newConnection(socket) {
    console.log("new connection: " + socket.id);
    
    //This is recieving the message sent by the client
    //This makes a new blob and puts it at the blobs array
    socket.on('start', 
        function (data) {
            let blob = new Blob(0, 0, socket.id, data.r, data.red, data.green, data.blue, data.name);
            blobs.push(blob);
            // This line would also update the sender client
            // io.socets.emit('mouse', data);
        }
    );

    //This is for when a blob moves. I put the new x,y coordinates into the 
    //correct blob which i find. And I also update the radius. The color, 
    //name and id shouldn't change so I don't need to update them.
    socket.on('update',
        function (data){
            let blob;
            //Make a hash map instead
            for(let i = 0; i < blobs.length; i++) {
                if (socket.id == blobs[i].id) {
                    blob = blobs[i];
                }
            }
            blob.x = data.x;
            blob.y = data.y;
            blob.r = data.r;
        }
    )
    //wrote this entirely on my own!!!!!
    /* *********   THIS DOESN'T SEEM TO BE WORKING. IT WORKS FOR NON SOCKET/USER
    BLOBS BUT NOT USER/SOCKET BLOBS. 
    */
    socket.on('eaten', 
        function(data){
            for(let i = 0; i < blobs.length; i++) {
                if (data.eaten.id == blobs[i].id) {
                    //tell blob it has been eaten 
                    let socket_id;
                    if (!((data.eaten.id >= 0) && (data.eaten.id <200) )) {
                        socket_id = data.eaten.id;
                        io.to(socket_id).emit('eaten');
                    }

                    //remove blob from all blobs
                    blobs.splice(i,1); 

                    //make a new blob in its place somewhere random
                    let r;
                    let name;
                    if ((data.eaten.id >= 0) && (data.eaten.id <200) ) {
                        r = random(1,5);
                        name = "no user";
                        blobs.push(new Blob(random(-600,600),random(-600,600), data.eaten.id, r,random(0,255), random(0,255), random(0,255),name ))
                    }
                    
                }
            }
        }
    );
    
}

io.sockets.on('connection', newConnection);
console.log("My socket server is running")



   