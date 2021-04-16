

let blob;

let blobs = [];
let zoom = 1; 
let socket;
let id;

//TO DO:
//Win and lose conditions
//If someone disconnects make them disappear.

//Created this function watching: https://www.youtube.com/watch?v=JXuxYMGe4KI
function setup() {
    //change these items to make it dynamic for the screen
    createCanvas(600,600);
    // This line is from https://www.youtube.com/watch?v=i6eP1Lw4gZk&list=PLRqwX-V7Uu6b36TzJidYfIYwTFEq3K5qH&index=4
    socket = io.connect('http://localhost:3000')
    
    blob = new Blob(10, random(width), random(height));

    //Tells the server to make a new socket
    let data = {
        x: blob.pos.x, 
        y: blob.pos.y, 
        r: blob.r,
        red: blob.red,
        blue: blob.blue,
        green: blob.green,
        name: blob.name
    }
    socket.emit('start', data);
    
    // This is the code for the socket to recieve messages from the server
    // The server sends all of the active blobs back to each client with this
    socket.on('heartbeat', 
        function(data){
            blobs = data;
        }
    );

    //This is what I think I want to happen when the blob gets eaten
    //It should just be a block on the screen saying "You Lose"
    socket.on('eaten',
        function() {
            console.log(blob)
            blob.alive = false;
        }
    )

    socket.on('winner', 
        function(){
            blob.alive =false;
            blob.winner = true;
        }
    )
}

//Created this function watching: https://www.youtube.com/watch?v=JXuxYMGe4KI
function draw() {
    if (blob.alive) {
        //This deals with the background
        background(0);
        translate(width/2, height/2);
        //Change the hard code of 64 possibly
        let new_scale = 64 / blob.r;
        zoom = lerp(zoom, new_scale, 0.02);
        scale(zoom);
        translate(-blob.pos.x, -blob.pos.y);
        //Loop deals with other blobs
        for (let i = blobs.length-1; i >= 0; i--) {
            let id = blobs[i].id;
            //This is how you avoid drawing/eating yourself.
            if (id != socket.id){
                //This checks if blob has eaten blob[i] 
                if (blob.eats(blobs[i])){
                    let eaten = {
                        eaten: blobs[i]
                    }
                    socket.emit('eaten', eaten);
                    blobs.splice(i,1); 
                } else {
                    //If it hasn't it gets drawn onto the screen using p5 functions
                    fill(blobs[i].red, blobs[i].green, blobs[i].blue);
                    ellipse(blobs[i].x, blobs[i].y, blobs[i].r*2);
                    // if you want text to appear below id in this case but could make user names instead do this
                    fill(255);
                    textAlign(CENTER);
                    textSize(3);
                    text(blobs[i].name, blobs[i].x, blobs[i].y + blobs[i].r);
                }
                
            }  

        }

        //After every other blob is printed this blob gets printed.
        blob.show();

        //blob only moves toward your mouse if it is pressed.
        if (mouseIsPressed){
            blob.update();
        }
        //keeps it in bounds
        blob.constrain();
        //blob updates itself and then needs to update everyone else
        let data = {
            x: blob.pos.x, 
            y: blob.pos.y, 
            r: blob.r,
            red: blob.red,
            blue: blob.blue,
            green: blob.green,
            name: blob.name
        }
        if (blob.alive){
            socket.emit('update', data);
        }
        
    } else if (blob.winner){
        background(0);
        fill(blob.red, blob.green, blob.blue);
        textSize(60);
        textAlign(CENTER);
        text('You Win',300, 300);
    }else {
        background(0);
        fill(blob.red, blob.green, blob.blue);
        textSize(60);
        textAlign(CENTER);
        text('You Lose',300, 300);
    }
}

