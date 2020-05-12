import { DIALOGUE_KEY } from 'constants/game'

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

var manager
var conversations 
var curr

function DialogueManager(scene) {
  if (!manager) {
    manager = {
      load(data) {
        conversations = {}
        data.chars.forEach(function(char) {
          conversations[char.name] = char[DIALOGUE_KEY]
        })
      },
      set(char) {
        curr = conversations[char]
      },
      getGreeting() {
        return split(curr.greeting)
      }
    }
  }

  return manager
}

export default DialogueManager