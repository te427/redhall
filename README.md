# REDHALL

this is some experimenting I've been doing with `Phaser.js`, in the vein of old, top-down fantasy games.

## Instructions

`npm` and `node` are needed before you can begin.

to run:

`npm i`

`npm run start`

navigate to [localhost:8085](http://localhost:8085) when the server is running.

## Todo List

### Smaller Items
- ~~create a cell manager to load sprites from static files~~
- ~~break the assets folder into music, sprite and font folders~~
- ~~remove old files from the assets folder (csv)~~
- convert json data files to yaml
- get the phaser animated tiles plugin
- create interactable non-NPC objects
- give branching text options to menus
- figure out how to make text smaller
  - change scaling order (setScale?)
- convert interaction detect to sprite group

### Larger Items
- ~~create a second cell and navigation between the two~~
- ~~make maps/sprites entirely data file driven~~
- create state manager and saved state
  - should diff base state against saved state
  - should implement functions to reload/update game when run
- implement ~ command console
  - should allow for state manipulation
- add a combat system
- add enemies and simple AI
- create an inventory 
- create a crafting system
