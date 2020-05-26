import { Application } from 'pixi.js'
import {gsap} from "gsap"
import {PixiPlugin} from "gsap/PixiPlugin.js"
import {MotionPathPlugin} from "gsap/MotionPathPlugin.js"

//without this line, PixiPlugin and MotionPathPlugin may get dropped by your bundler (tree shaking)...
// gsap.registerPlugin(PixiPlugin, MotionPathPlugin);





let Container = PIXI.Container;
let loader = PIXI.loader;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;

let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  resizeTo: window,
  transparent: true,
  antialias: true,

});

app.ticker.autoStart = false,
  app.ticker.stop();

// Now, we use 'tick' from gsap
gsap.ticker.add(() => {
  app.ticker.update();
});



//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
app.stage.interactive = true;

//stop the pixi built in animation ticker


// reusable
let posX, displacementSprite, displacementFilter, bg, vx, state, bubble, stepTwo, logos, introScene, landingScene, mainScene;





// pixi built in loader to load assets
loader
  .add("assets/logoSheet.json")
  .add("assets/water.png")
  .load(setup);


// setup function aka the magic
function setup() {

  mainScene = new Container();
  introScene = new Container();
  app.stage.addChild(mainScene);

  //Create an alias for the texture atlas frame ids
  let id = resources["assets/logoSheet.json"].textures;

  //Make the sprites and add them to the `mainScene`


  //bubbles
  //Make the bubbles
  let logoBubblesCount = 100

  let spacing = 28
  let xOffset = 30
  let yOffset = 150
  let speed = 2
  let direction = -1

  bubbleContainer = new Container();
  mainScene.addChild(bubbleContainer);

  //An array to store all the bubbles
  let bubbles = [];

  //Make as many bubbles as there are `numberOfbubbles`
  for (let i = 0; i < logoBubblesCount; i++) {
    let bubble = new Sprite(id["masterSheet.png"]);
    bubble.interactive = true; // enable mouse and touch events    
    bubble.buttonMode = true; // show hand cursor on mouseover
    //Make a bubble
    //Space each bubble horizontally according to the `spacing` value.
    //`xOffset` determines the point from the left of the screen
    //at which the first bubble should be added


    //Give the bubble a random y position
    /* let y = randomInt(150, app.screen.height); */



    //Set the bubbles position
    /*  baseScale = 1; */  // set in gsap
    // let x = spacing * i + xOffset; // set in gsap
    // var y = Math.sin(deg) * yOffset; // set in gsap
    var deg = Math.random() * Math.PI * 14;
   

    /*  bubble.scale.set(baseScale) */
   // bubble.anchor.set(0.5); set in gsap

    //Set the bubble's vertical velocity. `direction` will be either `1` or
    //`-1`. `1` means the enemy will move down and `-1` means the bubble will
    //move up. Multiplying `direction` by `speed` determines the bubble's
    //vertical direction
    bubble.vy = speed * direction;

    //Reverse the direction for the next bubble
    direction *= 1;


    bubbleContainer.addChild(bubble);

    let tl = gsap.timeline();
    tl.set(bubble, {
      pixi: {
        scale: gsap.utils.random(0.12, 0.3),
        alpha: 0.7,
        y: "+=" + Math.random() * app.renderer.screen.width,
        x: spacing * i + xOffset,
        anchor: 0.5,
      }
    }),
      tl.add(moveLogoBubbles);



    function moveLogoBubbles() {
      let child = gsap.timeline();
      child.to(bubble, {
        pixi: {
          x: "+=" + gsap.utils.random(600, -600),
          y: "+=" + (Math.random() * yOffset + -1000),
        },
        repeat: -1,
        yoyo: true,
        duration: 40,
        ease: "sine.out"
      });
      return child;
    }



    let hvrTl = gsap.timeline({
      paused: true
    });
    hvrTl.to(bubble, {
      pixi: {
        scale: '+= .1',
        alpha: 1
      },
      ease: "sine.in"
    });



    // MOUSE EVENTS
    bubble.pointerover = function () {

      hvrTl.play();
      hvrNestedLogo.play();
    }

    bubble.pointerout = function () {

      hvrTl.reverse();
      hvrNestedLogo.reverse();

    }







    let logoList = [];

    logosContainer = new Container();
    bubble.addChild(logosContainer);
    for (let j = 0; j < logoBubblesCount; j++) {
      var newLogoArr = logoImgArr[~~(Math.random() * logoImgArr.length)]
      logoList.push(newLogoArr);
    }

    nestedLogo = new Sprite(id[logoList[i]]);
    logosContainer.addChild(nestedLogo);
    nestedLogo.interactive = true; // enable mouse and touch events    
    nestedLogo.buttonMode = true; // show hand cursor on mouseover


    // nested logo gsap sets and animations
    let nestLogoTL = gsap.timeline();
    nestLogoTL.set(nestedLogo, {
      pixi: {
        scale: .2,
        alpha: .5,
        anchor: 0.5,
        blur: 20
      }
    })


    let hvrNestedLogo = gsap.timeline({ paused: true });
    hvrNestedLogo
      .to(nestedLogo, {
        pixi: {
          blur: 0,
          alpha: 1,
        },
        ease: "sine.in"
      });





    //Push the bubble into the `bubbles` array
    bubbles.push(bubble);
    //Add the bubble to the `gameScene`

  }
}



//The `randomInt` helper function
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate random item from array
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



// random logo textures
const logoImgArr = ["Raines_Explorer_clear.png",
  "Raines__clear.png",
  "Raines_Air-Traffic-Controller.png",
  "Raines_Ambadassador.png",
  "Raines_Architect_white.png",
  "Raines_Benefactress.png",
  "Raines_Blitz-Defense.png",
  "Raines_Coach.png",
  "Raines_Conductor_white.png",
  "Raines_Consigliere.png",
  "Raines_Cyborg_white.png",
  "Raines_Diamond-Cutter.png",
  "Raines_Essentialist copy.png",
  "Raines_Executor.png",
  "Raines_First-Class-Attendent.png",
  "Raines_Force-Multiplier_white.png",
  "Raines_Ice-Cream-Cone.png",
  "Raines_Innovator.png",
  "Raines_MacGyver_white.png",
  "Raines_Magician.png",
  "Raines_Man-Curtain.png",
  "Raines_Matchmaker_white.png",
  "Raines_Musher.png",
  "Raines_Paratrooper_clear.png",
  "Raines_Rebel-Cause.png",
  "Raines_Rennovator.png",
  "Raines_Rising-Tide.png",
  "Raines_Sleuth.png",
  "Raines_St-Bernard.png",
  "Raines_Stage-Manager.png",
  "Raines_Story-Doer_white.png",
  "Raines_Swiss-Army-Knife.png",
  "Raines_Tastemaker.png",
  "Raines_Thresher.png",
  "Raines_Tigger.png",
  "Raines_Transport-Helicopter.png",
  "Raines_Watson.png"];