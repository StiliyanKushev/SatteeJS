Sattee.init("main", {
    rect: new SRectangle(1,900,450,100,100,{strokeColor:"red",strokeSize:20}),
    ellipse: new SEllipse(1,900,450,100,100,{strokeColor:"red",strokeSize:20}),
    triangle: new STriangle(1,900,450,900,550,1000,500,{strokeColor:"red",strokeSize:0}),
    text: new SText(1,"",30,100,{size:100,strokeColor:"red",strokeSize:10}),
    image: new SImage(1,"demo",20,260,300,400),
    setup: function () {
        Sattee.draw(0,function(){
            Sattee.background("gray");
        });
    },
    loop: function () {
        Sattee.draw(1,function(){
            //this.rect.clear();
            this.rect.draw();

            //this.ellipse.clear();
            this.ellipse.set({x:10,w:300});
            this.ellipse.draw();
            
            //this.triangle.clear();
            //this.triangle.set({x1:10});
            this.triangle.draw();
            
            this.text.clear();
            this.text.set({text:Sattee.frameRate.toString()});
            this.text.draw();

            // this.image.clear();
            // this.image.draw();
        }.bind(this));
    },
    onResize: function(){
        Sattee.draw(0,function(){
            Sattee.background("gray");
        });
    }
});