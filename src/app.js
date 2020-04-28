import * as Phaser from 'phaser'

var sprite
var keys
var animating 
var footsteps
var map
var layer
var tiles

var config = {
  type: Phaser.AUTO,
  width: 100,
  height: 100,
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
  this.load.audio('footstep', '../assets/footstep.wav')
  this.load.image('background', '../assets/background.jpg')
  this.load.tilemapCSV('map', '../data/redhall.csv')
  this.load.image('tiles', '../assets/tilemap.png')
}

function create() {
  this.physics.world.setFPS(8)

  map = this.make.tilemap({key: 'map', tileWidth: 8, tileHeight: 8})

  tiles = map.addTilesetImage('tiles')
  layer = map.createStaticLayer('layer', tiles)

  layer.setCollisionBetween(0, 8);
  layer.setCollisionBetween(14, 15);

  sprite = this.physics.add.sprite(48, 96, 'player')
  sprite.setCollideWorldBounds(true)

  this.physics.add.collider(sprite, layer)
  this.physics.world.setBounds(0, 0, 128, 128)



  this.sound.audioPlayDelay = 0.1;
  this.sound.loopEndOffset = 0.05;

  footsteps = this.sound.add('footstep')

  var loopMarker = {
    name: 'loop',
    start: 0,
    duration: 0.25,
    config: {
        loop: true
    }
  }

  footsteps.addMarker(loopMarker)

  //background = this.add.tileSprite(0, 0, 2650, 1720, 'background')
  //background.fixedToCamera = true

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

  this.cameras.main.setBounds(0, 0, 128, 128)
  this.cameras.main.startFollow(sprite)
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
      footsteps.play('loop')
    }
    walking = true
  } 
  
  if (keys.left.isDown) {
    sprite.setVelocityX(-velocity)
    if (!animating) {
      sprite.play('walk-left')
      footsteps.play('loop')
    }
    walking = true
  }
  
  if (keys.up.isDown) {
    sprite.setVelocityY(-velocity)
    if (!animating) {
      sprite.play('walk-up')
      footsteps.play('loop')
    }
    walking = true
  } 

  if (keys.right.isDown) {
    sprite.setVelocityX(velocity)
    if (!animating) {
      sprite.play('walk-right')
      footsteps.play('loop')
    }
    walking = true
  } 

  if (!walking) {
    sprite.setVelocity(0) 
    sprite.anims.stop()
    footsteps.stop()
  }

  animating = walking
}
