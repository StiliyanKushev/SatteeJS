Sattee.init("main", {
    text: new SText(0,"SatteeJS",Sattee.width / 2,Sattee.height / 2,{
        color:"red",
        size:40,
        center:true,
        strokeSize: 3,
        strokeColor: "green"
    }),
    setup: function () {
    },
    loop: function () {
        Sattee.draw(0,function(){Sattee.background("gray")});
        this.text.draw();
    }
});