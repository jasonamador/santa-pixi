/* Author: Jason Benford
 * Title: santa.js
 * Info: pixi.js rendered browser game built for santa.com
 * */

//global constants
var viewWidth = 800;
var viewHeight = 600;
var fps = 30;
var dt = 1 / fps;			//constant timestep
var gravity = -175;			//pixels/sec/sec
var gameTimer;
var scrollSpeed = 1.0;

//set up pixi
var stage = new PIXI.Stage(0xFFFFFF);
var renderer;
var isMobile = Boolean(navigator.userAgent.match(/phone|mobile|droid|opera mini/i));
if (isMobile)
	renderer = new PIXI.CanvasRenderer(viewWidth, viewHeight);
else 
	renderer = new PIXI.autoDetectRenderer(viewWidth, viewHeight);
renderer.view.className = "santaGame";
document.body.appendChild(renderer.view);

//GAME OBJECTS
//santa///////////////////////////////////
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

//gifts////////////////////////////////////////////////////
function Gift(x, y, vx, vy) {
	this.sprite = new PIXI.Sprite(giftTextures[Math.floor(Math.random() * giftTextures.length)]);
	this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
	this.sprite.par = this;		//for the click/tap crap
	this.layerIndex = 2;
	this.sprite.layerIndex = this.layerIndex;
	this.vx = vx;
	this.vy = vy;
	this.x = x;
	this.y = y;
	this.rotRate = Math.random() * Math.PI * 2 - Math.PI;
	this.gravity = -175;		//px/s/s
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.sprite.interactive = this.sprite.buttonMode = true;
	this.sprite.mousedown = this.sprite.touchstart = function () {
		console.log(this);
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
	this.update = function () {
		this.vx *= 0.97;		//wind resistance
		this.vy += this.gravity * dt;
		this.x += this.vx * dt;
		this.y += this.vy * dt;
		this.sprite.rotation += this.rotRate * dt;
		this.sprite.x = this.x;
		this.sprite.y = viewHeight - this.y;
		if (this.x < 0 + this.sprite.width / 2){
			this.vx *= -0.8;
			this.x = 0 + this.sprite.width / 2;
		}
		if (this.x > viewWidth - this.sprite.width / 2){
			this.vx *= -0.8;
			this.x = viewWidth - this.sprite.width / 2;
		}
		if (this.y <= 0) {
			layers[this.layerIndex].removeChild(this.sprite);
			gifts.splice(gifts.indexOf(this), 1);
			health.health -= 0.25;
			health.update();
		}
	}
}

//snowflakes//////////////////////////////////////////////
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
	this.update = function () {
		if (this.y <= viewHeight * 0.5 * this.depth){
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

//trees/////////////////////////////////////////////////////
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
	this.update = function () {
		if (this.x <= 0 - this.sprite.width / 2)
			this.x += viewWidth + this.sprite.width;
		this.x += this.vx * dt * scrollSpeed;
		this.sprite.x = this.x;
		this.sprite.y = viewHeight - this.y;
	}
}

//background///////////////////////////////////////////////
function Background(texture) {
	this.sprite1 = new PIXI.Sprite(texture);
	this.sprite2 = new PIXI.Sprite(texture);
	this.sprite1.x = 0;
	this.sprite2.x = this.sprite1.x + texture.width;
	this.vx = viewWidth / -40;
	this.update = function () {
		this.sprite1.x += this.vx * dt * scrollSpeed;
		this.sprite2.x += this.vx * dt * scrollSpeed;
		if (this.sprite1.x <= 0 - texture.width)
			this.sprite1.x += texture.width + viewWidth;
		if (this.sprite2.x <= 0 - texture.width)
			this.sprite2.x += texture.width + viewWidth;
	}
}

//score//////////////////////////////////////////////////
function Score() {
	this.consecutive = 0;
	this.score = 0;
	this.text = new PIXI.Text("Score: " + this.score, {font: "35px Pacifico", fill: "white"});
	this.text.anchor.y = 0.5;
	this.text.anchor.x = 0;
	this.text.x = viewWidth / 12;
	this.text.y = viewHeight / 12;
}

//health bar/////////////////////////////////////////////////////
function Health() {
	this.health = 1.0;
	this.red = new PIXI.Sprite.fromImage("images/health-red.png");
	this.green = new PIXI.Sprite.fromImage("images/health-green.png");
	this.red.anchor.x = this.green.anchor.x = 1;
	this.red.anchor.y = this.green.anchor.y = 0.5;
	this.red.x = this.green.x = 11 * viewWidth / 12;
	this.red.width = this.green.width = 2 * viewWidth / 10;
	this.red.y = this.green.y = viewHeight / 12;
	this.update = function () {
		if (this.health > 1.0)
			this.health = 1.0;
		this.green.width = this.red.width * this.health;
	}
}

var background, santa, gifts, snowflakes, trees, score, health;
var backgroundTexture, santaTexture, giftTextures, snowflakeTextures, treeTexture;
var layers;
var startScreen, restartScreen;

//start loading up assets with a loading thing
var loadingText = new PIXI.Text("Loading");
loadingText.anchor.x = 0.5;
loadingText.x = viewWidth / 2;
loadingText.y = viewHeight / 2;
stage.addChild(loadingText);
renderer.render(stage);

//the webfont
WebFontConfig = {
	google: { families: [ 'Pacifico::latin' ] }
};
(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
			'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
	})
();

//load images
var snowFiles = [];
for (var i = 1; i <= 7; ++i)
	snowFiles[i-1] = "images/snowflakes/" + i + ".png";
var giftFiles = ["images/gifts/blue.png", "images/gifts/green.png", "images/gifts/red.png", "images/gifts/orange.png"];
var startFiles = ["images/start/start-1.png", "images/start/start-2.png", "images/start/start-3.png", "images/start/start-4.png", "images/start/start-5.png"];

var assets = ["images/santa.png", "images/tree.png", "images/bg.png", "images/health-red.png", "images/health-green.png", "images/restart.png"];
var loader = new PIXI.AssetLoader(assets.concat(snowFiles, giftFiles, startFiles));
loader.onComplete = onAssetsLoaded;
loader.load();

function onAssetsLoaded() {
	stage.removeChild(loadingText);
	createTextures();
	createObjects();
	createLayers();
	startScreenSequence();
}

function createTextures() {
	var i = 0;
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
	var i = 0;
	startScreen = [];
	for (i = 0; i < startFiles.length; ++i)
		startScreen[i] = new PIXI.Sprite.fromImage(startFiles[i]);
	restartScreen = new PIXI.Sprite.fromImage("images/restart.png");
	background = new Background(backgroundTexture);
	snowflakes = [];
	trees = [];
	var numSnowflakes = 80;
	/*if (renderer instanceof PIXI.CanvasRenderer)
		numSnowflakes = 40;*/
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
	var i = 0;
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
}

function startScreenSequence(){
	var i = 0;
	stage.addChild(startScreen[i]);
	renderer.render(stage);
	var startSequenceTimer = setInterval(function () {
		stage.removeChild(startScreen[i]);
		i++;
		if (i >= startScreen.length){
			clearInterval(startSequenceTimer);
			startGame();
		}
		stage.addChild(startScreen[i]);
		renderer.render(stage);
	}, 2000);

	stage.click = stage.tap = function () {
		clearInterval(startSequenceTimer);
		startGame();
	};
}

function startGame() {
	//clear the stage
	for (var i = 0; i < stage.children.length; ++i)
		stage.removeChild(stage.children[i]);
	stage.click = stage.tap = null;

	//add layers to the stage
	for (var i = 0; i < layers.length; ++i)
		stage.addChild(layers[i]);

	//setup the game loop
	gameTimer = setInterval(gameLoop, 1000 / fps);
}

function restartGame(){
	scrollSpeed = 1.0;
	createObjects();
	createLayers();
	startGame();
}

function gameOver() {
	//stop game loop
	clearInterval(gameTimer);

	//clear the stage and all arrays
	for (var i = 0; i < stage.children.length; ++i)
		stage.removeChild(stage.children[i]);
	for (var i = 0; i < layers.length; ++i)
		for (var j = 0; j < layers[i].children.length; ++j)
			layers[i].removeChild(layers[i].children[j]);
	stage.addChild(restartScreen);
	renderer.render(stage);
	stage.click = stage.tap = restartGame;
}

function gameLoop(){
	var i = 0;
	//update the objects
	background.update();
	santa.update();
	gifts.dropTimer++;
	if (gifts.dropTimer >= fps / gifts.dropRate) {
		gifts.push(new Gift(santa.x, santa.y, santa.vx, santa.vy));
		layers[2].addChild(gifts[gifts.length - 1].sprite);
		gifts.dropTimer = 0;
	}
	for (i = 0; i < gifts.length; ++i)
		gifts[i].update();
	for (i = 0; i < snowflakes.length; ++i)
		snowflakes[i].update();
	for (i = 0; i < trees.length; ++i)
		trees[i].update();

	if (health.health <= 0.0)
		gameOver();
	//render
	renderer.render(stage);
}
