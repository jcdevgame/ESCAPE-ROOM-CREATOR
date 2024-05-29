class InputManager { 
    constructor() {
        this.keys = {}; // Store the state of each key (pressed or not)
        this.setupKeyboardListeners();
    }

    setupKeyboardListeners() {
        // Add event listeners for keydown and keyup events
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        // Update the key state when a key is pressed
        this.keys[event.key] = true;
    }

    handleKeyUp(event) {
        // Update the key state when a key is released
        this.keys[event.key] = false;
    }

    isKeyPressed(key) {
        // Check if a specific key is currently pressed
        return this.keys[key] || false;
    }
}

class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = new Map(); // Store loaded audio buffers
    }

    async loadSound(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.sounds.set(url, audioBuffer);
            return audioBuffer;
        } catch (error) {
            console.error(`Error loading sound from ${url}: ${error.message}`);
            return null;
        }
    }

    playSound(url, volume = 1.0) {
        const buffer = this.sounds.get(url);
        if (buffer) {
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = volume;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            source.start();
        } else {
            console.warn(`Sound not loaded: ${url}`);
        }
    }
}


class ParticleManager {
    constructor() {
        this.particles = [];
    }

    createParticle(x, y, velocityX, velocityY, lifetime) {
        const particle = {
            x,
            y,
            velocityX,
            velocityY,
            lifetime,
        };
        this.particles.push(particle);
    }

    createRandomParticle(x, y, lifetime) {
        const velocityX = Math.random() * 2 - 1; // Random X velocity between -1 and 1
        const velocityY = Math.random() * 2 - 1; // Random Y velocity between -1 and 1
        this.createParticle(x, y, velocityX, velocityY, lifetime);
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.lifetime--;
            if (particle.lifetime <= 0) {
                this.particles.splice(i, 1); // Remove expired particles
            }
        }
    }

    renderParticles(context, color) {
        context.fillStyle = color; // Particle color
        for (const particle of this.particles) {
            context.fillRect(particle.x, particle.y, 5, 5); // Draw a small square for each particle
        }
    }
}


class Animation {
    constructor(imageArray) {
        this.frames = imageArray; // Array of image URLs or Image objects
        this.currentFrame = 0; // Index of the current frame
        this.frameInterval = 100; // Time (in milliseconds) between frames
        this.isPlaying = false; // Whether the animation is currently playing
        this.playElgibility = false;
    }

    playOnSprite(targetSprite) {
        this.playElgibility = true;
        if(this.playElgibility == true){
            if (!this.isPlaying) {
                this.isPlaying = true;
                const animate = () => {
                    if(this.playElgibility == true){
                    targetSprite.imgID = this.frames[this.currentFrame];
                    this.currentFrame = (this.currentFrame + 1) % this.frames.length;
                    setTimeout(animate, this.frameInterval);
                    }
                };
                animate();
            }
        }
    }

    stop() {
        this.isPlaying = false;
        this.playElgibility = false;
        this.currentFrame = 0;
    }

    setFrame(frameIndex) {
        if (frameIndex >= 0 && frameIndex < this.frames.length) {
            this.currentFrame = frameIndex;
        } else {
            console.error('Invalid frame index.');
        }
    }
}


class UIManager {
    constructor(canvas, ctx, x, y, width, height, color, text, font = '40pt Arial', fontColor, borderWidth, borderColor, onclick, notclicked){
        this.canvas = canvas;
        this.ctx = ctx;
        this.onclick = onclick
        this.notclicked = notclicked;
        this.text = text

        this.rect = {
            x: x,
            y: y,
            fontColor: fontColor,
            width: width,
            height: height,
            color: color, 
            font: font,
            borderWidth: borderWidth,
            borderColor: borderColor,
        }

        this.canvas.addEventListener('click', (evt) => {
            this.MousePos = this.getMousePos(evt)

            if (this.isInside(this.MousePos, this.rect)) {
                this.onclick();
            } else {
                
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
        return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
    }

    drawUI() {
        this.ctx.beginPath();
        this.ctx.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        this.ctx.fillStyle = this.rect.color;
        this.ctx.fill();
        this.ctx.lineWidth = this.rect.borderWidth;
        this.ctx.strokeStyle = this.rect.borderColor;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.font = this.rect.font;
        this.ctx.fillStyle = this.rect.fontColor;
    
        // Measure the width of the text
        var textWidth = this.ctx.measureText(this.text).width;
    
        // Calculate the position to center the text
        var textX = this.rect.x + (this.rect.width - textWidth) / 2;
        var textY = this.rect.y + (this.rect.height + parseInt(this.rect.font)) / 2;
    
        this.ctx.fillText(this.text, textX, textY);
    }
    
}


export{InputManager, AudioManager, ParticleManager, Animation, UIManager}