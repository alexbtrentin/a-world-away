/* A WORLD AWAY — story configuration. No real identities are revealed in Chapter One.
   Feel free to change dialogue lines here without touching the game engine. */
window.AWA_STORY = {
  title: 'A World Away',
  protagonist: 'The Wanderer',
  companion: 'Rook',
  familiar: 'Pip',
  noteTitles: {0:'THE MOSS GATE · FIELD INSCRIPTION',1:'THE HALL OF ECHOES · RUNE ORDER',3:'WINDWARD LANDING · THE SKY-SWITCH',4:'THE DRIFTING SPAN · SKYBRIDGE',6:'GLACIER APPROACH · TWO FLAMES',7:'WHITEOUT PASS · BURIED PATH',8:'THE WINTER HEART · THE ARMOR',9:'THE TURNING GALLERIES · SHIFTING STONE',10:'THE HALL OF FALSE FACES · TRUE LIGHT',11:'THE MIRROR THRONE · SHATTER THE SHIELD',12:'GLOAM MAZE · LIGHT IN THE DARK',13:'ALCHEMIST’S OBSERVATORY · EXPERIMENT NOTES',14:'THE LAST HORIZON · THE FINAL LIGHT'},
  notes: {
    0:[{who:'ANCIENT TABLET',text:'Two lights shall wake the sleeping gate. One rests beneath the northern vines; the other waits where southern roots run deep.'},{who:'THE WANDERER',text:'Two braziers. Got it. Why can ancient people never just write directions?'}],
    1:[{who:'ANCIENT TABLET',text:'When the world began, the SUN rose first. The MOON answered. Only then did the STARS awaken.'},{who:'THE WANDERER',text:'Sun, moon, stars. Finally, an ancient message with a sensible order.'}],
    3:[{who:'ANCIENT TABLET',text:'An old sky-switch binds the drifting bridge. A trusted hand must hold it fast while the others pass.'},{who:'ROOK',text:'A trusted hand? Excellent. I have two of those. Probably.'}],
    4:[{who:'ANCIENT TABLET',text:'Where the bridge is broken, let the gentlest traveler rest on the stone. The sleeping sky shall rise.'},{who:'ROOK',text:'I think it wants Pip. She has been training for this her whole life.'}],
    6:[{who:'ANCIENT TABLET',text:'Two flames hold the winter at bay. Wake both beacons, then cross the pass before the storm remembers your names.'},{who:'ROOK',text:'If the storm asks, my name is Definitely Not Rook.'}],
    7:[{who:'ANCIENT TABLET',text:'When the snow devours the foolish, pull them free. When the ancient crystal sleeps, ask the smallest of you to wake it.'},{who:'THE WANDERER',text:'The foolish? That sounds alarmingly specific.'}],
    8:[{who:'ANCIENT TABLET',text:'The winter guardian wears a shell of ancient ice. Two heart-flames must burn before any mortal blade can reach it.'},{who:'ROOK',text:'Good news. We brought a sword. Bad news. Apparently the sword needs a fireplace first.'}],
    9:[{who:'ANCIENT TABLET',text:'The gallery has three faces. The FIRST holds the upper echo, the SECOND holds the lower echo, and the THIRD opens the eastern way. Turn the wheels to change the walls.'},{who:'ROOK',text:'A maze with adjustable walls! Finally, a building that appreciates interior design.'}],
    10:[{who:'ANCIENT TABLET',text:'Three mirrors speak, but exactly ONE lies. Listen to all three before choosing the true reflections. At the last step, dawn must precede the stars.'},{who:'THE WANDERER',text:'So we need to figure out which voice is lying, not just guess.'}],
    11:[{who:'ANCIENT TABLET',text:'Two promises bind the Mirror Regent. One hand must anchor the left sigil; one small spark must light the far prism. When the Regent is wounded, the glass will bind itself anew.'},{who:'ROOK',text:'Did the tablet call me one hand? I have been reduced to a very handsome limb.'}],
    12:[{who:'ANCIENT TABLET',text:'Beyond the first flame, three waystones wait in the dark. Carry a torch, trust the smallest spark, and let a friend mark your way back.'},{who:'ROOK',text:'I have chalk. I have confidence. Those are almost the same as a map.'}],
    13:[{who:'ANCIENT TABLET',text:'The lens sleeps beneath a carbonate crust. First observe the indicator: pink speaks of acid, blue of alkali. Dissolve the crust gently, rinse to neutral, restore the lens, then bind two currents.'},{who:'THE WANDERER',text:'We have a problem, a hypothesis, and a way to test it. That is enough to start.'}],
    14:[{who:'ANCIENT TABLET',text:'The Hollow Sovereign guards the rift. Anchor the western ward and awaken the eastern star to expose its heart. It will raise its shield again. At the final darkness, trust the smallest light.'},{who:'ROOK',text:'The smallest light? Pip, congratulations. You have been promoted.'}]
  },
  opening: [
    {who:'NARRATOR', text:'Three celestial seals once kept the world in balance. Now their light is fading, and entire kingdoms are beginning to drift apart.'},
    {who:'NARRATOR', text:'Somewhere in the Forgotten Temple lies the first seal. One traveler has decided to retrieve it. Alone. Without a map.'},
    {who:'THE WANDERER', text:'Okay. Ancient ruin. Mysterious noises. Absolutely no reason to be concerned.'}
  ],
  guardianIntro: [
    {who:'THE STONE WARDEN', text:'INTRUDER. THE FIRST SEAL SHALL NOT LEAVE THIS SANCTUM.'},
    {who:'THE WANDERER', text:'You could have just said no.'},
    {who:'NARRATOR', text:'The Warden gathers energy. Watch for the glowing warning ring, then quickstep out of the attack.'}
  ],
  guardianDefeat: [
    {who:'NARRATOR', text:'The great guardian collapses into a harmless pile of surprisingly dramatic rocks. Something cloudy glints among the rubble.'},
    {who:'THE WANDERER', text:'One celestial seal recovered. Only two more to go. Easy.'},
    {who:'THE WANDERER', text:'One mysterious shard, one celestial seal. I should check the exit.'}
  ],
  fragmentOne: [
    {who:'THE WANDERER',text:'What is this cloudy little piece? It is glowing, but I cannot see through it.'},
    {who:'NARRATOR',text:'The object warms in the Wanderer’s hand. Its markings remain unreadable.'},
    {who:'THE WANDERER',text:'Might be important. Or it might be fancy rubble. I will keep it.'}
  ],
  bridgeFall: [
    {who:'NARRATOR',text:'The Wanderer approaches the exit. The bridge groans once, its supports crack, and the entire crossing drops into the abyss!'},
    {who:'THE WANDERER',text:'WTF????'},
    {who:'THE WANDERER',text:'Seriously?! I JUST fought a giant pile of rocks!'}
  ],
  rookEntrance: [
    {who:'NARRATOR', text:'Behind a broken pillar, a green hat slowly rises. Someone has been hiding there.'},
    {who:'???', text:'Well, that was spectacular. Ten out of ten for dramatic timing.'},
    {who:'THE WANDERER', text:'...Were you hiding there the whole time?!'},
    {who:'ROOK', text:'Watching, actually. Very professionally. You looked like you had everything under control. Until the bridge part.'},
    {who:'THE WANDERER', text:'...Who are you? And how did you get here?'},
    {who:'ROOK', text:'Rook. Professional adventurer. Amateur sandwich critic. This is Pip, my extremely powerful magical familiar.'},
    {who:'THE WANDERER', text:'She looks asleep.'},
    {who:'ROOK', text:'That is her battle stance. Very advanced. Please respect the technique.'},
    {who:'THE WANDERER', text:'Any chance you know how to cross that gap?'},
    {who:'ROOK', text:'Absolutely. I have an excellent plan. Step one: look confident. Step two—'},
    {who:'NARRATOR', text:'Pip waddles over, demands to be petted, and promptly falls asleep on an ancient pressure plate. A glowing bridge rises from the abyss.'},
    {who:'ROOK', text:'BEHOLD! Exactly as planned.'},
    {who:'THE WANDERER', text:'Your pet did that.'},
    {who:'ROOK', text:'She is the brains. I am the incredibly handsome distraction.'},
    {who:'NARRATOR', text:'Pip gives one tiny, triumphant snore.'},
    {who:'ROOK', text:'So! Heading somewhere dangerous? We were too. Mostly by accident. Mind if we tag along?'},
    {who:'THE WANDERER', text:'...Fine. But I am choosing the direction. We still do not have a map.'},
    {who:'ROOK', text:'Perfect. I am famously terrible with maps I do not have.'}
  ],
  islesIntro: [
    {who:'NARRATOR', text:'CHAPTER II — THE SHATTERED ISLES. Beyond the ruined temple, enormous islands hang in the sky, tethered by flickering bridges of light.'},
    {who:'ROOK', text:'See? We made it. I was only mildly certain that bridge would work.'},
    {who:'THE WANDERER', text:'Those islands are drifting apart. We need to find the second seal before the sky routes collapse.'},
    {who:'ROOK', text:'Great! I have an idea involving a switch, my incredible reflexes, and absolutely no planning.'},
    {who:'NARRATOR', text:'Rook can hold mechanical switches while the Wanderer advances. Pip prefers affection to actual instructions.'}
  ],
  switchSolved: [
    {who:'ROOK', text:'Stand back. I have trained for this exact moment.'},
    {who:'NARRATOR', text:'Rook plants both feet on the ancient switch. A bridge of blue light hums into existence.'},
    {who:'ROOK', text:'I am now a load-bearing adventurer. It is an honor.'},
    {who:'THE WANDERER', text:'Just keep holding it, please.'}
  ],
  pipRequest: [
    {who:'THE WANDERER', text:'This bridge needs weight on that pressure plate. Pip? Would you help us?'},
    {who:'NARRATOR', text:'Pip considers the proposal, curls into a determined little ball, and refuses to move.'},
    {who:'ROOK', text:'Ah yes. Her terms are very clear. Extensive head scratches first. Go pet her with E.'}
  ],
  pipPlate: [
    {who:'NARRATOR', text:'After receiving the requested affection, Pip waddles onto the plate and falls asleep. The bridge unfolds across the void.'},
    {who:'THE WANDERER', text:'Wait. Is there something glittering underneath her?'},
    {who:'ROOK', text:'A cloudy piece of glass? She found TREASURE with her entire belly. Incredible.'},
    {who:'THE WANDERER', text:'It looks like the strange fragment from the temple. Better keep it.'},
    {who:'ROOK', text:'She specializes in horizontal engineering AND archaeology.'}
  ],
  islesGuardianIntro: [
    {who:'THE RIFT SENTINEL', text:'THE SKY SHALL REMAIN DIVIDED. NONE MAY CLAIM THE SECOND SEAL.'},
    {who:'ROOK', text:'Quick question. Is this one also open to constructive feedback?'},
    {who:'THE WANDERER', text:'Rook. Shield first, jokes second.'},
    {who:'NARRATOR', text:'The Rift Sentinel summons storms and spreads energy bolts. Rook can block one hit from time to time if he stays close.'}
  ],
  peaksIntro: [
    {who:'NARRATOR',text:'CHAPTER III — THE FROSTBOUND PEAKS. Beyond the drifting isles rise mountains so cold that even the stars look frozen.'},
    {who:'ROOK',text:'I packed for this. One scarf, two biscuits, and an absolutely heroic amount of optimism.'},
    {who:'THE WANDERER',text:'The winds are getting stronger. We should find shelter and light those mountain beacons.'},
    {who:'NARRATOR',text:'The frost drains your warmth in open air. Light beacons or stand near shelters to recover. Your heart bar remains separate from warmth.'},
    {who:'ROOK',text:'If I vanish in the snow, please assume I have become a legend.'}
  ],
  whiteoutIntro: [
    {who:'NARRATOR',text:'The pass vanishes beneath a curtain of whirling snow. Ancient blue ice covers the path, slippery underfoot.'},
    {who:'ROOK',text:'I know a shortcut! Follow me!'},
    {who:'NARRATOR',text:'Rook charges ahead. There is a muffled thump, then suspicious silence.'},
    {who:'THE WANDERER',text:'...Rook? That was not an encouraging sound.'},
    {who:'NARRATOR',text:'Find Rook in the snow and pull him free. Pip may help wake the ancient crystal that seals the far passage.'}
  ],
  rookSnowRescue: [
    {who:'THE WANDERER',text:'Rook? Is that your hat sticking out of the snow? And what is that cloudy shard beside you?'},
    {who:'ROOK',text:'No. This is a limited-edition mountain hat exhibit.'},
    {who:'NARRATOR',text:'The Wanderer grabs his arm and pulls. With one enormous PLOOF, Rook emerges from the drift.'},
    {who:'ROOK',text:'Excellent. I was just testing the structural integrity of the snow.'},
    {who:'THE WANDERER',text:'You were stuck.'},
    {who:'ROOK',text:'Temporarily horizontal. Entirely different.'},
    {who:'ROOK',text:'Also, the weird cloudy thing in my boot? Found it while heroically investigating that snowbank.'},
    {who:'THE WANDERER',text:'Another fragment! That is the third. They must be connected.'},
    {who:'NARRATOR',text:'Rook shakes the snow off and stays close, sharing a little warmth and protection as the party advances.'}
  ],
  pipIceCrystal: [
    {who:'THE WANDERER',text:'Pip, can you wake that crystal?'},
    {who:'ROOK',text:'She is a highly trained magical specialist. Her fee is three cuddles and a nap.'},
    {who:'NARRATOR',text:'Pip curls up beside the crystal, lets out a tiny sneeze, and releases a burst of warm violet magic.'},
    {who:'NARRATOR',text:'With a clear crystalline note, the frozen wall cracks open into a shimmering passage.'},
    {who:'ROOK',text:'See? Precisely as planned.'},
    {who:'THE WANDERER',text:'She actually did plan that better than you.'}
  ],
  peaksGuardianIntro: [
    {who:'THE FROST GUARDIAN',text:'THE LAST SEAL REMAINS BOUND. NO HEART MAY OUTLAST THIS WINTER.'},
    {who:'ROOK',text:'For the record, my heart just skipped three beats. Does that count?'},
    {who:'THE WANDERER',text:'That ice armor looks impenetrable. Two heart-flames are still burning inside the chamber.'},
    {who:'NARRATOR',text:'Awaken BOTH heart-flames to melt its protective armor. Watch for falling ice and use the warm flames to recover.'}
  ],
  peaksGuardianDefeat: [
    {who:'NARRATOR',text:'The Frost Guardian shatters into harmless snowflakes. The three celestial seals lift into the air and shine as one.'},
    {who:'THE WANDERER',text:'That was the last seal. The kingdoms should stop drifting now.'},
    {who:'NARRATOR',text:'Their combined light repairs the broken pathways... but then projects a star map pointing beneath the mountain. A dark rift still burns at its center.'},
    {who:'THE WANDERER',text:'The seals stopped the worlds from drifting. They did not close the thing pulling them apart.'},
    {who:'NARRATOR',text:'The map reveals a hidden passage into the Endless Labyrinth. Beyond it waits the Horizon Key, the only way to reach the source of the rifts.'},
    {who:'ROOK',text:'So... the three impossible missions were just the tutorial?!'},
    {who:'THE WANDERER',text:'We have a map now, at least.'},
    {who:'ROOK',text:'Good! Because the one I found looks suspiciously like a sandwich.'}
  ],
  labyrinthIntro: [
    {who:'NARRATOR',text:'CHAPTER IV — THE ENDLESS LABYRINTH. The star map revealed by the three seals leads beneath the mountain, into corridors that move when no one is looking.'},
    {who:'ROOK',text:'Good news! I brought a second map. Bad news: it is a picture of a different sandwich.'},
    {who:'THE WANDERER',text:'The seals stabilized the world. The Horizon Key inside this labyrinth will let us reach the source and finish this.'},
    {who:'NARRATOR',text:'Find two echoes in the shifting galleries. Turn the stone wheels to change which corridors open.'},
    {who:'PIP',text:'...zzZ.'}
  ],
  galleryIntro: [
    {who:'NARRATOR',text:'The hall of false faces folds in on itself. A thousand mirrored Wanderers step forward — but Rook and Pip are nowhere to be seen.'},
    {who:'THE WANDERER',text:'Rook? Pip? ...I really hope he is not giving the mirrors directions.'},
    {who:'NARRATOR',text:'Find your companions, then examine the voices of all three mirrors. Exactly one lies; the inscription explains how to judge them.'}
  ],
  findRook: [
    {who:'THE WANDERER',text:'Rook! There you are!'},
    {who:'ROOK',text:'I was not lost. I was exploring aggressively.'},
    {who:'THE WANDERER',text:'You were arguing with your reflection.'},
    {who:'ROOK',text:'And winning, I might add. Come on, we still need to find Pip.'}
  ],
  findPip: [
    {who:'NARRATOR',text:'A sleepy chirp comes from behind a fake wall. Pip is nestled in a pile of illusionary cushions.'},
    {who:'ROOK',text:'Pip! We were worried. Well, I was. Your friend looked extremely competent.'},
    {who:'THE WANDERER',text:'She found the secret passage without us.'},
    {who:'ROOK',text:'Clearly, advanced reconnaissance by napping. Now we just have to work out which mirror is lying.'}
  ],
  mirrorVoices: {
    0:[{who:'SUN MIRROR',text:'The STAR mirror tells the truth.'},{who:'THE WANDERER',text:'A claim about another mirror. We should listen to all three.'}],
    2:[{who:'MIDDLE MIRROR',text:'The SUN mirror is lying.'},{who:'ROOK',text:'That sounds suspiciously confident. I respect it. But is it true?'}],
    1:[{who:'STAR MIRROR',text:'The MIDDLE mirror is lying.'},{who:'THE WANDERER',text:'Exactly one of these three statements can be false. Which is it?'}]
  },
  fragmentFour: [
    {who:'NARRATOR',text:'As the two true mirrors align, a fourth cloudy shard appears where the false reflection stood.'},
    {who:'THE WANDERER',text:'Another one of those pieces. It was hidden in the illusion itself.'},
    {who:'ROOK',text:'Four pieces, zero idea what they are. I am starting to think it is a very elaborate coaster.'}
  ],
  regentReformed: [
    {who:'THE WANDERER',text:'Rook! Your anchor! The shield is back—go hold it again!'},
    {who:'ROOK',text:'Sorry! I thought I saw a Pikachu behind that column!'},
    {who:'THE WANDERER',text:'A WHAT? We are fighting a giant MIRROR!'},
    {who:'ROOK',text:'Fine, fine! Back to my very important standing job! Pip, prism duty again!'},
    {who:'NARRATOR',text:'The Regent has pulled both companions away from their stations. Guide Rook and Pip back to the anchor and prism to break the shield again.'}
  ],
  emergencyHeart: [
    {who:'ROOK',text:'CATCH! Emergency snack delivery! I was saving this for a dramatic moment!'},
    {who:'THE WANDERER',text:'You just saved me a heart!'},
    {who:'ROOK',text:'And ruined my lunch. So please make it count!'}
  ],
  mirrorGuardianIntro: [
    {who:'THE MIRROR REGENT',text:'THREE SEALS, THREE TRAVELERS. YOU WILL FIND ONLY YOUR REFLECTION HERE.'},
    {who:'ROOK',text:'Fantastic. Three of me sounds exhausting for everyone.'},
    {who:'THE WANDERER',text:'The Regent is protected by reflected light. Rook, hold the anchor. Pip, find the prism.'},
    {who:'NARRATOR',text:'Activate BOTH companion devices to break its shield. At half health, the Regent re-forms its protection; activate them again.'}
  ],
  mirrorGuardianDefeat: [
    {who:'NARRATOR',text:'The Mirror Regent fractures into a thousand harmless lights. A silver key settles onto the silent floor.'},
    {who:'THE WANDERER',text:'The Horizon Key. With this, we can reach the fortress beyond the world.'},
    {who:'ROOK',text:'Not to brag, but this time my plan involved zero accidental avalanches.'},
    {who:'THE WANDERER',text:'It also involved you helping with the difficult part.'},
    {who:'ROOK',text:'I would like that entered in the official adventure record.'},
    {who:'NARRATOR',text:'Pip falls asleep on the key. It will be a few minutes before anyone can pick it up.'}
  ],
  horizonIntro: [
    {who:'NARRATOR',text:'CHAPTER V — THE LAST HORIZON. The Horizon Key leads not to a shining palace, but to a maze swallowed by darkness.'},
    {who:'ROOK',text:'Excellent. A final level with no lighting. Very cost-effective architecture.'},
    {who:'THE WANDERER',text:'There is a torch just ahead. We can follow the light instead of guessing our way through.'},
    {who:'NARRATOR',text:'Take the torch beside the entrance. Rook will leave chalk marks; Pip can sense hidden waystones when you press Q.'},
    {who:'ROOK',text:'I am now Head of Navigation. We shall never speak of the other maze.'}
  ],
  engineIntro: [
    {who:'NARRATOR',text:'The party emerges into an abandoned observatory. A crystal lens is coated in pale mineral deposits; three old flasks sit on the workbench.'},
    {who:'THE WANDERER',text:'That looks like a carbonate crust. We should test the solutions before deciding what to use.'},
    {who:'ROOK',text:'My scientific method was going to be mixing everything together. Yours seems significantly less explosive.'},
    {who:'NARRATOR',text:'Read the notebook by the entrance. Test with the pH indicator, dissolve the deposits, rinse to neutral, then restore the lens and its companion relays.'}
  ],
  labTest:[
    {who:'THE WANDERER',text:'The indicator turns pink in this mildly acidic flask, and blue in the alkaline rinse.'},
    {who:'ROOK',text:'So pink means dramatic and blue means calm? I am learning science.'},
    {who:'THE WANDERER',text:'The crust looks carbonate-rich. We can carefully dissolve it with the dilute acidic solution, then restore neutral conditions.'},
    {who:'NARRATOR',text:'Observations recorded. Find the pink flask near the northern bench. Incorrect actions will not waste the solutions.'}
  ],
  labDissolve:[
    {who:'NARRATOR',text:'A gentle fizz spreads across the carbonate crust. The deposits gradually disappear, revealing the crystal surface underneath.'},
    {who:'THE WANDERER',text:'Carbonate reacted with the acid, just as we predicted. Now the chamber needs a neutral rinse.'},
    {who:'ROOK',text:'I also predicted bubbles. Do I get a certificate?'}
  ],
  labNeutralize:[
    {who:'NARRATOR',text:'The indicator shifts away from pink as the rinse is adjusted. The solution settles near neutral, and the exposed lens stops hissing.'},
    {who:'THE WANDERER',text:'Good. Now the crystal can work without the deposits or the acidic residue.'},
    {who:'ROOK',text:'Three cheers for experimentally verified not-exploding!'}
  ],
  labLens:[
    {who:'NARRATOR',text:'The clean crystal lens gathers starlight and sends it through two silent relays.'},
    {who:'THE WANDERER',text:'Rook, secure the western relay. Pip, we need your spark at the eastern one.'},
    {who:'ROOK',text:'Ah. Peer-reviewed teamwork. My favorite kind.'}
  ],
  finalGuardianIntro: [
    {who:'THE HOLLOW SOVEREIGN',text:'THE HORIZON BELONGS TO SILENCE. ALL ROADS END HERE.'},
    {who:'THE WANDERER',text:'Not this one.'},
    {who:'ROOK',text:'We have a plan! Some of it is even good.'},
    {who:'NARRATOR',text:'Rook must secure the western ward while Pip ignites the eastern star. Break the renewed shield when it returns. Dodge the Sovereign’s crescent volleys.'}
  ],
  pipLastLight: [
    {who:'NARRATOR',text:'At the brink of defeat, the Sovereign summons one last wall of night. The chamber trembles.'},
    {who:'ROOK',text:'Pip? I know you are tired, but we really need you!'},
    {who:'NARRATOR',text:'Pip opens one sleepy eye. A dazzling violet light bursts from her tiny paws, shattering the darkness in a single heartbeat.'},
    {who:'ROOK',text:'THAT IS MY GIRL! Also, when did she learn that?'},
    {who:'NARRATOR',text:'Pip promptly falls asleep. The Sovereign staggers, vulnerable. The final strike belongs to the Wanderer.'}
  ],
  finalGuardianDefeat: [
    {who:'NARRATOR',text:'The last blade-stroke finds its mark. The Hollow Sovereign dissolves into starlight, and the rifts across the world begin to close. In the falling sparks, the three companions find a final cloudy fragment.'},
    {who:'THE WANDERER',text:'We did it. All three of us.'},
    {who:'ROOK',text:'I had the whole thing under control. Except the parts I absolutely did not.'},
    {who:'THE WANDERER',text:'That sounds about right.'},
    {who:'ROOK',text:'Wait, is that the LAST cloudy fragment? You mean our mysterious rock collection actually has an ending?'},
    {who:'THE WANDERER',text:'Five pieces. All found in different places, by different hands. We should keep them safe.'},
    {who:'NARRATOR',text:'Pip rolls onto her back in the warm starlight. Peace returns to the horizon.'}
  ],
  // The personal meaning is intentionally confined to the post-victory cinematic.
  endingSlides: [
    {eyebrow:'THE LAST HORIZON',title:'A WORLD RESTORED',text:'The rifts close. The Wanderer, Rook, and Pip sit together beneath the first peaceful sunrise. Pip is already asleep.'},
    {eyebrow:'AN UNFINISHED MYSTERY',title:'FIVE STRANGE PIECES',text:'The cloudy fragments they gathered across the temple, the sky, the snow, the labyrinth, and the fortress begin to hum in unison.'},
    {eyebrow:'THE UNWRITTEN EMBLEM',title:'ONLY TOGETHER',text:'One piece from the Wanderer. One from Pip. One from Rook. Another found while searching for each other. The last carried by them all. The pieces finally fit.'},
    {eyebrow:'TWO DISTANT WORLDS',title:'ONE SHARED HORIZON',text:'The cloudy surface clears. Two lands, two sets of colors, and two very different beginnings have become part of one emblem.'},
    {eyebrow:'THE STORY BENEATH THE STORY',title:'FROM BRAZIL TO THE USA',text:'When I moved from Brazil to the United States to pursue my dreams, I stepped into a world that was new, unfamiliar, and sometimes difficult.'},
    {eyebrow:'THE DIFFICULT DAYS',title:'FINDING MY WAY',text:'There were challenges I had to face, questions I had to solve, and moments when everything felt far away from home.'},
    {eyebrow:'THE BEST DISCOVERY',title:'THEN I MET YOU',text:'And somewhere along the way, a goofy, wonderful, and ridiculously handsome companion — along with a needy little pup who always wanted to be close — made this unfamiliar world feel a little brighter, a lot less lonely, and so much more exciting to explore.'},
    {eyebrow:'THE STORY WITHIN THE STORY',title:'CLOSER THAN THEY SEEM',text:'Somewhere between unfamiliar places, impossible puzzles, ridiculous detours, and unexpected company, this stopped being just a story about a distant world. Perhaps it never really was.'},
    {eyebrow:'THANK YOU',title:'MY FAVORITE PART OF THE JOURNEY',text:'The pieces were never meant to stand alone. Thank you for making a world far from home feel like somewhere I belong, and for letting me share this adventure with you.'},
    {eyebrow:'CHAPTER COMPLETE',title:'NEW QUEST UNLOCKED',text:'OUR NEXT ADVENTURE  ♥  Wherever the road leads, I hope we keep exploring it together.'}
  ],
  islesGuardianDefeat: [
    {who:'NARRATOR', text:'The Rift Sentinel bursts into a thousand harmless sparks. The broken skyways steady, and the second celestial seal glows.'},
    {who:'THE WANDERER', text:'Two seals. One more to find.'},
    {who:'ROOK', text:'I would like the record to show that my tactical standing-near-you was essential.'},
    {who:'THE WANDERER', text:'It actually was. Thank you.'},
    {who:'ROOK', text:'Oh. Uh. You are welcome. Pip, please stop eating the victory confetti.'},
    {who:'NARRATOR', text:'Pip yawns, nestles between them, and promptly goes to sleep.'}
  ]
};
