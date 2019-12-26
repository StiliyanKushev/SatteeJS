Sattee.init("main", {
    width: Sattee.width,
    height: Sattee.height,
    setup: function () {},
    loop: function () {
        Sattee.draw(0, function () {
            Sattee.background("rgb(51,51,51)");
            Sattee.point(Sattee.width / 2, Sattee.height / 2, Sattee.width * 0.1, {
                color: "red",
                strokeSize: Sattee.width * 0.05,
                strokeColor: "white"
            });
        });
    }
});