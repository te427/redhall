import { MUSIC_KEY } from 'constants/keys'

var manager
var music

function MusicManager() {
  if (!manager) {
    manager = {
      init(scene) {
        // move to MusicManager
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

        music.addMarker(musicMarker)
        music.play(MUSIC_KEY)
      }
    }
  }
  return manager
}

export default MusicManager