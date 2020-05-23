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
- Fix tree collisions
- Fix second cell not loading correctly

### Smaller Items
- ~~create a cell manager to load sprites from static files~~
- ~~break the assets folder into music, sprite and font folders~~
- ~~remove old files from the assets folder (csv)~~
- ~~convert json data files to yaml~~
- get the phaser animated tiles plugin
- ~~create interactable non-NPC objects~~
- ~~give branching text options to menus~~
- ~~figure out how to make text smaller~~
- convert interaction detect to sprite group
- ~~fix the npc collision boxes~~
- create an interrupt dialogue box (linear dialogue box w no options other than proceed/end)
- add a transition screen between maps (fade in to centered text w/name, fade out after 2 seconds)
  - add sfx to the title
  - do this between regions instead of cells?
- ~~add common topics to character interaction~~
- clean up dialogue manager into common, finer tuned methods

### Larger Items
- add world map
- create an inventory 
- create a persuasion system
  - concept - talking about topics increases/decreases likes based off of character personality?
- split item layer into collision/non collision layers
  - add tiles of multiple sizes
  - add general interactions for tiles of type
  - add specific interactions for tiles at a given place
- ~~create a second cell and navigation between the two~~
- ~~make maps/sprites entirely data file driven~~
- ~~move to event system~~
- create state manager and saved state
  - should diff base state against saved state
  - should implement functions to reload/update game when run
- implement ~ command console
  - should allow for state manipulation
- add a combat system
- add enemies and simple AI
- create a crafting system
- add a cutscene system
- add a barter system
