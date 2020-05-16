import { E_SET_DIALOGUE } from 'events/types'
import handler from 'events/handler'

function split(text) {
  var words = text.split(' ')
  var fit = ''
  var index = 0
  var length = 0
  while (index < words.length) {
    var word = words[index++]
    length += word.length + 1
    if (length > 30) {
      fit += '\n\n'
      length = 0
    }
    fit += word + ' '
  }
  return fit
}

function setTarget(targetNPC) {
  npc = targetNPC
}

var manager
var npc 

function DialogueManager() {
  if (!manager) {
    manager = {
      ...handler,
      getGreeting() {
        return split(npc.dialogue.greeting)
      }
    }
  }

  manager.on(E_SET_DIALOGUE, setTarget)

  return manager
}

export default DialogueManager