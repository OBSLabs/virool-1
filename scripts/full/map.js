(function() {
  var candidateFaces = [
    {file: "Ben_Carson_rep.png", party: "rep"},
    {file: "Carly_Fiorina_rep.png", party: "rep"},
    {file: "Donald_Trump_rep.png", party: "rep"},
    {file: "Jeb_Bush_rep.png", party: "rep"},
    {file: "Marco_Rubio_rep.png", party: "rep"},
    {file: "Mike_Huckabee_rep.png", party: "rep"},
    {file: "Mitt_Romney_rep.png", party: "rep"},
    {file: "Paul_Rand_rep.png", party: "rep"},
    {file: "Richard_Santorum_rep.png", party: "rep"},
    {file: "Scott_Walker_rep.png", party: "rep"},
    {file: "Ted_Cruz_rep.png", party: "rep"},
    {file: "rick-perry-rep.png", party: "rep"},
    {file: "Bernie_Sanders_dem.png", party: "dem"},
    {file: "Hillary_Clinton_dem.png", party: "dem"},
    {file: "Jim_Webb_dem.png", party: "dem"},
    {file: "Martin_OMalley_dem.png", party: "dem"},
    {file: "Obama_dem.png", party: "dem"}
  ];

  var statePics = [
    "assets/img/swing-states/1.png",
    "assets/img/swing-states/2.png",
    "assets/img/swing-states/3.png",
    "assets/img/swing-states/4.png",
    "assets/img/swing-states/5.png",
    "assets/img/swing-states/6.png",
    "assets/img/swing-states/7.png",
    "assets/img/swing-states/8.png",
    "assets/img/swing-states/9.png"
  ];

  function random (min, max) {
    return min + ~~(Math.random() * 99999) % (max - min + 1)
  }

  // automatically generated, don't modify
  var border = [[[32,34]],[[31,36],[36,40]],[[30,41]],[[23,43]],[[21,44],[44,47]],[[20,43],[43,44],[44,45],[45,48],[49,51]],[[19,52]],[[17,54]],[[15,55],[55,55]],[[13,59],[60,61]],[[2,4],[9,59],[61,61]],[[2,8],[8,10],[11,59]],[[2,59],[61,61],[64,64]],[[3,59],[61,61]],[[3,60]],[[4,61]],[[4,61]],[[1,2],[2,2],[2,3],[4,62],[64,64],[64,64],[66,67]],[[2,2],[2,2],[3,3],[3,4],[4,5],[5,6],[6,6],[6,63],[64,65]],[[1,2],[2,2],[2,4],[4,5],[5,63]],[[1,64]],[[1,65]],[[1,66]],[[1,68]],[[1,69]],[[2,69]],[[2,69]],[[2,69]],[[2,69]],[[2,69]],[[2,69]],[[3,69]],[[3,69]],[[3,69]],[[3,69],[70,70]],[[3,70]],[[3,71]],[[3,71]],[[3,71]],[[4,72]],[[4,72]],[[4,73]],[[4,73]],[[4,73]],[[4,74]],[[4,74]],[[4,74]],[[4,75]],[[5,75]],[[5,75]],[[5,76]],[[5,76]],[[5,76]],[[5,76]],[[5,76]],[[5,76]],[[5,77]],[[5,77]],[[6,77]],[[6,77]],[[6,77]],[[6,77]],[[6,77]],[[6,77]],[[6,77]],[[6,77]],[[6,75]],[[6,75]],[[6,76]],[[6,76]],[[7,76]],[[7,76]],[[7,76]],[[7,76]],[[7,76]],[[7,76]],[[7,77]],[[7,78]],[[7,79]],[[7,79]],[[7,80]],[[7,80]],[[7,81]],[[7,84]],[[7,85]],[[7,85]],[[7,86]],[[7,86]],[[7,87]],[[8,87]],[[8,88]],[[8,87]],[[8,86],[86,87]],[[8,85]],[[8,84]],[[8,84]],[[8,84]],[[8,84]],[[8,85]],[[8,85]],[[8,85]],[[8,86]],[[8,86]],[[8,87]],[[8,89]],[[8,90]],[[8,91]],[[8,92]],[[8,93]],[[8,93]],[[8,96]],[[8,97],[97,97]],[[8,98]],[[8,98]],[[8,99]],[[8,99]],[[8,99]],[[8,99]],[[8,99]],[[8,99]],[[8,94],[94,95],[96,100]],[[8,92],[93,93],[93,94],[97,97],[98,98],[98,100]],[[8,92],[92,92],[99,100]],[[8,91],[91,91]],[[8,90],[90,91]],[[7,89],[89,90],[90,90]],[[6,89],[89,90]],[[6,89],[89,89]],[[8,89]],[[8,88]],[[9,88]],[[9,88]],[[9,87]],[[9,85],[86,86]],[[9,85],[85,85]],[[9,85]],[[9,85]],[[10,10],[10,84]],[[9,84]],[[10,16],[16,84]],[[10,15],[16,84]],[[10,14],[16,84]],[[10,13],[15,84]],[[10,13],[15,84]],[[10,12],[15,15],[15,16],[16,84]],[[10,12],[15,15],[16,84]],[[10,11],[16,84]],[[10,11],[16,84],[84,84]],[[10,10],[15,83],[84,84]],[[15,83],[84,84]],[[10,11],[14,84]],[[10,10],[14,84]],[[9,10],[13,85]],[[12,85]],[[12,13],[13,13],[14,86]],[[12,12],[12,12],[14,85]],[[14,85]],[[15,22],[23,86]],[[15,22],[22,84],[85,85]],[[15,19],[21,22],[22,24],[24,25],[30,81],[82,82],[82,82],[82,85]],[[15,18],[20,21],[33,81],[81,83],[83,83],[84,85]],[[15,18],[19,20],[34,80],[82,82],[82,83],[84,85]],[[15,18],[35,80],[80,81],[84,85]],[[14,17],[34,80],[80,81],[83,83],[84,85]],[[14,17],[21,21],[22,22],[23,23],[23,27],[34,80],[80,80]],[[14,17],[21,28],[32,80],[80,81]],[[14,16],[18,18],[20,80],[80,80]],[[13,16],[19,20],[21,21],[21,78],[80,80]],[[14,17],[18,19],[19,80],[80,80]],[[14,17],[17,80]],[[14,16],[17,17],[17,80]],[[14,15],[15,16],[17,80]],[[16,16],[18,79]],[[15,16],[18,79]],[[16,16],[18,79]],[[18,24],[25,79]],[[20,23],[25,79]],[[23,79]],[[23,79]],[[23,32],[32,80]],[[24,30],[33,80]],[[26,29],[33,80],[81,81]],[[32,33],[33,81]],[[33,81],[81,81]],[[33,80],[81,81]],[[32,80]],[[32,79],[79,80]],[[32,79]],[[31,79]],[[31,79]],[[30,80]],[[30,80]],[[29,81]],[[29,81]],[[28,82]],[[27,82]],[[24,25],[26,87]],[[23,86],[86,87],[88,88]],[[23,89]],[[23,90]],[[23,72],[72,72],[75,91]],[[23,69],[69,70],[77,92]],[[23,68],[78,92]],[[23,67],[79,93],[99,99]],[[22,66],[80,94]],[[22,66],[81,93],[99,99]],[[18,19],[20,20],[21,65],[65,65],[82,94],[98,98]],[[17,64],[83,83],[84,95],[98,98]],[[16,62],[85,96]],[[15,61],[86,96],[97,98]],[[14,60],[87,96],[97,97]],[[14,42],[42,60],[88,95],[96,96]],[[14,38],[38,42],[42,60],[92,93],[94,95]],[[14,37],[37,38],[39,39],[40,40],[41,42],[42,44],[44,58]],[[14,40],[40,41],[42,42],[43,44],[44,46],[46,57]],[[13,41],[42,42],[43,43],[44,44],[44,44],[44,45],[45,46],[46,46],[47,57]],[[13,36],[37,42],[43,43],[46,51],[51,56]],[[13,37],[38,43],[43,46],[46,50],[50,53],[53,56]],[[13,37],[38,44],[47,48],[48,50],[50,53],[54,56]],[[12,38],[39,42],[48,49],[49,49],[50,53],[54,55]],[[12,31],[31,36],[49,50],[50,50],[50,52],[53,54]],[[12,30],[30,31],[31,35],[50,51],[53,53]],[[12,29],[29,30],[52,53]],[[12,28],[29,30]],[[10,27],[28,30]],[[10,27],[28,29]],[[6,6],[8,9],[9,27],[28,29]],[[2,26],[27,27],[27,28]],[[0,26],[27,28]],[[1,26]],[[1,19],[19,24],[24,25]],[[0,15],[15,16],[20,20],[22,25]],[[0,15],[22,24],[25,25]],[[0,15],[23,24],[24,25]],[[1,14],[22,22],[23,24],[24,25]],[[2,11],[12,12],[22,22],[23,23],[25,25]],[[4,12],[13,13],[14,14],[24,25]],[[6,12],[12,13]],[[6,11]],[[7,10]],[[7,10],[10,10]],[[8,9]]];
  var origImageSize = [2422, 1474]

  function randomCoords() {
    var x = 5 + ~~(random(0, origImageSize[0] - 5) / 10) * 10;
    var idx = (x - 5) / 10;
    var yBoundaries = border[idx];
    var boundary = yBoundaries[random(0, yBoundaries.length - 1)];
    var y = random(boundary[0], boundary[1]);
    return [x, ~~(y * origImageSize[1] / 100)];
  }

  function randomBool () {
    return random(0, 1) === 0;
  }

  function loadImg (src) {
    var def = new $.Deferred()

    var img = document.createElement("img");

    img.onerror = img.onload = function() {
      def.resolve(img);
    }

    img.src = src;
    img.style.position = "absolute";
    img.style.left = "-9999px";
    document.body.appendChild(img)

    return def;
  }

  var frame = window.requestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.msRequestAnimationFrame;

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  var Point = (function() {
    var Point = function(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = 0;
      this.progress = 0;
      this.done = false;
    };

    Point.prototype.maxRadius = 18;
    Point.prototype.speed = 800;

    Point.prototype.tick = function(ts) {
      this.ts = this.ts || ts;

      if(!this.done) {
        this.progress = (ts - this.ts) / this.speed;
        this.recalculate();
      }
    };

    Point.prototype.recalculate = function() {
      var size;

      if(this.progress > .5) {
        size = 1 - (this.progress - .5) / .5

        if(size < 0.0) {
          this.done = true;
        }
      } else {
        size = this.progress / .5;

      }

      this.opacity = size;
      this.radius = size * this.maxRadius;
    };

    Point.prototype.render = function(ctx) {
      if(this.done) return;

      var color = hexToRgb(this.color);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fillStyle = "rgba(" + [color.r, color.g, color.b, this.opacity].join(",") + ")";
      ctx.fill();
    };

    return Point;
  })();

  var Candidate = (function () {
    var Candidate = function(x, y, color, img) {
      Point.call(this, x, y, color);
      this.img = img;
    }

    Candidate.prototype = new Point();

    Candidate.prototype.maxRadius = 86;
    Candidate.prototype.speed = 2000;

    Candidate.prototype.recalculate = function() {
      this.radius = this.progress * this.maxRadius;
      this.opacity = 1 - this.progress;

      if(this.progress >= 1) {
        this.done = true
      }
    };

    Candidate.prototype.render = function(ctx) {
      if(this.done) return;

      ctx.save()
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.clip();
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, (this.radius * 2), (this.radius * 2))
      ctx.globalAlpha = 1.0;
      ctx.restore();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.closePath();

      var color = hexToRgb(this.color);

      ctx.fillStyle = "rgba(" + [color.r, color.g, color.b, this.opacity * .5].join(",") + ")";
      ctx.fill();
    }

    return Candidate;
  })();

  var State = (function() {
    var State = function(x, y, img) {
      Point.call(this, x, y);
      this.img = img;
      this.speed = random(20, 40) * 100
    }

    State.prototype = new Point();
    // State.prototype.speed = 3000;

    State.prototype.tick = function(ts) {
      Point.prototype.tick.call(this, ts);

      if(this.ts > Number.MAX_SAFE_INTEGER) {
        this.ts = ts;
      }
    };

    State.prototype.render = function(ctx) {
      ctx.globalAlpha = this.opacity * .4;
      ctx.drawImage(this.img, this.x, this.y);
      ctx.globalAlpha = 1.0;
    };

    State.prototype.recalculate = function() {
      this.opacity = - Math.pow(this.progress % 2 - 1, 2) + 1;
    };

    return State;
  })();


  (function() {
    var ctx = document.getElementById('map').getContext('2d');

    var points = [];
    var states = [];



    function render(ts) {
      ctx.clearRect(0, 0, origImageSize[0], origImageSize[1]);

      for(var i in states) {
        var state = states[i];

        state.render(ctx);
        state.tick(ts);
      }

      for(var i in points) {
        var point = points[i];

        point.render(ctx);
        point.tick(ts);
      }

      frame(render);
    }

    frame(render);

    var loader = candidateFaces.map(function(f) {return "assets/img/faces/" + f.file}).map(loadImg);
    var stateLoader = statePics.map(loadImg)

    $.when.apply($, stateLoader).then(function() {
      states = [
        new State(175, 435, arguments[0]),
        new State(620, 800, arguments[1]),
        new State(654, 565, arguments[2]),
        new State(1218, 418, arguments[3]),
        new State(1733, 440, arguments[4]),
        new State(1913, 388, arguments[5]),
        new State(1833, 565, arguments[6]),
        new State(1818, 706, arguments[7]),
        new State(1694, 1100, arguments[8])
      ];
    });

    $.when.apply($, loader).then(function() {
      var faces = arguments;

      setInterval(function() {
        var coords = randomCoords();

        if(points.length < 200) {
          points.push(new Point(coords[0], coords[1], (randomBool() ? "#3d77d1" : "#f83a3a")))
        }
      }, 20)

      setInterval(function() {
        var coords = randomCoords();
        var idx = random(0, candidateFaces.length - 1);
        var candidate = candidateFaces[idx];

        if(points.length < 200) {
          points.push(new Candidate(coords[0], coords[1], (candidate.party == "rep" ? "#f83a3a" : "#3d77d1"), faces[idx]))
        }

        // garbage collection
        for(var i in points) {
          if(points[i].done) {
            points.splice(i, 1);
          }
        }
      }, 300);
    })
  })();
})();