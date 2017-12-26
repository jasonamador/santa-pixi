/* Author: Jason Amador
 * Title: santa.js
 * Info: pixi.js rendered browser game built for santa.com
 * */

 /*
  "Class"es
 */
// santa
function Santa() {
  this.sprite = new PIXI.Sprite.fromImage("images/santa.png");
  this.sprite.scale.x = this.sprite.scale.y = 0.75;
  this.x = viewWidth / 2;
  this.y = viewHeight - this.sprite.height;
  this.vx = 0;
  this.vy = 0;
  this.px = 0;
  this.py = 0;
  this.sprite.anchor.x = 80 / 397;
  this.sprite.anchor.y = 150 / 192;
  this.theta = 0;
  this.dTheta = 0.5;
  this.update = function() {
    this.px = this.x;
    this.py = this.y;
    this.x = Math.sin(this.theta) * (viewWidth / 2.2) + (viewWidth / 2);
    this.y = Math.sin(this.theta * 2) * viewHeight / 25 + (4 * viewHeight / 5);
    this.vx = (this.x - this.px) / dt;
    this.vy = (this.y - this.py) / dt;
    this.theta += this.dTheta * dt;
    this.sprite.x = this.x;
    this.sprite.y = viewHeight - this.y;
    this.sprite.rotation = this.vy / 1000;
  }
}

// gifts
function Gift(x, y, vx, vy) {
  this.sprite = new PIXI.Sprite(giftTextures[Math.floor(Math.random() * giftTextures.length)]);
  this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
  this.sprite.par = this; //for the click/tap crap
  this.layerIndex = 2;
  this.sprite.layerIndex = this.layerIndex;
  this.vx = vx;
  this.vy = vy;
  this.x = x;
  this.y = y;
  this.rotRate = Math.random() * Math.PI * 2 - Math.PI;
  this.gravity = -175; //px/s/s
  this.sprite.x = this.x;
  this.sprite.y = this.y;
  this.sprite.interactive = this.sprite.buttonMode = true;
  this.sprite.mousedown = this.sprite.touchstart = function() {
		if (gameOn) {
	    layers[this.layerIndex].removeChild(this);
	    gifts.splice(gifts.indexOf(this.par), 1);
	    if (gifts.dropRate < 2.5)
	      gifts.dropRate *= 1.05;
	    if (santa.dTheta < 2)
	      santa.dTheta *= 1.05;
	    score.consecutive++;
	    score.score += Math.floor(Math.sqrt(this.par.vx * this.par.vx + this.par.vy * this.par.vy) * score.consecutive / 10);
	    score.text.setText("Score: " + score.score);
	    if (health.health < 1.0)
	      health.health += 0.1;
	    if (health.health > 1.0)
	      health.health = 1.0;
	    health.update();
	    scrollSpeed *= 1.1;
		}
  }

  this.update = function() {
    this.vx *= 0.97; //wind resistance
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.sprite.rotation += this.rotRate * dt;
    this.sprite.x = this.x;
    this.sprite.y = viewHeight - this.y;
    if (this.x < 0 + this.sprite.width / 2) {
      this.vx *= -0.8;
      this.x = 0 + this.sprite.width / 2;
    }
    if (this.x > viewWidth - this.sprite.width / 2) {
      this.vx *= -0.8;
      this.x = viewWidth - this.sprite.width / 2;
    }
    if (this.y <= 0) {
      layers[this.layerIndex].removeChild(this.sprite);
      gifts.splice(gifts.indexOf(this), 1);
      if (gameOn) {
        health.health -= 0.25;
        health.update();
      }
			score.consecutive = 0;
    }
  }
}

// snowflakes
function Snowflake() {
  this.sprite = new PIXI.Sprite(snowflakeTextures[Math.floor(Math.random() * snowflakeTextures.length)]);
  this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
  this.depth = Math.random();
  this.sprite.scale.x = this.sprite.scale.y = 1 - this.depth;
  this.x = Math.random() * viewWidth;
  this.y = Math.random() * viewHeight;
  this.vy = viewHeight / ((1 - this.depth) * 20 - 25);
  this.vx = viewWidth / ((1 - this.depth) * 20 - 30);
  this.sprite.x = this.x;
  this.sprite.y = viewHeight - this.y;
  this.update = function() {
    if (this.y <= viewHeight * 0.5 * this.depth) {
      this.x = Math.random() * viewWidth;
      this.y = viewHeight + 15;
    }
    if (this.x <= 0)
      this.x += viewWidth + 15;
    this.y += this.vy * dt;
    this.x += this.vx * dt * scrollSpeed;
    this.sprite.x = this.x;
    this.sprite.y = viewHeight - this.y;
  }
}

// trees
function Tree() {
  this.sprite = new PIXI.Sprite(treeTexture);
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.depth = Math.random();
  this.sprite.scale.x = this.sprite.scale.y = 1 - (this.depth / 4);
  this.sprite.alpha = 1 - (this.depth / 3);
  this.x = Math.random() * viewWidth;;
  this.y = this.depth * viewHeight / 5;
  this.vx = viewWidth / ((1 - this.depth) * 20 - 30);
  this.sprite.x = this.x;
  this.sprite.y = viewHeight - this.y;
  this.update = function() {
    if (this.x <= 0 - this.sprite.width / 2)
      this.x += viewWidth + this.sprite.width;
    this.x += this.vx * dt * scrollSpeed;
    this.sprite.x = this.x;
    this.sprite.y = viewHeight - this.y;
  }
}

// background
function Background(texture) {
  this.sprite1 = new PIXI.Sprite(texture);
  this.sprite2 = new PIXI.Sprite(texture);
  this.sprite1.x = 0;
  this.sprite2.x = this.sprite1.x + texture.width;
  this.vx = viewWidth / -40;
  this.update = function() {
    this.sprite1.x += this.vx * dt * scrollSpeed;
    this.sprite2.x += this.vx * dt * scrollSpeed;
    if (this.sprite1.x <= 0 - texture.width)
      this.sprite1.x += texture.width + viewWidth;
    if (this.sprite2.x <= 0 - texture.width)
      this.sprite2.x += texture.width + viewWidth;
  }
}

// score
function Score() {
  this.consecutive = 0;
  this.score = 0;
  this.text = new PIXI.Text("Score: " + this.score, {
    font: "35px Pacifico",
    fill: "white"
  });
  // I don't know why, but I have to do this.
  this.text.setText('Score: 0');
  this.text.anchor.y = 0.5;
  this.text.anchor.x = 0;
  this.text.x = viewWidth / 12;
  this.text.y = viewHeight / 12;
}

// health bar
function Health() {
  this.health = 1.0;
  this.red = new PIXI.Sprite.fromImage("images/health-red.png");
  this.green = new PIXI.Sprite.fromImage("images/health-green.png");
  this.red.height = 10;
  this.green.height = 10;
  this.red.anchor.x = this.green.anchor.x = 1;
  this.red.anchor.y = this.green.anchor.y = 0.5;
  this.red.x = this.green.x = 11 * viewWidth / 12;
  this.red.width = this.green.width = 2 * viewWidth / 10;
  this.red.y = this.green.y = viewHeight / 14;
  this.update = function() {
    if (this.health > 1.0)
      this.health = 1.0;
    this.green.width = this.red.width * this.health;
  }
}

// global constants
const viewWidth = 800;
const viewHeight = 600;
const fps = 60;
const dt = 1 / fps; // constant timestep
const gravity = (-175); // pixels/sec/sec
// PIXI
const stage = new PIXI.Stage(0xFFFFFF);
let isMobile = Boolean(navigator.userAgent.match(/phone|mobile|droid|opera mini/i));
const renderer = isMobile ? new PIXI.CanvasRenderer(viewWidth, viewHeight) : new PIXI.autoDetectRenderer(viewWidth, viewHeight);
renderer.view.className = "santaGame";
document.getElementById('container').appendChild(renderer.view);

// global variables
let gameOn = true;
let gameTimer;
let scrollSpeed = 1.0;
let background, santa, gifts, snowflakes, trees, score, health;
let backgroundTexture, santaTexture, giftTextures, snowflakeTextures, treeTexture;
let layers;
/*
I DO NOT LIKE - RESEARCH
I should be able to somehow pass these through or something, I don't want them to be global
*/
let snowFiles = [];
let giftFiles;

function showLoadingMessage() {
  let loadingText = new PIXI.Text("Loading", {
      font: "35px Pacifico",
      fill: "white"
    });
  loadingText.anchor.x = 0.5;
  loadingText.x = viewWidth / 2;
  loadingText.y = viewHeight / 2;
  stage.addChild(loadingText);
  renderer.render(stage);
}

function loadAssets(onComplete) {
  for (let i = 1; i <= 7; ++i)
    snowFiles[i - 1] = "images/snowflakes/" + i + ".png";
  giftFiles = ["images/gifts/blue.png", "images/gifts/green.png", "images/gifts/red.png", "images/gifts/orange.png"];

  let assets = ["images/santa.png", "images/tree.png", "images/bg.png", "images/health-red.png", "images/health-green.png", "images/restart.png"];
  let loader = new PIXI.AssetLoader(assets.concat(snowFiles, giftFiles));
  loader.onComplete = onComplete;
  loader.load();
}

function createTextures() {
  let i = 0;
  backgroundTexture = new PIXI.Texture.fromImage("images/bg.png");
  snowflakeTextures = [];
  giftTextures = [];
  for (i = 0; i < snowFiles.length; ++i)
    snowflakeTextures[i] = new PIXI.Texture.fromImage(snowFiles[i]);
  for (i = 0; i < giftFiles.length; ++i)
    giftTextures[i] = new PIXI.Texture.fromImage(giftFiles[i]);
  treeTexture = new PIXI.Texture.fromImage("images/tree.png");
  santaTexture = new PIXI.Texture.fromImage("images/santa.png");
}

function createObjects() {
  let i = 0;
  background = new Background(backgroundTexture);
  snowflakes = [];
  trees = [];
  let numSnowflakes = 80;
  for (i = 0; i < numSnowflakes; ++i)
    snowflakes[i] = new Snowflake();
  for (i = 0; i < 10; ++i)
    trees[i] = new Tree();
  santa = new Santa();
  gifts = [];
  gifts.dropTimer = 0;
  gifts.dropRate = 0.5;
  score = new Score();
  health = new Health();
}

function createLayers() {
  let i = 0;
  layers = [];
  for (i = 0; i < 4; ++i)
    layers[i] = new PIXI.DisplayObjectContainer();

  layers[0].addChild(background.sprite1);
  layers[0].addChild(background.sprite2);

  for (i = 0; i < snowflakes.length; ++i)
    layers[Math.floor(3 * (1 - snowflakes[i].depth)) + 1].addChild(snowflakes[i].sprite);

  for (i = 0; i < trees.length; ++i)
    layers[Math.floor(2 * (1 - trees[i].depth)) + 2].addChild(trees[i].sprite);

  layers[2].addChild(santa.sprite);

  layers[3].addChild(score.text);
  layers[3].addChild(health.red);
  layers[3].addChild(health.green);

  //add layers to the stage
  for (let i = 0; i < layers.length; ++i)
    stage.addChild(layers[i]);
}

function restartGame() {
  scrollSpeed = 1.0;
  health.health = 1;
  health.update();
  santa.dTheta = 0.5;
  gifts.dropRate = 0.5;
  gameOn = true;
  score.score = 0;
  score.text.setText("Score: " + score.score);
  $('#highscore').addClass('hidden');
	$('#highscores').empty();
}

function gameOver() {
  gameOn = false;
	$.ajax({
		url: '/highscores/0/10',
		type: 'GET',
		dataType: 'json'
	})
	.then((response) => {
		for (let i = 0; i < response.length; i++) {
			$('#highscores').append(`<tr><td>${response[i].name}</td><td>${response[i].score}</td></tr>`);
		}
	  $('#highscore').removeClass('hidden');
	});
}

function gameLoop() {
  let i = 0;
  //update the objects
  background.update();
  santa.update();
  if (gameOn) {
    gifts.dropTimer++;
    if (gifts.dropTimer >= fps / gifts.dropRate) {
      gifts.push(new Gift(santa.x, santa.y, santa.vx, santa.vy));
      layers[2].addChild(gifts[gifts.length - 1].sprite);
      gifts.dropTimer = 0;
    }
  }
  for (i = 0; i < gifts.length; ++i)
    gifts[i].update();
  for (i = 0; i < snowflakes.length; ++i)
    snowflakes[i].update();
  for (i = 0; i < trees.length; ++i)
    trees[i].update();

  if (health.health <= 0.0 && gameOn) {
    gameOver();
  }
  //render
  renderer.render(stage);
}

/*
event handlers
*/
function submitScore(e) {
	e.preventDefault();
	$.ajax({
		url: '/highscores',
		type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({name: $('#name').val(), score: score.score}),
	}).then(() => {
		restartGame();
	}).catch((e) => {
		console.log(e);
	});
}

/*
initialize and launch
*/
function init() {
  // wire up the DOM
  $('#submit').on('click', submitScore);

  $('#tryAgain').on('click', (e) => {
  	restartGame();
  });

  showLoadingMessage();
  loadAssets(() => {
    createTextures();
    createObjects();
    // stage.removeChild(loadingText);
    createLayers();
    gameTimer = setInterval(gameLoop, 1000 / fps);
  });
}

/*
away we go
*/
$(init);
