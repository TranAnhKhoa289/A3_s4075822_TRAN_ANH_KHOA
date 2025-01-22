
//----------- GLOBAL STATE -----------
let currentSlide = 1;  // Start at Slide 1

//----------- SLIDE 1 (Scratch) -----------
let slide1Top, slide1Bottom;

//----------- SLIDE 2 (Catcher) -----------
let slide2BgVid, hateEmoji;
let catcher;
let timer;
let emojis = [];
let totalSpawned = 0;
let caughtCount = 0;
let gameIsFinished = false;
const TOTAL_EMOJIS = 15;

//----------- SLIDE 3 (Ending) -----------
let slide3BgVid;           
let stars = [];
const NUM_STARS = 500;
let popImages = [];        // shaky images: hatteu.png, star.png, bubble.png
let poppedItems = [];

//----------- HEARTS  (slides 2 & 3 only) -----------
let heartImg;
let hearts = [];

//----------- MUSIC BUTTON -----------
let musicButton;     // musicbutton.png
let musicPlaying = false;
let bgMusic;         // musicbg.mp4
let btnWidth, btnHeight; 

//                 PRELOAD
function preload() {
  // Slide 1
  slide1Top     = loadImage('slide1.png');
  slide1Bottom  = loadImage('slide1bottom.png');

  // Slide 2
  slide2BgVid   = createVideo('slide2clip.mp4');
  slide2BgVid.hide(); // Hide default video controls
  hateEmoji     = loadImage('hateemoji.png');

  // Slide 3
  slide3BgVid   = createVideo('slideending.mp4');
  slide3BgVid.hide(); // Hide default video controls

  popImages[0]  = loadImage('hatteu.png');
  popImages[1]  = loadImage('star.png');
  popImages[2]  = loadImage('bubble.png');

  // Hearts
  heartImg      = loadImage('heartcursor.png');

  // Music Button image
  musicButton   = loadImage('musicbutton.png');
}

//--------------------------------------
//                 SETUP
//--------------------------------------
function setup() {
  createCanvas(1920, 1080);

  // Slide 1: show top image
  image(slide1Top, 0, 0);

  // Slide 2: catcher game setup
  catcher = new Catcher(32);
  timer   = new Timer(400);
  timer.start();

  // Slide 3: shaky lighstick images setup
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({ x: random(width), y: random(height) });
  }

  // Music audio
  bgMusic = createAudio('musicbg.mp4');

  // button image
  btnWidth  = musicButton.width;
  btnHeight = musicButton.height;
}

//--------------------------------------
//                 DRAW
//--------------------------------------
function draw() {
  if (currentSlide === 1) runSlide1();
  else if (currentSlide === 2) runSlide2();
  else if (currentSlide === 3) runSlide3();

  if (currentSlide === 2 || currentSlide === 3) {
    runHearts();
  }

  drawMusicButton();
}

//--------------------------------------
//    DRAW / TOGGLE MUSIC BUTTON
//--------------------------------------
function drawMusicButton() {
  let xPos = width - btnWidth - 20;
  let yPos = 20;
  image(musicButton, xPos, yPos);

}

function toggleMusic() {
  if (!musicPlaying) {
    bgMusic.loop();      // start playing (loop it)
    musicPlaying = true;
  } else {
    bgMusic.stop();      // or pause() 
    musicPlaying = false;
  }
}

//--------------------------------------
//             SLIDE 1 (Scratch)
//--------------------------------------
function runSlide1() {
  // The top image was drawn once in setup().
  push();
  fill(255);
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  textFont('Finger Paint');
  stroke(0);
  strokeWeight(1);
  fill('#ffee94');
  text("Scratch to see Under-the-Glow.", width / 2, height / 2);
  pop();

  push();
  fill(255);
  textSize(20);
  textAlign(CENTER, BOTTOM);
  textFont('Finger Paint');
  fill('#343434');
  text("Press SPACE to go to the next page", width / 2, height - 10);
  pop();
}

// Scratch logic
function mouseDragged() {
  if (currentSlide === 1) {
    // Erase top by copying from bottom
    copy(slide1Bottom, mouseX, mouseY, 90, 90, mouseX, mouseY, 90, 90);
  }
}

//--------------------------------------
//             SLIDE 2 (Catch Game)
//--------------------------------------
function runSlide2() {
  if (!slide2BgVid.elt.loop) {
    slide2BgVid.loop();
  }
  image(slide2BgVid, 0, 0, width, height);


  if (!gameIsFinished) {
    catcher.setLocation(mouseX, mouseY);
    catcher.display();

    if (timer.isFinished()) {
      if (totalSpawned < TOTAL_EMOJIS) {
        emojis.push(new Drop(hateEmoji));
        totalSpawned++;
      }
      timer.start();
    }

    for (let i = 0; i < emojis.length; i++) {
      emojis[i].move();
      emojis[i].display();
      if (!emojis[i].isCaught && catcher.intersect(emojis[i])) {
        emojis[i].caught();
        caughtCount++;
      }
    }

    if (caughtCount >= TOTAL_EMOJIS) {
      gameIsFinished = true;
    }
  } else {
    push();
    fill(255);
    noStroke();
    textSize(32);
    textAlign(CENTER, CENTER);
    textFont('Finger Paint');
    stroke(0);
    strokeWeight(1);
    fill('#ffee94');
    text("You're done!\npress SPACE to go to the next page", width/2, height/2);
    pop();
  }
}

//--------------------------------------
//             SLIDE 3 (Ending)
//--------------------------------------
function runSlide3() {
  if (!slide3BgVid.elt.loop) {
    slide3BgVid.loop();
  }
  image(slide3BgVid, 0, 0, width, height);

  // Glitter effect
  for (let i = 0; i < stars.length; i++) {
    fill(255);
    ellipse(stars[i].x, stars[i].y, random(1,3), random(1,3));
  }

  // Shaky lighstick images
  for (let i = 0; i < poppedItems.length; i++) {
    poppedItems[i].update();
    poppedItems[i].display();
  }

  // add text
  push();
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  textFont('Finger Paint');
  fill('#ffee94');
  text("Your love is our greatest source of strength,\nhelping us overcome everything...", width/2, height/2);
  pop();

  push();
  fill(255);
  textSize(20);
  textAlign(CENTER, BOTTOM);
  textFont('Finger Paint');
  fill('#ffee94');
  text("Click to raise your lightsticks!", width/2, height - 10);
  pop();
}

//--------------------------------------
//      HEARTS emoji (Slides 2 & 3 Only)
//--------------------------------------
function runHearts() {
  // If mouse moved, add a heart
  if (abs(pmouseX - mouseX) > 0 || abs(pmouseY - mouseY) > 0) {
    hearts.push(new Heart(mouseX, mouseY));
  }

  // Update + display hearts
  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].display();
    if (hearts[i].done) {
      hearts.splice(i, 1);
    }
  }
}

//--------------------------------------
//            MOUSE PRESSED
//--------------------------------------
function mousePressed() {
  // 1) Check if clicked the music button
  let xPos = width - btnWidth - 20;
  let yPos = 20;
  if (
    mouseX > xPos && mouseX < xPos + btnWidth &&
    mouseY > yPos && mouseY < yPos + btnHeight
  ) {
    // Toggled the music
    toggleMusic();
    return; // Exit to avoid also spawning images if on Slide 3
  }

  // 2) If on Slide 3, spawn a random shaky image
  if (currentSlide === 3) {
    spawnRandomImage(mouseX, mouseY);
  }
}

//--------------------------------------
//          KEY PRESSED
//--------------------------------------
function keyPressed() {
  // Slide 1 -> Slide 2
  if (key === ' ' && currentSlide === 1) {
    currentSlide = 2;
  }
  // Slide 2 -> Slide 3 (only after finishing the game)
  else if (key === ' ' && currentSlide === 2 && gameIsFinished) {
    currentSlide = 3;
  }
}

//--------------------------------------
//        SPAWN RANDOM IMAGE
//--------------------------------------
function spawnRandomImage(x, y) {
  let r = floor(random(popImages.length));
  let newItem = new PoppedImage(popImages[r], x, y);
  poppedItems.push(newItem);
}

//--------------------------------------
//             CLASSES
//--------------------------------------

//=== Slide 2: Catcher ===
class Catcher {
  constructor(r) {
    this.radius = r;
    this.x = 0;
    this.y = 0;
  }

  setLocation(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    fill(0, 150, 255);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }

  intersect(drop) {
    let distance = dist(this.x, this.y, drop.x, drop.y);
    return (distance < this.radius + drop.size / 2);
  }
}

//=== Slide 2: Drop ===
class Drop {
  constructor(img) {
    this.x = random(width);
    this.y = -50;
    this.speed = random(2,5);
    this.size = 90;
    this.img = img;
    this.isCaught = false;
  }

  move() {
    if (!this.isCaught) {
      this.y += this.speed;
    }
  }

  display() {
    if (!this.isCaught) {
      image(this.img, this.x, this.y, this.size, this.size);
    }
  }

  caught() {
    this.isCaught = true;
  }
}

//=== Slide 2: Timer ===
class Timer {
  constructor(interval) {
    this.interval = interval;
    this.startTime = 0;
  }

  start() {
    this.startTime = millis();
  }

  isFinished() {
    return (millis() - this.startTime > this.interval);
  }
}

//=== Slide 3: PoppedImage (shaky) ===
class PoppedImage {
  constructor(img, x, y) {
    this.img = img;
    this.x   = x;
    this.y   = y;
    this.size = 200; 
  }

  update() {
    // slight jitter
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }

  display() {
    image(this.img, this.x - this.size/2, this.y - this.size/2, this.size, this.size);
  }
}

//=== Heart class (Slides 2 & 3) ===
class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.lifespan = 255;
    this.done = false;
  }

  update() {
    this.y -= 1;  // float upward
    this.lifespan -= 4;
    if (this.lifespan <= 0) {
      this.done = true;
    }
  }

  display() {
    tint(255, this.lifespan);
    image(heartImg, this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    noTint();
  }
}