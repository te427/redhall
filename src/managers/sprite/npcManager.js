import { E_INIT_NPCS, E_LOAD_CELL_DATA, E_INTERACT, E_OPEN_DIALOGUE, E_SET_DIALOGUE } from 'events/types'
import handler from 'events/handler'
import NPC from 'managers/sprite/objects/npc'

function setNPCs(cell) {
  npcs = cell.npcs
}

function interact(pos) {
  var target = npcs.find(npc => npc.getBounds().contains(pos.x, pos.y))
  if (target) {
    target.interact()
    manager.emit(E_SET_DIALOGUE, target.getNPC())
    manager.emit(E_OPEN_DIALOGUE)
  }
}

var manager
var npcs

function NPCManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(scene) {
        npcs = npcs.map(c => (new NPC(scene, c)))

        this.emit(E_INIT_NPCS, npcs.map(npc => npc.getSprite()))
      }
    }

    manager.on({
      [E_LOAD_CELL_DATA]: setNPCs,
      [E_INTERACT]: interact
    })
  }
  return manager
}

export default NPCManager