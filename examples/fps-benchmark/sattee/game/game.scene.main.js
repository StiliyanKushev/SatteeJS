Sattee.init("main", {
    increment:100,
    arr: [],
    setup: function () {
        for(let i = 0; i < 1;i++){
            this.arr.push(new Bunny());
        }
    },
    loop: function () {
        for(let i = 0; i < Sattee.layers;i++){
            Sattee.clear(i);
        }
        for(let i = 0; i < this.arr.length;i++){
            this.arr[i].update();
            this.arr[i].render();
        }
        Sattee.clear(0,{
            x:0,
            y:0,
            width:100,
            height:50
        });
        Sattee.draw(0,function(){
            Sattee.text(Sattee.frameRate + " - " + this.arr.length,0,Sattee.textHeight("" + Sattee.delta,20),{
                size:20,
                color:"red",
            });
        });
    },
    mouseClicked(){
        for(let i = 0; i < this.increment;i++){
            this.arr.push(new Bunny());
        }
        console.log("Number of bunnies: " + this.arr.length);
    }
});

class Bunny{
    constructor(){
        this.xspeed = 1;
        this.yspeed = 1;

        if(Math.random() > 0.5){
            this.xspeed = -1;
        }
        if(Math.random() > 0.5){
            this.yspeed = -1;
        }

        this.x = Math.random() * Sattee.width;
        this.y = Math.random() * Sattee.height;
    }

    update(){
        this.x += this.xspeed;
        this.y += this.yspeed;

        if(this.x >= Sattee.width || this.x <= 0){
            this.xspeed *= -1;
        }
        if(this.y >= Sattee.height || this.y <= 0){
            this.yspeed *= -1;
        }
    }

    render(){
        let r = Math.floor(Math.random() * Sattee.layers);
        Sattee.draw(r,() => {
            Sattee.image("bunny",this.x,this.y,130 / 4,250 / 4);
        });
    }
}