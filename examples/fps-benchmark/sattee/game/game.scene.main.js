Sattee.init("main", {
    count: 1,
    arr: [],
    setup: function () {
        for(let i = 0; i < this.count;i++){
            this.arr.push(new Bunny());
        }
    },
    loop: function () {
        console.log("Number if bunnies: " + this.arr.length);
        for(let i = 0; i < Sattee.layers;i++){
            Sattee.clear(i);
        }
        for(let i = 0; i < this.arr.length;i++){
            this.arr[i].update();
            this.arr[i].render();
        }
    },
    mouseClicked(){
        this.count += 150;
        for(let i = 0; i < this.count - this.arr.length;i++){
            this.arr.push(new Bunny());
        }
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