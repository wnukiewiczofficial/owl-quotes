function Sound(src, volume) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  this.sound.volume = volume;
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

function resizeCanvas(){
  canvas.width = window.innerWidth*dpi;
  canvas.height = window.innerHeight*dpi;
  mobile = canvas.width > canvas.height ? false : true;

  owl.w = mobile ? canvas.height * 0.18 : canvas.width * 0.18;
  owl.h = mobile ? canvas.height * 0.18 : canvas.width * 0.18;
  owl.x = mobile ? canvas.width/2-canvas.height * 0.18/2: canvas.width * 0.2/4;
  owl.y = mobile ? canvas.height*0.6 : canvas.height/2;
  owl.yvel = mobile ? canvas.height*0.0018 : canvas.width*0.0018;
}

function PlayBackgroundMusic(){
  background_music.sound.loop = true;
  background_music.play();
}

function checkForClick(e, obj){
  if(e.pageX*dpi >= obj.x && e.pageX*dpi <= obj.x + obj.w && e.pageY*dpi >= obj.y && e.pageY*dpi <= obj.y + obj.h) return true;
  else return false;
}

function wrapText(text, x, y, maxWidth, lineHeight) {
	var splitText = text.split(' ');
 	var line = '';

	for(var n = 0; n < splitText.length; n++) {
			var testLine = line + splitText[n] + ' ';
		  var metrics = ctx.measureText(testLine);
		  var testWidth = metrics.width;
		  if (testWidth > maxWidth && n > 0) {
        ctx.strokeText(line, x, y);
				ctx.fillText(line, x, y);
			  line = splitText[n] + ' ';
			  y += lineHeight;
			}
		 	else {
			 line = testLine;
		  }
		}
		ctx.strokeText(line, x, y);
		ctx.fillText(line, x, y);
}

function LimitUses() {
  let minutes = 10;
  let currentTime = new Date();

  if(firstTipDate == undefined || TipsUsed == 1){
    firstTipDate = new Date();
    document.cookie = `uses=${TipsUsed};path=/;max-age=${minutes * 60};`;
  }
  else{
    let expiration = Math.round((currentTime.getTime() - firstTipDate.getTime())/1000);
    document.cookie = `uses=${TipsUsed};path=/;max-age=${Math.floor(minutes * 60 - expiration)};`;
  }
}

function pickQuote(){
  let cT = new Date();
  let tag = "";

  switch(cT.getHours()){
    case 4: case 5: case 6: case 7: case 8: case 9: case 10: tag = "EM"; break;
    case 11: case 12: tag = "LM"; break;
    case 13: case 14: case 15: tag = "EA"; break;
    case 16: case 17: tag = "LA"; break;
    case 18: case 19: tag = "EV"; break;
    case 20: case 21: case 22: case 23: tag = "EN"; break;
    case 24:case 0:case 1: case 2: case 3: tag = "LN"; break;
    default: tag = "AT"; break;
  }

  let tagQuotes = words.filter(word => word.tag == tag).map(word => word.quote);
  let alltimeQuotes = words.filter(word => word.tag == "AT").map(word => word.quote);
  if(tagQuotes.length >= 5){
    let index = Math.floor(Math.random()*(tagQuotes.length));
    return tagQuotes[index];
  } else{
    let index = Math.floor(Math.random()*(alltimeQuotes.length));
    return alltimeQuotes[index];
  }
}

// function getTime(){
//   let request = "http://worldtimeapi.org/api/ip";
//   let connection = new XMLHttpRequest();
//
//   connection.open('GET', request, true);
//   connection.send();
//
//   connection.onreadystatechange = function() {
//   	if (this.readyState == 4 && this.status == 200) {
//   		var response = JSON.parse(this.responseText);
//   	}
//   };
// }

// FOOTER

function HandleFooter(){

  //Copyright mood.tips
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = canvas.width*0.002;
  ctx.font = `${mobile ? canvas.height*0.015 : canvas.width*0.015}px Porkys`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.strokeText("©moods.tips", canvas.width/2, mobile ? canvas.height*0.87 : canvas.height*0.97);
  ctx.fillText("©moods.tips", canvas.width/2, mobile ? canvas.height*0.87 : canvas.height*0.97);
  ctx.restore();
}
