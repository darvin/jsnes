/* Read a file  using xmlhttprequest

If the HTML file with your javascript app has been saved to disk,
this is an easy way to read in a data file.  Writing out is
more complicated and requires either an ActiveX object (IE)
or XPCOM (Mozilla).

fname - relative path to the file
callback - function to call with file text
*/
function readFileHttp(fname, callback) {
   xmlhttp = getXmlHttp();
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState==4) {
          callback(xmlhttp.responseText);
      }
   }
   xmlhttp.open("GET", fname, true);
   xmlhttp.send(null);
}

/*
Return a cross-browser xmlhttp request object
*/
function getXmlHttp() {
   if (window.XMLHttpRequest) {
      xmlhttp=new XMLHttpRequest();
   } else if (window.ActiveXObject) {
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }
   if (xmlhttp == null) {
      alert("Your browser does not support XMLHTTP.");
   }
   return xmlhttp;
}




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


