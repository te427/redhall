import Player from 'objects/player'
import NPC from 'objects/npc'

var manager
var chars
var player
var npcs

function SpriteManager() {
  if (!manager) {
    manager = {
      getPlayer() {
        return player
      },
      getNPCs() {
        return npcs
      },
      load(data) {
        chars = data.chars
      },
      init(scene) {
        npcs = chars.map(c => (new NPC(scene, c)))
        //player = new Player(scene)
      }
    }
  }
  return manager
}

export default SpriteManager