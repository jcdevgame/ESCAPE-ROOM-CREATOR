# Escape Room Creator
Escape Room Creator was a side project I did whenever I had free time. This is a place where you can create your own online escape rooms. You have the ability to create blocks, program them, and modify it's properties.

### What can you do?
- Program new sprites
- Good way to learn programming

## How to Use:
This will provide a short tutorial on how to use it and the features it has.

### Creating Sprites:
There are 2 different ways to make a sprite:
- Pressing

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
