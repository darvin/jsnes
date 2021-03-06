function croomBenchmark() {
    var i;
    var nes = new JSNES({
        emulateSound: true,
        ui: JSNES.DummyUI
    });

    nes.loadRom(getTestRom("croom"));
    nes.setLimitFrames(false);
    nes.isRunning = true;

    for (i=0; i<5; i++) {
        nes.frame();
    }

    // Hit enter on start screen to start scrolling
    nes.keyboard.keyDown({keyCode: 13});
    nes.frame();
    nes.keyboard.keyUp({keyCode: 13});

    for (i=0; i<94; i++) {
        nes.frame();
    }
};



describe("JSNES", function () {

    this.timeout(20000);
    var res = document.createElement("div");
    res.id = "results";
    document.body.appendChild(res);

    it("should have proper performance", function (done) {
        var currentRepeat = -1;
        var repeatCount = 1;
        var frameCount = 100;
        var results = [];
        var i;
        results.length = repeatCount;
        $("#results").append('<li>Running...</li>');

        setTimeout(function benchmark() {
            if (currentRepeat < repeatCount) {
                var start = +new Date();

                croomBenchmark();

                // Warm up runs
                if (currentRepeat >= 0) {
                    results[currentRepeat] = +new Date() - start;
                    $("#results").append('<li>Run '+currentRepeat+', '+results[currentRepeat]+'ms</li>');
                }
                currentRepeat += 1;
                setTimeout(benchmark, 10);
            }
            else {
                  var totalTime = 0;
                  for (i=0; i<results.length; i++) {
                      totalTime += results[i];
                  }
                  var meanTime = totalTime / repeatCount;
                  var totalFPS = 0;
                  for (i=0; i<results.length; i++) {
                      totalFPS = frameCount / (results[i] / 1000);
                  }
                  var meanFPS = totalFPS / repeatCount;
                  $("#results").append('<li>Average of 10 runs: '+meanTime.toFixed(2)+'ms</li>');
                  meanTime.should.be.within(300,4000);
                  meanFPS.should.be.within(40,300);

                  done();
              }
          }, 10);
    });
});


