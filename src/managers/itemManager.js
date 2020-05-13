import { ADDR, ITEMS_PATH } from "constants/cfg"

function fetchItemDict() {
  return fetch(ADDR + ITEMS_PATH + 'items.json')
}

var manager
var items

function ItemManager() {
  if (!manager) {
    manager = {
      async load() {
        var res = await fetchItemDict()
        var items = await res.json()
      },
      getItem(n) {
        return items[n]
      }
    }
  }
  return manager
}

export default ItemManager