Sattee.init("main", {
    text: new SText(0, "SatteeJS", Sattee.width / 2, Sattee.height / 2, {
        color: "red",
        size: 100,
        center:true,
        strokeSize: 3,
        strokeColor: "green",
        font: "myFont"
    }),
    setup: function () {},
    loop: function () {
        Sattee.draw(0, function () {
            Sattee.background("gray")
        });
        this.text.draw();
        new SRectangle(0,Sattee.width / 2, Sattee.height / 2,this.text.width,this.text.height,{
            center:true,
            color: "rgba(0,0,0,0.5)",
        }).draw();
    }
});