# Escape Room Creator
Escape Room Creator was a side project I did whenever I had free time. This is a place where you can create your own online escape rooms. You have the ability to create blocks, program them, and modify it's properties.

### What can you do?
- Program new sprites
- Good way to learn programming

## How to Use:
This will provide a short tutorial on how to use Escape Room Creator and the features it has.

### Blocks:
One of the core features of Escape Room Creator are blocks.
#### Create Blocks:
There are 2 different ways to make a sprite:
- Pressing the `Create Block` button.
- Loading a sprite from a `.json` file.
#### Changing Properties of Blocks:
To change the properties of your Block, you need to select it
Changing the properties of your Blocks allows you to change the appearance and position. Some of the main properties that are crucial for your Escape Room is:
- `x` X Coords for the block
- `y` Y Coords for the block
- `width` Your block's width
- `height` Your block's height
- `imgID` If you want your block to have a custom appearance (You can only get image urls.)
#### Adding a Click Detector to your Block:
In order to make youe `Onclick Script` to work, you need to add a click detector to your Block:
1. Select your Block from the explorer
2. Press Add Click Detector
3. You should have a click detector now
#### Deleting a Block
In order to remove a Block from your Escape Room:
1. Select your Block from the explorer
2. From the top bar, press Delete Block
3. Your Block should be Deleted

### Programing:
You can program your blocks to have more customization over your blocks, allowing for a more advanced Escape Room.
#### Script Types:
There are different types of scripts that have different functionalities:
- `General Script` General script that fires once when `play` is pressed
- `Forever Script` Forever script that runs 60FPS Max (depends on your browser). This is usually used for movements.
- `Onclick Script` This script is only fired when the block is clicked (Can be used as clues for your escape room)
#### Saving your Script to a Block:
In order to save your script to make sure it is fired, you need to know how to save your script to your block.
1. When your finished with your script, go to explorer (Should be on the left)
2. Find the block you want to save to (inside the explorer) and select it
3. Once you selected it, below your script, press Save
#### Loading your Script from a Block:
In order to retrieve your scripts from the block, you need to know how to load it from the block.
1. Find the block you want to load from inside the explorer
2. Select it
3. Once you selected it, find the specific script type in the script editors below
4. In your selected script type script editor, press load.
5. The script with that code should be loaded into the editor.
6. (MAKE SURE YOU SAVED THE CODE TO YOUR SPRITE BEFORE LOADING ANOTHER SCRIPT)

### Saving/Loading your Escape Rooms:
In order to keep your progress, you need to know how to save and load.
#### Saving your Escape Room:
To save, you need to do the following:
1. In the top bar, press save
2. Once your press save, it will prompt you to download a `.json` file
3. You have saved it
#### Loading your Escape Room:
In order to load youe Save File, do the following:
1. In the top bar, press load
2. Once you press load, it will prompt you to select your `.json` save file
3. You have successfully loaded your save file

## Documentation:
All of these different classes with their methods, properties, will become incredibly useful when you decide to program something using Escape Room Creator, and I will highly recommend doing that.

### Sprite Class:
#### Properties:
- `x`
- `y`
- `width`
- `height`
- `anchored`
- `color`
- `mass`
- `imgID`
- `flipHorizontally`
- `flipVertically`
#### Methods:
- `findObjectByName(classNameToFind)` (Used to find and gives the ability to change the properties of another sprite)
- `movementDefault()`
- `update()`

### InputManager:
#### Methods:
- `isKeyPressed(key)` (Check if a key is pressed, it returns a true/false statement, so it can be used in an if statement: `if (this.inputManager.isKeyPressed("w")`

### AudioManager:
#### Methods:
- `loadSound(url)` (Used to load a sound)
- `playSound(url, volume = 1.0)` (Used to play a sound)

### ParticleManager:
#### Methods:
- `createParticle(x, y, velocityX, velocityY, lifetime)` Used to create a particle at a location, with a velocity
- `createRandomParticle(x, y, lifetime)` Create a random particle at a location with a random velocity
- `updateParticles()` Used to update the particles
- `renderParticles(context, color)` Used to render the particles.

### Animation:
#### Constructor: 
`constructor(imageArray)` Provide it with an image array (the animation keyframes)
#### Methods:
- `playOnSprite(targetSprite)` Play on a sprite
- `stop()` Stop anim
- `setFrame(frameIndex)` Set Frame

## Future Additions:
- Ability to Export your game as a .zip file
- File explorer so you can have a proper way to store the images locally
