# REDHALL

this is some experimenting I've been doing with `Phaser.js`, in the vein of old, top-down fantasy games.

## Instructions

`npm` and `node` are needed before you can begin.

to run:

`npm i`

`npm run start`

navigate to [localhost:8085](http://localhost:8085) when the server is running.

## Todo List

### Bugs
- Fix running direction not resumed when moving diagonally after collision
  - we can do this by calling a function in the player manager continually on game update - this should "drive" the player,
    with the player only concerned about the direction(s) it is facing and whether it is moving or not (a key is down and has
    not been released)
- Pond of the Child has no map currently
- spawning/removing items needs item properties

### Smaller Items
- clean up dialogue manager into common, finer tuned methods
- add notifications to the UI (i.e. on item pickup)
- add sfx to picking items
- add music state to track if tracks should change or continue
- fix inventory item count offset when greater than 1 digit
- create an interrupt dialogue box (linear dialogue box w no options other than proceed/end)
- add a transition screen between maps (fade in to centered text w/name, fade out after 2 seconds)
  - add sfx to the title
  - do this between regions instead of cells?
- convert interaction detect to sprite group
- ~~create a cell manager to load sprites from static files~~
- ~~break the assets folder into music, sprite and font folders~~
- ~~remove old files from the assets folder (csv)~~
- ~~convert json data files to yaml~~
- ~~get the phaser animated tiles plugin~~
- ~~create interactable non-NPC objects~~
- ~~give branching text options to menus~~
- ~~figure out how to make text smaller~~
- ~~fix the npc collision boxes~~
- ~~add common topics to character interaction~~


### Larger Items
- make it an electron app
- add world map
- add a combat system
- add enemies and simple AI
- add spells
- create a crafting system
- add a cutscene system
- add a barter system
- add a quest system
- create a persuasion system
  - concept - talking about topics increases/decreases likes based off of character personality?
- create state manager and saved state
  - should diff base state against saved state
  - should implement functions to reload/update game when run
- ~~create an inventory~~
  - add item name/effects bar on bottom
  - add details screen on select
- ~~split item layer into collision/non collision layers~~
  - add tiles of multiple sizes
  - add general interactions for tiles of type
  - add specific interactions for tiles at a given place
- ~~implement ~ command console~~
  - should allow for state manipulation
- ~~create a second cell and navigation between the two~~
- ~~make maps/sprites entirely data file driven~~
- ~~move to event system~~
  - make it async (is this crazy? is this stupid?)


