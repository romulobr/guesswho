=======
GuessWho
========
Documentation will be added as we see fit.

What to expect from the calls to the service
=============================================
gets:
---------
/game/{id}: retrieves a game, including a list of players

/player/{id}: retrieves information from a player

/player/all: returns all the people

/player/{id}/otherPlayers: returns all the people except for the one specified by id

posts:
----------
/player : saves a player
parameters: realName='player name', fictionalName='the fictional character name.'

/game : creates a game
parameters: gameId='some identificator to a game, must be unique, if not provided will be randomly generated.'

delete:
-----------
/player/{id} : deletes a player
/game/{id} : deletes a game with all it's players
