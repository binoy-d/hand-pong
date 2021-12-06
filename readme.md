--Readme document for Daniel Binoy--

## Design choices
I've always wanted to take a simple game and play with different interaction, so 
it made sense to apply it to Pong. Pong is easy to understand and recognize without
much explanation, so the gestures become the focus of the game. I wanted an extremely
minimal and yet pretty and endearing interface. To accomplish this, I used only black
and white(staying true to original pong) with the only color being emojis. I also gave
it a fun acronym to make it personable. The handtracking is the core of this game, and 
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
hands, for consistency. The interface seems simple and basic, and that is very much intentional.
I was inspired by the game A Dark Room which is extremely compelling though it only uses text
and is designed to be fully playable by blind people. I love minimal design that only does
the bare minimum and does it well. The hardest part of this project was using a lot of gestures,
as I personally prefer to just use a few gestures but to use them in many places well. 
I think that makes for better design if the users can remember less things. It also took a lot
of time to get the look and feel just right. A lot of time was spent on positioning, making
the game canvas dynamically resize smoothly, and fading things in and out nicely. As stated 
before, getting the acceleration and mvoement of the paddles to feel good also took a solid hour.  
Other than that, it was mostly smooth sailing. If I have the time and energy after I submit 
this assignment, I want to add a feature that grabs the players faces and uses them as 
a profile picture. I would also add subtle messages or something to give the game more 
personality. A player color selection menu would also be cool. 


## How long, in hours, did it take you to complete this assignment?
It took me about 6 hours, with the majority of the time spent on small design fixes.

## What online resources did you consult when completing this assignment? (list sites like StackOverflow or specific URLs for tutorials, etc.)
I checked the JavaScript docs from Mozilla many times to check functions
I also checked the p5.js docs for p5js functions
tracking.js is HEAVILY borrowed from https://editor.p5js.org/soh-bot/sketches/pkkHdauoD
However, it is pretty much just wrapper code, and I still process pretty much everything myself

## What classmates or other individuals did you consult as part of this assignment? What did you discuss?
I didn't consult anyone

## Is there anything special we need to know in order to run your code?
No, I don't think so.
You should be able to just open index.html and it should be self explanatory.

