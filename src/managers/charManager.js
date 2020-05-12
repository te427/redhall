var manager
var chars

function CharManager() {
  if (!manager) {
    manager = {
      load(data) {
        chars = data.chars//.reduce((acc, c) => ({ ...acc, [c.name]: c}), {})
      },
      get(name) {
        return chars.find(c => c.name === name)//[name]
      },
      getAll() {
        return chars
      }
    }
  }
  return manager
}

export default CharManager