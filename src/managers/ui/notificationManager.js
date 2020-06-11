import { E_NOTIFY } from "events/types"
import { NOTIFICATION_KEY, TITLE_FONT_KEY, MENU_LAYER_KEY, MENU_TILE_KEY, MENU_FONT_KEY } from "constants/keys"
import { TILE_SIZE, ZOOM_FACTOR } from "constants/dimensions/game"
import { NOTIFICATION_X, NOTIFICATION_Y, NOTIFICATION_TIMEOUT } from "managers/ui/constants/notification"

import handler from "events/handler"

function hide() {
  text.destroy()
  if (!queue.length) {
    showing = false
    panel.setVisible(false)
  } else {
    notify(queue.shift())
  }
}

function notify(notification) {
  panel.setVisible(true)
  text = scene.add.bitmapText(NOTIFICATION_X, NOTIFICATION_Y, MENU_FONT_KEY, notification)
  setTimeout(hide, NOTIFICATION_TIMEOUT)
}

function enqueue(notification) {
  if (!showing) {
    showing = true
    notify(notification)
  } else {
    queue.push(notification)
  }
}

var manager
var scene
var text
var tilemap
var panel 
var showing
var queue = []

// TODO
// - allow for queueing/chaining notifications
// - allow for queuing notifications when not in right context
// - parse objects for notifications (set custom timeouts, etc)

function NotificationManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(newScene) {
        scene = newScene

        tilemap = scene.make.tilemap({
          key: NOTIFICATION_KEY,
          tileWidth: TILE_SIZE,
          tileHeight: TILE_SIZE
        })

        panel = tilemap.createStaticLayer(MENU_LAYER_KEY, tilemap.addTilesetImage(MENU_TILE_KEY))
        panel.setScale(ZOOM_FACTOR)
        panel.setVisible(false)
      }
    }

    manager.on({
      [E_NOTIFY]: enqueue,
    })
  }

  return manager
}

export default NotificationManager
