import { InputManager, AudioManager, ParticleManager, Animation, UIManager } from "./engine.js";

/*
Global vars
*/

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

document.getElementById("newblockid").addEventListener("click", newBlock);
document.getElementById("deleteblockid").addEventListener("click", deleteBlock);

let GameObjects = {};

let blockCount = 0;
let selectedBlock = null;

let programStarted = false;

const loadbutton = document.getElementById("load");

const replace = document.getElementById("texttoreplace")

loadbutton.addEventListener("click", function() {
    fetch('SaveFile.json')

    .then(res => res.json())

    .then(data => {
        console.log(data);
        GameObjects = data;
    });
})

/*
classes and stuff 
*/

function convertFunctionsToStrings(gameObjects) {
    for (let key in gameObjects) {
      let obj = gameObjects[key];
      for (let prop in obj) {
        if (typeof obj[prop] === 'function') {
          obj[prop] = obj[prop].toString();
        }
      }
    }
}
  
// Create a function to trigger the download
function downloadJsonFile(data, filename) {
    // Creating a blob object from the JSON data
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
  
    // Create a new anchor element  
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; 
    a.click();
  
    URL.revokeObjectURL(url);
}

const savebutton = document.getElementById("save");

savebutton.addEventListener("click", function() {
    if (GameObjects) {
        convertFunctionsToStrings(GameObjects);
        downloadJsonFile(GameObjects, 'SaveFile');
    } 
    else {
        console.error("Save file blank, error 5");
    }
});
  
  //downloadJsonFile(GameObjects, 'SaveFile');
  

class Sprite {
    constructor(xPos, yPos, xSize, ySize, anchored, color, mass, animAvailable, imgID) {
        this.x = xPos; // X-coordinate of the sprite
        this.y = yPos; // Y-coordinate of the sprite

        this.width = xSize; // Width of the sprite
        this.height = ySize; // Height of the sprite
        this.anchored = anchored; // Whether physics apply (e.g., gravity)
        this.color = color; // Color of the sprite
        this.mass = mass; // Mass of the sprite
        this.imgID = imgID; // Image ID of the sprite
        this.flipHorizontally = false; // Flag for horizontal flipping
        this.flipVertically = false; // Flag for vertical flipping
        this.Gravity = 1;
        this.CanvasHeight = 600;
        this.xv = 0;
        this.yv = 0;
        this.scrollx = 0;
        this.scrolly = 0;
        this.falseX = 400;
        this.jumping = false;
        this.inputManager = new InputManager();

        this.hasonclick = false;

        this.clueManager;

        this.program = null;
        this.foreverprogram = null;
        this.onclickprogram = null;
    }

    findObjectByName(classNameToFind) {
        if (GameObjects.hasOwnProperty(classNameToFind)) {
            console.log(`Found class: ${classNameToFind}`);
            return GameObjects[classNameToFind];
        } else {
            console.log(`Class ${classNameToFind} not found.`);
            return null;
        }
    }
    
    

    movementDefault(){

        if (this.inputManager.isKeyPressed("i")) {
            this.y -= 10
        }
        if (this.inputManager.isKeyPressed("j")) {
            this.x -= 3;
        }
        if (this.inputManager.isKeyPressed("l")) {
            this.x += 3;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    

    SideScroller(userground){
        this.setupSideScroll();

        this.xv = 0;
        this.yv = 0;
        let maxSpeed = 0.75; // Set your desired maximum speed
    
        if (this.inputManager.isKeyPressed("a")) {
            this.xv += -0.75;
        } else if (this.inputManager.isKeyPressed("d")) {
            this.xv += 0.75;
        } else {
            this.xv = 0;
        }
    
        // Limit the speed
        if (this.xv > maxSpeed) {
            this.xv = maxSpeed;
        } else if (this.xv < -maxSpeed) {
            this.xv = -maxSpeed;
        }
    
        if (this.inputManager.isKeyPressed("w") && !this.jumping) {
            this.yv -= 50;
            this.update();
            this.sleep(5000);
            this.jumping = true

        } else {
            this.yv = 0;
        }
    
        this.x = this.xv;
    
        this.getsidescrollpos();
        let cameraDelay = 1; // Adjust this value to your liking
        this.scrollx = this.scrollx + cameraDelay * (this.x - this.scrollx);
    
        this.OBJtomove(userground);
    }
    

    FreeCamEXPERIMENTAL(userground){
        this.setupSideScroll();
    
        this.xv = 0;
        this.yv = 0;
        let maxSpeed = 0.75; // Set your desired maximum speed
    
        if (this.inputManager.isKeyPressed("a")) {
            this.xv -= 20;
        } else if (this.inputManager.isKeyPressed("d")) {
            this.xv += 20;
        } else {
            this.xv = 0;
        }
    
        // Limit the speed
        if (this.xv > maxSpeed) {
            this.xv = maxSpeed;
        } else if (this.xv < -maxSpeed) {
            this.xv = -maxSpeed;
        }
    
        if (this.inputManager.isKeyPressed("w") && !this.jumping) {
            this.yv -= 10;
            this.update();
        } else if (this.inputManager.isKeyPressed("s")) {
            this.yv += 10;
        } else {
            this.yv = 0;
        }
    
        this.x = this.xv;
        this.y = this.yv;
    
        this.getsidescrollpos();
        let cameraDelay = 1; // Adjust this value to your liking
        this.scrollx = this.scrollx + cameraDelay * (this.x - this.scrollx);
        this.scrolly = this.scrolly + cameraDelay * (this.y - this.scrolly);

        this.OBJtomove(userground);
    }
    

    setupSideScroll(){
        this.scrollx = 0;
        this.scrolly = 0;
        this.x = 0;
        this.y += this.yv;
        this.yv = 0;
        this.xv = 0;
    }

    getsidescrollpos(){
        this.x = this.x - this.scrollx
        this.y = this.y - this.scrolly
    }

    OBJtomove(userground, parallaxEnabled, distance){
        if (parallaxEnabled){
            userground.x = userground.x - (this.scrollx * distance);
            userground.y = userground.y - (this.scrolly);
        } else{
            userground.x = userground.x - this.scrollx
            userground.y = userground.y - this.scrolly
        }
    }

    draw(ctx) {

    
        if (this.imgID) {
            const img = new Image();
            img.src = this.imgID;
    
            // Adjust rendering based on flip flags
            if (this.flipHorizontally) {
                ctx.save();
                ctx.scale(-1, 1); // Flip horizontally
                ctx.drawImage(img, -this.x - this.width, this.y, this.width, this.height);
                ctx.restore();
            } else if (this.flipVertically) {
                ctx.save();
                ctx.scale(1, -1); // Flip vertically
                ctx.drawImage(img, this.x, -this.y - this.height, this.width, this.height);
                ctx.restore();
            } else {
                ctx.drawImage(img, this.x, this.y, this.width, this.height);
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
}

callForeverProgram() {
    if (this.foreverprogram) {
        this.foreverprogram(this); 
    }
}

    update() {
        this.callForeverProgram();
        
        if (!this.anchored) {
            if (this.jumping) {
                this.yv += this.Gravity; // Gravity pulls down
                this.y += this.yv; // Velocity changes position

                // If we've hit the ground, stop jumping
                if (this.y >= this.CanvasHeight - this.height) {
                    this.y = this.CanvasHeight - this.height;
                    this.yv = 0;
                    this.jumping = false;
                }
            } else{
                this.y += this.Gravity; // Velocity changes position
            }
        }
    }
    
    callProgram() {
        if (this.program) {
            this.program(this); 
        }
    }

    callProgramOnclick() {
        if (this.onclickprogram) {
            this.onclickprogram(this); 
        }
    }

    checkTouching(otherSprite) {
        return (
            this.x < otherSprite.x + otherSprite.width &&
            this.x + this.width > otherSprite.x &&
            this.y < otherSprite.y + otherSprite.height &&
            this.y + this.height > otherSprite.y
        );
    }

    collisionHandling(collisionSprite) {
        if (this.checkTouching(collisionSprite)) {
            this.jumping = false;
            // Calculate total mass for pushing behavior
            const totalMass = this.mass + collisionSprite.mass;
    
            // Calculate relative mass ratio
            const massRatio = this.mass / collisionSprite.mass;
    
            // Adjust positions based on mass ratio
            const overlapX = Math.min(
                Math.abs(this.x - collisionSprite.x - collisionSprite.width),
                Math.abs(this.x + this.width - collisionSprite.x)
            );
    
            const overlapY = Math.min(
                Math.abs(this.y - collisionSprite.y - collisionSprite.height),
                Math.abs(this.y + this.height - collisionSprite.y)
            );
    
            if (overlapX < overlapY) {
                if (this.x < collisionSprite.x) {
                    this.x = collisionSprite.x - this.width;
                    collisionSprite.x += overlapX * massRatio;
                } else {
                    this.x = collisionSprite.x + collisionSprite.width;
                    collisionSprite.x -= overlapX * massRatio;
                }
            } else {
                if (this.y < collisionSprite.y) {
                    this.y = collisionSprite.y - this.height;
                    collisionSprite.y += overlapY * massRatio;
                } else {
                    this.y = collisionSprite.y + collisionSprite.height;
                    collisionSprite.y -= overlapY * massRatio;
                }
            }
        }
    }

    setProgram(func) {
    this.program = func;
    }
}

class clueManager {
    constructor(canvas, ctx, block, onclick, notclicked){
        this.canvas = canvas;
        this.ctx = ctx;
        this.onclick = onclick
        this.notclicked = notclicked;

        this.rect = block

        this.rect.hasonclick = true;

        console.log("Worked")

        this.canvas.addEventListener('click', (evt) => {
            this.MousePos = this.getMousePos(evt)

            console.log(this.MousePos);

            if (this.isInside(this.MousePos, this.rect)) {
                console.log("clicked")

                this.rect.callProgramOnclick();
            } else {
                console.log("clue not clicked")
            }
        }, false);
    }

    getMousePos(event) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }    
    

    isInside(pos, rect) {
        // Adjust the mouse position by the amount the canvas is translated
        const adjustedPos = {
            x: pos.x,
            y: pos.y
        };
        return adjustedPos.x > rect.x && adjustedPos.x < rect.x + rect.width && adjustedPos.y < rect.y + rect.height && adjustedPos.y > rect.y;
    }
}

/*
newblock func
*/

function newBlock() {
    blockCount++;
    let blockName = "block" + blockCount;
    const block = new Sprite(100, 100, 50, 50, true, "#050dff", 1, false);
    block.layer = blockCount; 
    block.name = blockName; 
    GameObjects[blockName] = block;

    // Create a new button element
    const newButton = document.createElement("button");
    newButton.id = blockName;
    block.button = newButton;
    
    newButton.innerHTML = blockName;
   
    document.getElementById("explorer").appendChild(newButton);


    newButton.addEventListener("click", function() {
        selectedBlock = block;
       
        const propertiesDiv = document.getElementById("properties");
       
        propertiesDiv.innerHTML = "";
        
        const propertiesToDisplay = ["name", "x", "y", "width", "height", "anchored", "color", "imgID", "flipVertically", "flipHorizontally", "layer"];
        
        for (let property of propertiesToDisplay) {
            if (property === "name" || block.hasOwnProperty(property)) {
                const propertyLabel = document.createElement("label");
                propertyLabel.innerHTML = property + ": ";
                const propertyInput = document.createElement("input");
                propertyInput.value = property === "name" ? blockName : block[property];
                
                propertyInput.addEventListener("change", function() {
                    if (property === "name") {
                        
                        const newName = propertyInput.value;
                       
                        GameObjects[newName] = GameObjects[blockName];
                        delete GameObjects[blockName];
                        
                        newButton.innerHTML = newName;
                        
                        blockName = newName;
                    } else if (property === "layer") {
                        
                        const newLayer = parseInt(propertyInput.value, 10);

                        for (let otherKey in GameObjects) {
                            if (GameObjects.hasOwnProperty(otherKey) && otherKey !== blockName) {
                                if (GameObjects[otherKey].layer >= newLayer) {
                                    GameObjects[otherKey].layer++;
                                }
                            }
                        }
                        
                        block[property] = newLayer;
                    } else {
                        block[property] = propertyInput.value;
                    }
                });
                
                propertiesDiv.appendChild(propertyLabel);
                propertiesDiv.appendChild(propertyInput);
            }
        }
    });
    
    console.log(GameObjects);
}

function deleteBlock() {
    if (selectedBlock) {
        // Remove the block from the blocks object
        delete GameObjects[selectedBlock.name];
        // Remove the button from the Explorer div
        document.getElementById("explorer").removeChild(selectedBlock.button);  // Use the stored reference to the button
        // Decrease the layer of each block that is above the deleted block by one
        for (let otherKey in GameObjects) {
            if (GameObjects.hasOwnProperty(otherKey) && GameObjects[otherKey].layer > selectedBlock.layer) {
                GameObjects[otherKey].layer--;
            }
       
        }
        blockCount--;
        
        selectedBlock = null;
        
        document.getElementById("properties").innerHTML = "";
    }
}

/*
what the buttons do
*/

const startbutton = document.getElementById("play");
const stopbutton = document.getElementById("stop");

// Get the "Make Clue" button
const makeClueButton = document.getElementById("left-panel").querySelector("button");

const saveToButton = document.getElementById("saveto");
const loadFromButton = document.getElementById("loadfrom");

const saveToButtonClick = document.getElementById("savetoclick");
const loadFromButtonClick = document.getElementById("loadfromclick");

const saveToButtonForever = document.getElementById("savetoforever");
const loadFromButtonForever = document.getElementById("loadfromforever");

const blockScriptTextEditor = document.getElementById("textarea");
const blockScriptTextEditorClick = document.getElementById("onclicktextarea");
const blockScriptTextEditorForever = document.getElementById("textareaforever");

loadFromButtonForever.addEventListener("click", function() {
    if (selectedBlock) {
        console.log("Loaded", selectedBlock.name,"script");
        if(selectedBlock.foreverprogram){
            let toText = selectedBlock.foreverprogram.toString();
            // Use a regular expression to remove the function definition
            let innerCode = toText.replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
            console.log("Code:",innerCode, "From",selectedBlock.name)
            blockScriptTextEditorForever.innerText = innerCode;
        }
        else{
            console.error("Cannot load NULL code, Code: 4");
        }
    } 
    else {
        console.error("Cant load from Null, Code: 2");
    }
});

saveToButtonForever.addEventListener("click", function() {
    if (selectedBlock) {
        console.log("Saved to", selectedBlock.name);
        
        if(blockScriptTextEditorForever.innerText){    
            selectedBlock.foreverprogram = new Function(blockScriptTextEditorForever.innerText);
        }
        else{
            console.error("Text Area Blank, Cannot Save");
        }
    } 
    else {
        console.error("Cant save to Null, Code: 2");
    }
});

loadFromButtonClick.addEventListener("click", function() {
    if (selectedBlock) {
        console.log("Loaded", selectedBlock.name,"script");
        if(selectedBlock.onclickprogram){
            let toText = selectedBlock.onclickprogram.toString();
            // Use a regular expression to remove the function definition
            let innerCode = toText.replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
            console.log("Code:",innerCode, "From",selectedBlock.name)
            blockScriptTextEditorClick.innerText = innerCode;
        }
        else{
            console.error("Cannot load NULL code, Code: 4");
        }
    } 
    else {
        console.error("Cant load from Null, Code: 2");
    }
});

saveToButtonClick.addEventListener("click", function() {
    if (selectedBlock) {
        console.log("Saved to", selectedBlock.name);
        
        if(blockScriptTextEditorClick.innerText){    
            selectedBlock.onclickprogram = new Function(blockScriptTextEditorClick.innerText);
        }
        else{
            console.error("Text Area Blank, Cannot Save");
        }
    } 
    else {
        console.error("Cant save to Null, Code: 2");
    }
});

// Add an event listener to the "Make Clue" button
makeClueButton.addEventListener("click", function() {
    if (selectedBlock) {
        console.log(selectedBlock.name);

        const clue = new clueManager(canvas, canvas, selectedBlock);
    } 
    else {
        console.error("Null Selected, Code: 1");
    }
});


saveToButton.addEventListener("click", function() {
    if (selectedBlock) {
        console.log("Saved to", selectedBlock.name);
        
        if(blockScriptTextEditor.innerText){    
            selectedBlock.program = new Function(blockScriptTextEditor.innerText);
        }
        else{
            console.error("Text Area Blank, Cannot Save");
        }
    } 
    else {
        console.error("Cant save to Null, Code: 2");
    }
});

/*
FireFromButton.addEventListener("click", function() {
    if (selectedBlock) {
        console.log("Firing", selectedBlock.name, "function");
        selectedBlock.callProgram();
    } 
    else {
        console.error("Cant fire Null, Code: 3");
    }
});
*/

loadFromButton.addEventListener("click", function() {
    if (selectedBlock) {
        console.log("Loaded", selectedBlock.name,"script");
        if(selectedBlock.program){
            let toText = selectedBlock.program.toString();
            // Use a regular expression to remove the function definition
            let innerCode = toText.replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
            console.log("Code:",innerCode, "From",selectedBlock.name)
            blockScriptTextEditor.innerText = innerCode;
        }
        else{
            console.error("Cannot load NULL code, Code: 4");
        }
    } 
    else {
        console.error("Cant load from Null, Code: 2");
    }
});

/*
Game loop
*/

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sortedKeys = Object.keys(GameObjects).sort((a, b) => GameObjects[b].layer - GameObjects[a].layer);

    if (programStarted){

    ctx.save();

    // Use the sorted keys to update and draw the blocks in the correct order
    for (let key of sortedKeys) {
        if (GameObjects.hasOwnProperty(key)) {
            GameObjects[key].update();
        }
    }

    }

    for (let key of sortedKeys) {
        if (GameObjects.hasOwnProperty(key)) {
            GameObjects[key].draw(ctx);
        }
    }

    requestAnimationFrame(gameLoop)
}

/*
Main Buttons Setup
*/

startbutton.addEventListener("click", function() {
    console.log("Starting...");

    programStarted = true;

    gameLoop();

    for (let key in GameObjects) {
        let sprite = GameObjects[key];
        sprite.callProgram();
    }
});

stopbutton.addEventListener("click", function() {
    console.log("Stopping...");

    programStarted = false;
});

/*
call gameloop
*/

gameLoop();