import * as Phaser from 'phaser'

var sprite
var keys
var animating 

var config = {
  type: Phaser.AUTO,
  width: 80,
  height: 60,
  pixelArt: true,
  zoom: 8,
  physics: {
    default: 'arcade',
    arcade: {},
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
}

var game = new Phaser.Game(config)

function preload() {
  this.load.spritesheet('player', '../assets/player.png', { frameWidth: 8, frameHeight: 9})
}

function create() {
  this.physics.world.setFPS(8)

  this.anims.create({
    key: 'walk-down',
    repeat: -1,
    frameRate: 8,
    frames: this.anims.generateFrameNames('player', {start: 0, end: 3}) 
  })

  this.anims.create({
    key: 'walk-left',
    repeat: -1,
    frameRate: 8,
    frames: this.anims.generateFrameNames('player', {start: 4, end: 7}) 
  })

  this.anims.create({
    key: 'walk-up',
    repeat: -1,
    frameRate: 8,
    frames: this.anims.generateFrameNames('player', {start: 8, end: 11}) 
  })

  this.anims.create({
    key: 'walk-right',
    repeat: -1,
    frameRate: 8,
    frames: this.anims.generateFrameNames('player', {start: 12, end: 15}) 
  })

  keys = this.input.keyboard.createCursorKeys()

  sprite = this.physics.add.sprite(20, 20, 'player')
  sprite.setCollideWorldBounds(true)
}

function update() {
  var walking
  var velocity = 16

  if (keys.space.isDown) {
    velocity *= 2
  }

  if (keys.down.isDown) {
    sprite.setVelocityY(velocity)
    if (!animating) {
      sprite.anims.play('walk-down')
    }
    walking = true
  } 
  
  if (keys.left.isDown) {
    sprite.setVelocityX(-velocity)
    if (!animating) {
      sprite.play('walk-left')
    }
    walking = true
  }
  
  if (keys.up.isDown) {
    sprite.setVelocityY(-velocity)
    if (!animating) {
      sprite.play('walk-up')
    }
    walking = true
  } 

  if (keys.right.isDown) {
    sprite.setVelocityX(velocity)
    if (!animating) {
      sprite.play('walk-right')
    }
    walking = true
  } 

  if (!walking) {
    sprite.setVelocity(0) 
    sprite.anims.stop()
  }

  animating = walking
}
