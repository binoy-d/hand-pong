
## background

I've always wanted to take a simple game and play with different interaction, so
it made sense to apply it to Pong. Pong is easy to understand and recognize without
much explanation, so the gestures become the focus of the game.

## how the game works

The handtracking is the core of this game, and
it is used both in the actual game as well as all menus. When the game starts(after
loading and enabling video), the paddles slide in. Raising up two hands(this game should
in theory be played by 2 players) will result in the paddles smoothly sliding towards
the relative positions of the hands. This quickly introduces the idea as well as gives
the players a chance to get a feel for the movement. (The movement also took a long time
to get right, in terms of the acceleration and deceleration) The game fades in and text
prompts the users to close both hands to start playing. The game starts off paused, prompting
the players to open their hands again to actually run the game. This introduces the
controls for the pause menu. At any point, if both players close their hands, the game will
pause. Opening both resumes the game. If any one player closes their hand, their paddle
gets a little darker to indicate it is deactivated. Restarting is also done by closing both
hands, for consistency.

## design choices

I wanted an extremely minimal and yet pretty and endearing interface. To accomplish this, I used only black
and white(staying true to original pong) with the only color being emojis. I also gave
it a fun acronym to make it personable.
The interface seems simple and basic, and that is very much intentional.
I was inspired by the game A Dark Room which is extremely compelling though it only uses text
and is designed to be fully playable by blind people. I love minimal design that only does
the bare minimum and does it well. The hardest part of this project was using a lot of gestures,
as I personally prefer to just use a few gestures but to use them in many places well.
I think that makes for better design if the users can remember less things. It also took a lot
of time to get the look and feel just right. A lot of time was spent on positioning, making
the game canvas dynamically resize smoothly, and fading things in and out nicely. As stated
before, getting the acceleration and mvoement of the paddles to feel good also took a solid hour.  
Other than that, it was mostly smooth sailing.

## if I had more time

I would also add subtle messages or something to give the game more
personality. A player color selection menu would also be cool.

## time taken

It took me about 6 hours, with the majority of the time spent on small design fixes.
