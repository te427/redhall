import { E_NOTIFY } from 'events/types'

import handler from 'events/handler'

export default {
  notify(notification) {
    handler.emit(E_NOTIFY, notification)
  }
}