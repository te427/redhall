import { CMD_MOVE_TO_CELL, CMD_SPAWN_INGREDIENT, CMD_REMOVE_INGREDIENT, CMD_SET_WEATHER } from "managers/debug/constants/cmds"
import { CANVAS_EL, LOG_ID, DEBUG_ID, STYLE_VISIBLE, STYLE_HIDDEN, EXEC_ID, BG_ID, LINE_EL, STORAGE_KEY, MAX_STORAGE_LENGTH } from "managers/debug/constants/cfg"
import { E_EXEC_DEBUG_CMD, E_DEBUG_KEYDOWN, E_OPEN_DEBUG, E_CLOSE_DEBUG, E_LOG_DEBUG, E_MOVE_TO_CELL } from "events/types"

import handler from "events/handler"
import debugCmds from 'helpers/debugCmds'

function loadStorage() {
  var res = storage.getItem(STORAGE_KEY)
  if (res) {
    pastCmds = JSON.parse(res)
  }
}

function saveToStorage() {
  var data = JSON.stringify(pastCmds)
  storage.setItem(STORAGE_KEY, data)
}

function preventDebugKey(v) {
  if (v.data === '`') {
    execEl.value = ''
  }
}

function setDebugPos() {
  var top = canvasEl.offsetTop
  var left = canvasEl.offsetLeft

  debugEl.style.top = top
  debugEl.style.left = left
}

function log(event) {
  var type = event.type
  var data = event.data

  logLines = [{ type, data }].concat(logLines.slice(1, 31))

  var newEl = document.createElement(LINE_EL)

  var dataString 

  try {
    dataString = Object.keys(data).reduce((acc, k) => acc + `${k}: ${data[k]},`, '') 
  } catch(err) {
    dataString = JSON.stringify(data)
  } 

  newEl.innerText = `${type}: ${data}`

  if (logLines.length == 30) {
    logEl.removeChild(logEl.firstElementChild)
  }

  logEl.appendChild(newEl)
}

function openDebug() {
  setDebugPos()
  pastIndex = -1

  manager.emit(E_OPEN_DEBUG)

  debugEl.style.visibility = STYLE_VISIBLE
  open = true

  execEl.focus()
  execEl.value = ''
}

function closeDebug() {
  manager.emit(E_CLOSE_DEBUG)

  debugEl.style.visibility = STYLE_HIDDEN
  open = false 

  canvasEl.focus()
}

function handle(e) {
  if (e.key === 'ArrowUp') {
    if (pastIndex < pastCmds.length - 1) {
      pastIndex++
      execEl.value = pastCmds[pastIndex]
    }
  }

  if (e.key === 'ArrowDown') {
    if (pastIndex >= 0) {
      pastIndex--
      if (pastIndex >= 0) {
        execEl.value = pastCmds[pastIndex]
      } else {
        execEl.value = ''
      }
    }
  }

  if (e.key === 'Enter') {
    var cmd = execEl.value
    pastCmds = [cmd]
      .concat(pastCmds)
    
    pastCmds = pastCmds
      .filter((cmd, i) => pastCmds.indexOf(cmd) === i)
      .slice(0, MAX_STORAGE_LENGTH)

    var args = cmd.split(' ')

    exec(args)

    execEl.value = ''
    pastIndex = -1

    saveToStorage()
  }
}

function exec(args) {
  console.log(`Executing ${args}`)
  try {
    var cmd = cmds[args[0]]
    cmd(args.slice(1))
  } catch(err) {
    console.error(`Could not execute cmd ${args} - $${err}`)
  }
}

function debug() {
  (open ? closeDebug : openDebug)()
}

var manager
var open
var logLines = []
var open
var debugEl
var execEl
var logEl
var canvasEl
var pastCmds = []
var pastIndex
var storage

const cmds = {
  [CMD_MOVE_TO_CELL]: debugCmds.moveToCell,
  [CMD_SPAWN_INGREDIENT]: debugCmds.spawnIngredient,
  [CMD_REMOVE_INGREDIENT]: debugCmds.removeIngredient,
  [CMD_SET_WEATHER]: debugCmds.setWeather,
}

function DebugManager() {
  if (!manager) {
    manager = {
      ...handler,
      log
    }

    manager.on({
      [E_DEBUG_KEYDOWN]: debug,
      [E_EXEC_DEBUG_CMD]: handle,
    })

    manager.on(E_LOG_DEBUG, log)

    window.onload = function() {
      debugEl = document.getElementById(DEBUG_ID)
      logEl = document.getElementById(LOG_ID)
      canvasEl = document.getElementsByTagName(CANVAS_EL)[0]

      execEl = document.getElementById(EXEC_ID)
      execEl.oninput = preventDebugKey
      execEl.onkeydown = handle

      storage = window.localStorage
      loadStorage()
    }
  }

  return manager
}

export default DebugManager