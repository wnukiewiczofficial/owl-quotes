var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
let dpi = window.devicePixelRatio;

canvas.width = window.innerWidth*dpi;
canvas.height = window.innerHeight*dpi;

var mobile = canvas.width > canvas.height ? false : true;

// Background music: https://www.bensound.com
var background_music = new Sound("sounds/background_music.mp3", 0.3);
// document.getElementById("bgMusic").volume = 0.3;

var TipsUsed = 0;

var firstTipDate;

// Owl voices sounds from sfxr.me
var voices = [new Sound("sounds/voice_1.wav", 0.2), new Sound("sounds/voice_2.wav", 0.2)];

// Owl Images
var background_img = new Image();
background_img.src = "images/background.png";

var owl_sprite = [new Image(), new Image()];
owl_sprite[0].src = "images/owl_idle.png";
owl_sprite[1].src = "images/owl_talk.png";

var background = {
  r: 99,
  g: 207,
  b: 93,
  draw: function(){
    ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(!mobile) ctx.drawImage(background_img, 0, 0, canvas.width, canvas.height);
  },
  change: function(){
    this.r = Math.floor(Math.random()*256);
    this.g = Math.floor(Math.random()*256);
    this.b = Math.floor(Math.random()*256);
  }
};

var owl = {
  w: mobile ? canvas.height * 0.18 : canvas.width * 0.18,
  h: mobile ? canvas.height * 0.18 : canvas.width * 0.18,
  x: mobile ? canvas.width/2-canvas.height * 0.18/2 : canvas.width * 0.2/4,
  y: mobile ? canvas.height*0.6 : canvas.height/2,
  yoff: 0,
  ydir: -1,
  yvel: mobile ? canvas.height*0.0018 : canvas.width*0.0018,
  animI: 0,
  animT: 0,
  saying: false,
  draw: function(){
    ctx.drawImage(owl_sprite[this.animI], this.x, this.y + this.yoff, this.w, this.h);
  },
  say: function(){
    this.yoff += this.ydir * this.yvel;
    if(this.yoff < -this.h*0.08 || this.yoff > 0) this.ydir *= -1;

    this.animT++;
    if(this.animT >= 8){
      // voices[Math.floor(Math.random()*2)].play();
      this.animT = 0;
      this.animI++;
      if(this.animI >= owl_sprite.length) this.animI = 0;
    }
  },
  still: function(){
    ctx.save();
    let fontSize = mobile ? canvas.height * 0.03 : canvas.width * 0.02;
    ctx.strokeStyle = "black";
    ctx.lineWidth = owl.w*0.01;
    ctx.fillStyle = "orange";
    ctx.font = `${fontSize}px Nunito`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    wrapText("Click or touch the wisdom owl for your mood tips!", canvas.width/2, canvas.height/2, mobile ? canvas.width/2 : canvas.width/4, fontSize);
    ctx.restore();
  }
};

function Word(word, color = "white"){
  this.y = canvas.height/2;
  this.yvel = canvas.height/2 / (60 * 60);
  this.color = color;
  this.move = function(){
    this.y -= this.yvel;
    if(this.y <= 0) words_said.shift();
  };
  this.draw = function(){
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = owl.w*0.01;
    ctx.fillStyle = this.color;
    let fontSize = mobile ? canvas.height * 0.03 : canvas.width * 0.02;
    ctx.font = `${fontSize}px Nunito`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    wrapText(word, canvas.width/2, this.y, mobile ? canvas.width/2 : canvas.width/4, fontSize);
    ctx.restore();
  };
}

var words_said = [];

// Rendering, drawing
function Update(){
  background.draw();
  owl.draw();

  if(owl.saying) owl.say();
  else if(words_said.length == 0) owl.still();

  for(let i in words_said){
    words_said[i].draw();
    words_said[i].move();
  }
  HandleFooter();

  requestAnimationFrame(Update);
}

Update();

function Input(e){
  PlayBackgroundMusic();
  if(checkForClick(e, owl)){
    words_said = [];
    voices[Math.floor(Math.random()*2)].play();
    owl.saying = true;
    setTimeout(() => { 
      owl.saying = false;
      owl.animT = 0;
      owl.animI = 0;
      owl.yoff = 0;
    }, 600);

    let cookies = document.cookie.split(';').find(uses => uses.includes("uses=")) || 0;
    TipsUsed = typeof(cookies) != "number" ? parseInt(cookies.split('=')[1]) : cookies;

    background.change();
    if(TipsUsed < 3){
      TipsUsed++;
      LimitUses();
      words_said.push(new Word(pickQuote()));
    }
    else if(TipsUsed >= 3){
      words_said.push(new Word("I am busy giving tips to others also, please check in after 30 minutes!", "red"));
    }
  }
}

canvas.addEventListener('mousedown', Input);
canvas.addEventListener('touchstart', Input);
window.addEventListener('resize', resizeCanvas);
window.onload = PlayBackgroundMusic();
