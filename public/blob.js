function Blob(r, x, y) {
    //These are all of the variables each blob needs to be a blob
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0,0);
    this.red = Math.round(Math.random() * 255);
    this.blue = Math.round(Math.random() * 255);
    this.green = Math.round(Math.random() * 255);
    this.name = "needsAName"
    
    //https://www.youtube.com/watch?v=JXuxYMGe4KI
    //This prints the blob
    this.show = function() {
        fill(this.red, this.green, this.blue);
        ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
        fill(255);
        textAlign(CENTER);
        textSize(3);
        text(this.name, this.pos.x, this.pos.y + this.r); 
    }

    //https://www.youtube.com/watch?v=JXuxYMGe4KI
    //This moves the blob
    this.update = function() {
        let new_vel = createVector(mouseX-width/2, mouseY-height/2 );
        new_vel.setMag(3);
        this.vel.lerp(new_vel, 0.1); 
        this.pos.add(this.vel);
    }

    //https://www.youtube.com/watch?v=ZjVyKXp9hec
    //This keeps the blob inside the board
    this.constrain= function() {
        blob.pos.x = constrain(blob.pos.x, -width, width);
        blob.pos.y = constrain(blob.pos.y, -height, height);
    }

    //https://www.youtube.com/watch?v=JXuxYMGe4KI
    this.eats = function(other) {
        //This is the distance formal
        let d = sqrt(((other.x - this.pos.x)**2)+((other.y-this.pos.y)**2))
        //A blob can only eat another blob if they are closer together than their two 
        //radi (they are overlapping) and if it is bigger than the one it is eating
        if ((d < this.r + other.r) && (this.r > other.r)){//
            let sum = PI *this.r *this.r + PI * other.r *other.r;
            this.r = (sqrt(sum / PI));
            return true;
        } else {
            return false;
        }
        
    }
}