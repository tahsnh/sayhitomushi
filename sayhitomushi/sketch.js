    //size of the pixels
    var pixelScale = 8;

    //declare a variable for each animation
    var idle_animation;
    var eat_animation;
    var hungry_animation;
    var barf_animation;
    var die_animation;

    //images for the interface
    var feed_icon;
    var feed_icon_roll;

    //sounds
    var eat_sound;
    var barf_sound;
    var hunger_sound;
    var die_sound;

    //declare a variable for each sprite
    //buttons are sprites as well
    var character;
    var feed;

    var dead = false;
    var hunger = 3;
  //**  var MAX_HUNGER = 10;
        var MAX_HUNGER = 50;


    function preload() {

      //load sprite sheet: (file, width, height, number of frames)
      //put it in a variable sprite_sheet which I reuse every time
    //**  sprite_sheet = loadSpriteSheet('assets/idle.png', 32, 32, 8);
        sprite_sheet = loadSpriteSheet('assets/idle.png', 32, 32, 16);
      //turn the sprite sheet into an animation
      idle_animation = loadAnimation(sprite_sheet);

      //do the same for the other animations...
      //make sure to change the frame number!

    //**  sprite_sheet = loadSpriteSheet('assets/eat.png', 32, 32, 21);
      sprite_sheet = loadSpriteSheet('assets/eat.png', 32, 32, 16);
      eat_animation = loadAnimation(sprite_sheet);

    //**  sprite_sheet = loadSpriteSheet('assets/hungry.png', 32, 32, 10);
        sprite_sheet = loadSpriteSheet('assets/hungry.png', 32, 32, 16);
      hungry_animation = loadAnimation(sprite_sheet);

      sprite_sheet = loadSpriteSheet('assets/barf.png', 32, 32, 16);
      barf_animation = loadAnimation(sprite_sheet);

//**      sprite_sheet = loadSpriteSheet('assets/die.png', 32, 32, 1);
          sprite_sheet = loadSpriteSheet('assets/die.png', 32, 32, 16);
      die_animation = loadAnimation(sprite_sheet);

      //load static images
      bg_image = loadImage("assets/background.png");
      feed_icon = loadImage("assets/feed_button.png");
      feed_icon_roll = loadImage("assets/feed_button_roll.png");

      //load sound
      eat_sound = loadSound("assets/eat.wav");
      barf_sound = loadSound("assets/barf.wav");
      hunger_sound = loadSound("assets/chirp.wav");
      die_sound = loadSound("assets/die.wav");


      //change the speed of the animation, higher delay = slower speed
      idle_animation.frameDelay = 8;

    }

    function setup() {

      var canvas = createCanvas(32, 36);

      canvas.style("width", width * pixelScale + "px");
      canvas.style("height", height * pixelScale + "px");
      noSmooth();

      //create a sprite character at position x, y, width, height
      character = createSprite(16, 16, 32, 32);

      //add all the animations ("label", animation_variable)
      //I will use the label later
      character.addAnimation('idle', idle_animation);
      character.addAnimation('eat', eat_animation);
      character.addAnimation('hungry', hungry_animation);
      character.addAnimation('barf', barf_animation);
      character.addAnimation('die', die_animation);


      //create a sprite for the button
      feed = createSprite(4, 32, 4, 4);
      //assign a p5 image as appearance
      feed.addImage(feed_icon);

      //assign a function to be called when the button is clicked
      feed.onMousePressed = function() {

        //feed only if the animation is idle or hungry to avoid cutting off the other animations
        if (character.getAnimationLabel() == "idle" || character.getAnimationLabel() == "hungry") {

          //reduce hunger
          hunger-= 4;

          //if fed
          if (hunger >= 0) {

            character.changeAnimation("eat");
            //rewind the animation to make sure it's playing from the beginning
            character.animation.rewind();
            eat_sound.play();
          }

          //if overfed
          if (hunger < 0)
          {
            hunger = 0;
            character.changeAnimation("barf");
            character.animation.rewind();
            barf_sound.play();
          }
        }

      }

      //when the mouse goes on over the button change the image
      feed.onMouseOver = function() {
        feed.addImage(feed_icon_roll);
      }

      //when the mouse exits the button restore the image
      feed.onMouseOut = function() {
        feed.addImage(feed_icon);
      }


    }

    function draw() {
      background(0);
      //draw image background
      image(bg_image, 0, 0);

      //increase hunger every 2 seconds - 60 frames per second
      //frameCount is the number of frames since start
      if(frameCount%60*2 == 0)
        {
        //is hunger less than the maximum value
        if(hunger<MAX_HUNGER)
          {
          //increase hunger
          hunger++;
          }

        if(hunger>6 && dead == false)
          {
          //is hunger in the danger zone play warning animation
          character.changeAnimation("hungry");
          hunger_sound.play();
          }

        //is hunger more than the maximum and it's still alive
        if(hunger>=MAX_HUNGER && dead == false)
          {
          //die
          character.changeAnimation("die");
          //change the "state" variable dead
          dead = true;
          hunger_sound.stop();
          die_sound.play();
          //remove the button sprite
          feed.remove();
          }
        }

      //manage animations


      //check if animation labeled "eat" just ended, current frame == last frame
      //is so change the animation back to idle
      if (character.getAnimationLabel() == "eat" && character.animation.getFrame() == character.animation.getLastFrame()) {
        character.changeAnimation("idle");
      }

      //same thing for barf
      if (character.getAnimationLabel() == "barf" && character.animation.getFrame() == character.animation.getLastFrame()) {
        character.changeAnimation("idle");
      }

      //draw all the sprites: character, button (in order of creation)
      drawSprites();

      if(dead == false)
      {
      //AFTER THE SPRITES are drawn you can still add normal p5 visuals
      //like a status bar
      stroke("#343229");
      fill("#f27614");
      var rectangleLength = map(hunger, 0, MAX_HUNGER, 0, 20);
      rect(9,30, floor(rectangleLength), 3);
      }


    }
