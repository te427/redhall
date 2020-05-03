import * as Phaser from 'phaser'

const LEFT = 'l'
const RIGHT = 'r'
const UP = 'u'
const DOWN = 'd'

const dirMap = {
  [LEFT]: checkLeft,
  [RIGHT]: checkRight,
  [UP]: checkUp,
  [DOWN]: checkDown,
}

var game
var scene
var player
var dwarf
var keys
var animating 
var footsteps
var map
var layer
var tiles
var menu 
var text
var talking
var yak
var dir = DOWN

var config = {
  type: Phaser.AUTO,
  width: 16 * 16,
  height: 16 * 12,
  pixelArt: true,
  zoom: 4,
  physics: {
    default: 'arcade',
    arcade: {},
  },
  scene: {
    key: 'game',
    preload: preload,
    create: create,
    update: update,
  },
}

game = new Phaser.Game(config)

function preload() {
  this.load.spritesheet('player', '../assets/pc.png', { frameWidth: 16, frameHeight: 16})
  this.load.spritesheet('dwarf', '../assets/dwarf.png', { frameWidth: 16, frameHeight: 16})
  this.load.audio('footstep', '../assets/footstep.wav')
  this.load.audio('dwarf', '../assets/dwarf.wav')
  this.load.tilemapCSV('map', '../assets/map.csv')
  this.load.image('tiles', '../assets/tiles.png')
  this.load.image('menu', '../assets/menu.png')
}

function create() {
  scene = this
  this.physics.world.setFPS(8)

  map = this.make.tilemap({key: 'map', tileWidth: 16, tileHeight: 16})

  tiles = map.addTilesetImage('tiles')
  layer = map.createStaticLayer('layer', tiles)

  layer.setCollisionBetween(0, 14);

  player = this.physics.add.sprite(16 * 16, 16 * 16, 'player')
  player.setCollideWorldBounds(true)

  this.physics.add.collider(player, layer)
  this.physics.world.setBounds(0, 0, 100 * 16, 100 * 16)

  dwarf = this.physics.add.sprite(24 * 16, 20 * 16, 'dwarf')
  this.physics.add.collider(player, dwarf)
  dwarf.setImmovable(true)

  this.sound.audioPlayDelay = 0.1;
  this.sound.loopEndOffset = 0.05;

  footsteps = this.sound.add('footstep')
  yak = this.sound.add('dwarf')

  var footstepsMarker = {
    name: 'walking',
    start: 0,
    duration: 0.25,
    config: {
      loop: true
    }
  }

  var yakMarker = {
    name: 'yak',
    start: 0,
    duration: 2,
    config: {
      loop: false 
    }
  }

  footsteps.addMarker(footstepsMarker)
  yak.addMarker(yakMarker)

  this.anims.create({
    key: 'walk-down',
    repeat: -1,
    frameRate: 8,
    frames: this.anims.generateFrameNames('player', {start: 0, end: 3}) 
  })

  this.anims.create({
    key: 'walk-up',
    repeat: -1,
    frameRate: 8,
    frames: this.anims.generateFrameNames('player', {start: 4, end: 7}) 
  })

  this.anims.create({
    key: 'walk-left',
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

  this.anims.create({
    key: 'stand',
    repeat: -1,
    frameRate: 2,
    frames: this.anims.generateFrameNames('dwarf', {start: 0, end: 1}) 
  })

  dwarf.play('stand')

  keys = this.input.keyboard.createCursorKeys()

  this.cameras.main.setBounds(0, 0, 100 * 16, 100 * 16)
  this.cameras.main.startFollow(player)

  var keyObj = this.input.keyboard.addKey('A')

  keyObj.on('down', interact)
}

function update() {
  var walking
  var velocity = 32

  if (keys.space.isDown) {
    velocity *= 2
    footsteps.setRate(2)
  } else {
    footsteps.setRate(1)
  }

  if (keys.down.isDown) {
    player.setVelocityY(velocity)
    dir = DOWN
    if (!animating) {
      player.play('walk-down')
      footsteps.play('walking')
    }
    walking = true
  } 
  
  if (keys.left.isDown) {
    player.setVelocityX(-velocity)
    dir = LEFT
    if (!animating) {
      player.play('walk-left')
      footsteps.play('walking')
    }
    walking = true
  }
  
  if (keys.up.isDown) {
    player.setVelocityY(-velocity)
    dir = UP
    if (!animating) {
      player.play('walk-up')
      footsteps.play('walking')
    }
    walking = true
  } 

  if (keys.right.isDown) {
    player.setVelocityX(velocity)
    dir = RIGHT
    if (!animating) {
      player.play('walk-right')
      footsteps.play('walking')
    }
    walking = true
  } 

  if (!walking) {
    player.setVelocity(0) 
    player.anims.stop()
    footsteps.stop()
  }

  animating = walking
}

function interact() {
  const x = player.x
  const y = player.y

  var canTalk = dirMap[dir](x, y)

  if (canTalk) {
    if (!talking) {
      // do this with a different scene
      menu = scene.physics.add.sprite(8 * 16, (9 * 16) + 8, 'menu')
      menu.setScrollFactor(0, 0)
      var topLine = 'Hewwo.. \n\nI am Bwett!!'

      text = scene.add.text(16, 8 * 16, topLine, { font: '"PressStart2P"' });
      text.setScrollFactor(0, 0)
      talking = true
      yak.play('yak')
    } else  {
      menu.destroy()
      text.destroy()
      talking = false 
    }
  }
}

function checkLeft(x, y) {
  return dwarf.getBounds().contains(x - 8, y)
}

function checkRight(x, y) {
  return dwarf.getBounds().contains(x + 8, y)
}

function checkUp(x, y) {
  return dwarf.getBounds().contains(x, y - 8)
}

function checkDown(x, y) {
  return dwarf.getBounds().contains(x, y + 8)
}
