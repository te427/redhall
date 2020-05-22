import { ADDR, ITEMS_PATH } from "constants/cfg"

var manager
var items

function ItemManager() {
  if (!manager) {
    manager = {
      async load() {
        // get items from E_ITEM_LOAD event from loadmanager
      },
      getItem(n) {
        return items[n]
      }
    }
  }
  return manager
}

export default ItemManager