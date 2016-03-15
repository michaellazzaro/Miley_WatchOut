var gameStats = {
  score: 0,
  highScore: 0,
  collisions: 0
};

//#######################################################
//################# Scoreboard Updaters #################
//#######################################################

var updateScore = function(){
  d3.select('.scoreboard .current span').text(gameStats.score);
  d3.select('.scoreboard .highscore span').text(gameStats.highScore);
  d3.select('.scoreboard .collisions span').text(gameStats.collisions);
};

var scoreTicker = function(){
  gameStats.score = gameStats.score + 1;
  gameStats.highScore = Math.max(gameStats.score, gameStats.highScore);
  updateScore();
}
setInterval(scoreTicker, 100);
//#######################################################
//################# Scoreboard Updaters #################
//#######################################################



var w = 1430//window.innerWidth;
var h = 700//window.innerHeight;
var player_r = 10;
var miley_r = 100;
var image_size = miley_r * 2;
var svg = d3.select('svg').attr({width: w, height : h});
var data = d3.range(10).map(function(d){ return {} });
var enemies = svg.selectAll('circle.enemy').data(data);
// console.log(enemies);
enemies.enter().append('g').attr('class', 'miley enemy')
  .call(shuffle)
  .append('g').attr('class', 'css-rotation')
    .append('image')
    .attr('xlink:href', 'MileyBall.png')
    .attr({x: -image_size / 2, y: -image_size / 2})
    .attr({width: image_size, height: image_size})
function shuffle(sel){
  return sel.attr('transform', function(d){
    d.x = Math.random() * w;
    d.y = Math.random() * h;
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}
function loop(sel){
  sel.transition()
    .duration(1000)
    .delay(function(d){ return Math.random() * 1000 })
    .tween('custom', function(d){
      var enemy = d3.select(this);
      var startPos = { x: d.x, y: d.y }
      var endPos = { x: Math.random() * w, y: Math.random() * h };
      return function(t){
        d.x = startPos.x + (endPos.x - startPos.x) * t
        d.y = startPos.y + (endPos.y - startPos.y) * t
        enemy.attr('transform', 'translate(' + d.x + ',' + d.y + ')')
      }
    })
  .each('end', function(){ d3.select(this).call(loop) });
}
loop(enemies);

var drag = d3.behavior.drag();
drag.on('drag', function(){
  player.attr({cx: d3.event.x, cy: d3.event.y });
});

var player = svg.append('circle').attr('class', 'player')
  .attr({cx: w / 2, cy: h / 2})
  .attr({r: player_r})
  .call(drag)
  .on("mousemove", particle);

var previousCollision = false;

d3.timer(function(t){
  var px = player.attr('cx');
  var py = player.attr('cy');
  var collision = false;
  enemies.each(function(d, i){
    var ex = d.x;
    var ey = d.y;
    var x = ex - px;
    var y = ey - py;
    var d = Math.sqrt(x * x + y * y);
    if(d < player_r + miley_r) collision = true;
  });
  player.classed('collision', collision);

  if(collision){
    gameStats.score = 0;
  
    if(previousCollision != collision){
      
      gameStats.collisions = gameStats.collisions + 1;
      
    }
  }
  previousCollision = collision;



});

// #######################################################
// ################### Cursor Particle ###################
// #######################################################
// var svg = d3.select("body").append("svg")
//     .attr("width", w)
//     .attr("height", h);

var i = 0;
function particle() {
  console.log('hi');
  var m = d3.mouse(this);
  svg.insert("circle", "rect")
      .attr("cx", m[0])
      .attr("cy", m[1])
      .attr("r", 1e-6)
      .style("stroke", d3.hsl((i = (i + 1) % 360), 1, 0.5))
      .style("stroke-opacity", 3)
    .transition()
      .duration(1000)
      .ease(Math.sqrt)
      .attr("r", 100)
      .style("stroke-opacity", 1e-6)
      .remove();

}


