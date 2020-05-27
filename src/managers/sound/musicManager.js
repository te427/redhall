import { MUSIC_KEY } from 'constants/keys'

var manager
var music

function MusicManager() {
  if (!manager) {
    manager = {
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
        music.play(MUSIC_KEY)
      }
    }
  }
  return manager
}

export default MusicManager