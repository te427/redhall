import { MUSIC_KEY } from 'constants/keys'
import { E_PLAY_MUSIC, E_PAUSE_MUSIC, E_RESTART_MUSIC } from 'events/types'

import handler from 'events/handler'

function  play() {
  paused = false
  if (music) {
    if (stopped) {
      music.play()
      stopped = false
    } else {
      music.resume()
    }
  }

}

function pause() {
  if (music && !paused && !stopped) {
    music.pause()
    paused = true 
  }
}

function restart() {
  if (music) {
    music.stop()
    stopped = true

    if (!paused) {
      music.play()
      stopped = false
    } 
  }
}

var manager
var music
var paused = false
var stopped = false

function MusicManager() {
  if (!manager) {
    manager = {
      ...handler,
      init(scene) {
        if (music) {
          music.stop()
        }
        scene.sound.audioPlayDelay = 0.1;
        scene.sound.loopEndOffset = 0.05;

        music = scene.sound.add(MUSIC_KEY)

        var musicMarker = {
          name: 'music',
          start: 0, 
          duration: 164, // can we mqke this dynamic?
          config: {
            volume: 0.1,
            loop: true
          }
        }

        // load music data to see what track is playing for a cell
        // and keep playing if its the same
        music.addMarker(musicMarker)
        music.play()
      }
    }

    manager.on({
      [E_PLAY_MUSIC]: play,
      [E_PAUSE_MUSIC]: pause,
      [E_RESTART_MUSIC]: restart,
    })
  }
  return manager
}

export default MusicManager