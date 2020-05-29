import { E_INIT_ENEMIES, E_LOAD_CELL_DATA } from "events/types"

import handler from "events/handler"
import Enemy from "managers/sprite/objects/enemy"

function setEnemies(cell) {
  data = cell.enemies
}

var manager
var data
var enemies

function EnemyManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(scene) {
        if (data) {
          enemies = data.map(e => (new Enemy(scene, e)))

          this.emit(E_INIT_ENEMIES, enemies.map(e => e.getSprite()))
        }
      }
    }

    manager.on({
      [E_LOAD_CELL_DATA]: setEnemies,
    })
  }

  return manager
}

export default EnemyManager