(() => {
  'use strict';
  const TILE=32, W=24, H=15, WIDTH=W*TILE, HEIGHT=H*TILE;
  const canvas=document.getElementById('game'), c=canvas.getContext('2d');
  const fogCanvas=document.createElement('canvas');fogCanvas.width=768;fogCanvas.height=480;const fog=fogCanvas.getContext('2d');
  c.imageSmoothingEnabled=false;
  const el=id=>document.getElementById(id);
  const STORY=window.AWA_STORY;
  const ROOM_NAMES=['THE MOSS GATE','HALL OF ECHOES','THE SANCTUM','WINDWARD LANDING','THE DRIFTING SPAN','STORMGLASS AERIE','GLACIER APPROACH','WHITEOUT PASS','THE WINTER HEART','THE TURNING GALLERIES','THE HALL OF FALSE FACES','THE MIRROR THRONE','THE GLOAM MAZE',"THE ALCHEMIST’S OBSERVATORY",'THE LAST HORIZON'];
  const SAVE_KEY='a-world-away-forgotten-temple-v1';
  const palettes=[
    {floor:'#5c7065',floor2:'#69796b',edge:'#839481',walls:'#344c4b',walltop:'#6b7970',moss:'#8ca96d',accent:'#a6d5a0',shadow:'#253b3d'},
    {floor:'#616b6d',floor2:'#6f7470',edge:'#91948b',walls:'#44464e',walltop:'#828084',moss:'#9ba2a4',accent:'#b7d1d6',shadow:'#2d343c'},
    {floor:'#4b505e',floor2:'#54596b',edge:'#798298',walls:'#2e3449',walltop:'#62677b',moss:'#7c7da7',accent:'#b5b4fd',shadow:'#222b44'},
    {floor:'#548c91',floor2:'#62a3a7',edge:'#9dd4c5',walls:'#345b6c',walltop:'#8cbfc1',moss:'#a4c9a4',accent:'#d5eaa4',shadow:'#25495a'},
    {floor:'#53758e',floor2:'#628da3',edge:'#a3bed5',walls:'#344d72',walltop:'#7896ae',moss:'#90b2cf',accent:'#bce5ed',shadow:'#253950'},
    {floor:'#60618e',floor2:'#73799f',edge:'#b0b1d4',walls:'#343756',walltop:'#8883ae',moss:'#a8abe0',accent:'#d6ccff',shadow:'#23263c'},
    {floor:'#8bb1bd',floor2:'#9ac4cb',edge:'#d4f5f3',walls:'#4c7185',walltop:'#c7e3e6',moss:'#c5e5df',accent:'#fff2c9',shadow:'#304d63'},
    {floor:'#698fae',floor2:'#7da9c3',edge:'#d0edfa',walls:'#355d7c',walltop:'#a5c5d5',moss:'#b6dce7',accent:'#f4f6d5',shadow:'#233f61'},
    {floor:'#687eac',floor2:'#788ebc',edge:'#ced9f6',walls:'#394765',walltop:'#879dd0',moss:'#c6d6f5',accent:'#fff0b9',shadow:'#263052'},
    {floor:'#5a6375',floor2:'#666d82',edge:'#9fabc0',walls:'#292f48',walltop:'#6c6b86',moss:'#adb1d4',accent:'#d2b5f5',shadow:'#1b2339'},
    {floor:'#585a75',floor2:'#676587',edge:'#b19cc6',walls:'#2e294b',walltop:'#797198',moss:'#c5a9db',accent:'#f4c7ff',shadow:'#221d37'},
    {floor:'#4c4a69',floor2:'#5d5b7c',edge:'#a9a3d5',walls:'#27223e',walltop:'#66628f',moss:'#aaadd4',accent:'#ffe3b1',shadow:'#1a1930'},
    {floor:'#305b6f',floor2:'#397184',edge:'#b6d5d8',walls:'#21384f',walltop:'#758ab6',moss:'#b5cecf',accent:'#fce5b0',shadow:'#182d45'},
    {floor:'#404e76',floor2:'#4d6390',edge:'#9aaee3',walls:'#262c59',walltop:'#717bb2',moss:'#c0b9dd',accent:'#e6d4ff',shadow:'#191f45'},
    {floor:'#3e4264',floor2:'#484f79',edge:'#a1aad6',walls:'#242643',walltop:'#8186aa',moss:'#b8b7e1',accent:'#f2dfb2',shadow:'#13182e'}
  ];
  const px=t=>(t+.5)*TILE;
  const dist=(ax,ay,bx,by)=>Math.hypot(ax-bx,ay-by);
  const hash=(x,y,z=1)=>{let v=Math.imul(x+13,374761393)^Math.imul(y+7,668265263)^Math.imul(z+31,2246822519);v=Math.imul(v^(v>>>13),1274126177);return (v^(v>>>16))>>>0};
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noteRooms=[0,1,3,4,6,7,8,9,10,11,12,13,14];
  const storage={get(){try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}},put(v){try{localStorage.setItem(SAVE_KEY,JSON.stringify(v))}catch{}},clear(){try{localStorage.removeItem(SAVE_KEY)}catch{}}};
  const creatorMode=window.AWA_CREATOR_MODE===true;
  const COMPLETED_KEY='awa-adventure-cleared-v1';
  let journeyCleared=false;
  try{journeyCleared=localStorage.getItem(COMPLETED_KEY)==='yes'}catch{}
  const canReplay=()=>creatorMode||journeyCleared;
  let initializing=true;
  const state={
    mode:'intro',room:0,player:{x:px(2),y:px(7),hp:6,maxHp:6,facing:'right',invuln:0,swing:0,dash:0,dashTime:0,dashDX:1,dashDY:0},
    braziers:[false,false],runesIndex:0,runesSolved:false,readTablet:false,chest:false,usedPotions:[],bossDefeated:false,bridgeCollapsed:false,bridgeFallTime:3,rookVisible:false,
    rookSwitch:false,pipPlate:false,pipPlateRequested:false,foundSandwich:false,ch2BossDefeated:false,ch2Complete:false,ch3Fires:[false,false],rookRescued:false,crystalAwake:false,ch3Hearts:[false,false],ch3BossDefeated:false,ch3Complete:false,mazePhase:0,mazeEchoes:[false,false],rookFound:false,pipFound:false,mirrorSteps:0,mirrorSeen:[false,false,false],regentAnchors:[false,false],regentReformed:false,ch4BossDefeated:false,ch4Complete:false,waystones:[false,false,false],engineStar:false,engineRelays:[false,false],finalWards:[false,false],finalReformed:false,pipMiracle:false,ch5BossDefeated:false,ch5Complete:false,rookAssistUsed:false,fragments:[false,false,false,false,false],fragmentCallback:null,hasTorch:false,mazeBeacons:[false,false,false],mazeMarks:[],pipSenseCooldown:0,pipSenseTime:0,labAnalyzed:false,labPhase:0,finaleStep:0,warmth:100,coldDamageTimer:0,slipVX:0,slipVY:0,notesRead:[],latestNote:null,selectedNote:null,
    rook:{x:px(2),y:px(9)},pip:{x:px(2),y:px(10)},pipPetCooldown:0,rookShieldCooldown:0,windPulse:0,
    enemies:[],boss:null,projectiles:[],particles:[],floatingText:[],screenShake:0,dialogue:[],dialogueIndex:0,dialogueCallback:null,notice:'',noticeTimer:0,viewTime:0,roomArr:[],audioOn:true,audio:null,frame:0
  };
  const keys=new Set();
  const soundtrack=new window.AWA_Soundtrack();
  try{state.audioOn=localStorage.getItem('awa-audio-muted')!=='1'}catch{}
  soundtrack.setEnabled(state.audioOn);
  const worldObjects=[
    [{type:'brazier',x:6,y:3,id:0,display:'Light the first brazier'}, {type:'brazier',x:18,y:11,id:1,display:'Light the second brazier'}, {type:'tablet',x:3,y:6,display:'Read the worn inscription'}, {type:'chest',x:12,y:11,display:'Open the supply chest'}, {type:'gate',x:22,y:7,display:'Enter the Hall of Echoes'}],
    [{type:'rune',id:0,x:6,y:3,display:'Activate the SUN rune'}, {type:'rune',id:1,x:12,y:11,display:'Activate the MOON rune'}, {type:'rune',id:2,x:18,y:3,display:'Activate the STAR rune'}, {type:'tablet',x:3,y:7,display:'Inspect the carved tablet'}, {type:'chest',x:20,y:11,display:'Open the supply chest'}, {type:'gate',x:22,y:7,display:'Enter the inner sanctum'}],
    [{type:'gate',x:22,y:7,display:'Approach the broken bridge'},{type:'chest',x:5,y:12,display:'Open the old supply chest'}],
    [{type:'switch',x:8,y:4,display:'Ask Rook to hold the sky-switch'}, {type:'tablet',x:3,y:6,display:'Read the skyfarer inscription'}, {type:'snack',x:5,y:12,display:'Investigate a suspicious picnic'}, {type:'chest',x:16,y:3,display:'Open the skyfarer supply chest'}, {type:'gate',x:22,y:7,display:'Cross to the Drifting Span'}],
    [{type:'plate',x:5,y:7,display:'Ask Pip to rest on the ancient plate'}, {type:'tablet',x:3,y:6,display:'Read the skybridge inscription'}, {type:'chest',x:19,y:11,display:'Open the skyfarer supply chest'}, {type:'gate',x:22,y:7,display:'Enter Stormglass Aerie'}],
    [{type:'chest',x:4,y:12,display:'Open the skyfarer supply chest'}, {type:'gate',x:22,y:7,display:'Claim the second seal'}],
    [{type:'fire',id:0,x:6,y:4,display:'Light the first warming beacon'}, {type:'fire',id:1,x:17,y:10,display:'Light the second warming beacon'}, {type:'tablet',x:3,y:6,display:'Read the frostbound inscription'}, {type:'chest',x:5,y:11,display:'Open the mountain cache'}, {type:'gate',x:22,y:7,display:'Enter Whiteout Pass'}],
    [{type:'rescue',x:11,y:8,display:'Pull Rook out of the snow'}, {type:'crystal',x:15,y:4,display:'Ask Pip to awaken the ice crystal'}, {type:'shelter',x:4,y:3,display:'Take shelter from the blizzard'}, {type:'shelter',x:12,y:12,display:'Rest at the sheltered cairn'}, {type:'tablet',x:3,y:7,display:'Read the wind-worn inscription'}, {type:'gate',x:22,y:7,display:'Cross into the Winter Heart'}],
    [{type:'heart',id:0,x:7,y:3,display:'Ignite the first heart-flame'}, {type:'tablet',x:3,y:6,display:'Read the winter-heart inscription'}, {type:'heart',id:1,x:19,y:11,display:'Ignite the second heart-flame'}, {type:'chest',x:4,y:11,display:'Open the mountain cache'}, {type:'gate',x:22,y:7,display:'Claim the third seal'}],
    [{type:'tablet',x:3,y:6,display:'Read the shifting-stone inscription'}, {type:'turnwheel',x:5,y:7,display:'Rotate the shifting galleries'}, {type:'turnwheel',x:13,y:7,display:'Rotate the shifting galleries'}, {type:'turnwheel',x:20,y:7,display:'Rotate the shifting galleries'}, {type:'echo',id:0,x:13,y:3,display:'Collect the upper echo'}, {type:'echo',id:1,x:20,y:11,display:'Collect the lower echo'}, {type:'chest',x:6,y:11,display:'Open the lost explorer cache'}, {type:'gate',x:22,y:7,display:'Pass into the Hall of False Faces'}],
    [{type:'tablet',x:3,y:6,display:'Read the reflection inscription'}, {type:'findrook',x:7,y:8,display:'Investigate the fallen stone'}, {type:'findpip',x:12,y:12,display:'Investigate the strange column'}, {type:'mirror',id:0,x:8,y:3,display:'Awaken the SUN mirror'}, {type:'mirror',id:2,x:13,y:4,display:'Touch the central mirror'}, {type:'mirror',id:1,x:17,y:11,display:'Awaken the STAR mirror'}, {type:'chest',x:5,y:11,display:'Open the hall cache'}, {type:'gate',x:22,y:7,display:'Enter the Mirror Throne'}],
    [{type:'tablet',x:3,y:6,display:'Read the mirror-regent inscription'}, {type:'anchor',id:0,x:6,y:4,display:'Ask Rook to hold the anchor'}, {type:'anchor',id:1,x:19,y:11,display:'Ask Pip to awaken the prism'}, {type:'chest',x:4,y:11,display:'Open the regent cache'}, {type:'gate',x:22,y:7,display:'Claim the Horizon Key'}],
    [{type:'torch',x:3,y:7,display:'Take the traveler’s torch'}, {type:'tablet',x:4,y:7,display:'Read the gloam inscription'}, {type:'waystone',id:0,x:5,y:3,display:'Awaken the first celestial waystone'}, {type:'waystone',id:1,x:10,y:11,display:'Awaken the second celestial waystone'}, {type:'waystone',id:2,x:20,y:3,display:'Awaken the third celestial waystone'}, {type:'beacon',id:0,x:5,y:12,display:'Ask Rook to light the first guide flame'}, {type:'beacon',id:1,x:14,y:5,display:'Ask Rook to light the second guide flame'}, {type:'beacon',id:2,x:19,y:11,display:'Ask Rook to light the third guide flame'}, {type:'chest',x:3,y:12,display:'Open the shadow cache'}, {type:'gate',x:22,y:11,display:'Follow the lights to the observatory'}],
    [{type:'tablet',x:3,y:7,display:'Read the alchemist’s notebook'}, {type:'indicator',x:5,y:7,display:'Test the solutions with the color indicator'}, {type:'acid',x:7,y:4,display:'Apply the mild acidic solution to mineral deposits'}, {type:'base',x:17,y:11,display:'Neutralize the chamber with the alkaline rinse'}, {type:'lens',x:13,y:7,display:'Inspect and reactivate the crystal lens'}, {type:'relay',id:0,x:10,y:11,display:'Ask Rook to secure the western relay'}, {type:'relay',id:1,x:19,y:4,display:'Ask Pip to awaken the eastern spark'}, {type:'chest',x:4,y:11,display:'Open the observatory cache'}, {type:'gate',x:22,y:7,display:'Enter the Last Horizon'}],
    [{type:'tablet',x:3,y:6,display:'Read the final ward inscription'}, {type:'ward',id:0,x:6,y:4,display:'Ask Rook to secure the western ward'}, {type:'ward',id:1,x:19,y:11,display:'Ask Pip to light the eastern star'}, {type:'chest',x:4,y:11,display:'Open the last supply cache'}, {type:'gate',x:22,y:7,display:'Approach the restored horizon'}]
  ];
  function makeWalls(room){
    const wall=new Set(); const put=(x,y)=>wall.add(`${x},${y}`); const rect=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)put(x,y)};
    for(let x=0;x<W;x++){put(x,0);put(x,H-1)}for(let y=0;y<H;y++){put(0,y);put(W-1,y)}
    if(room===0){rect(5,5,6,6);rect(17,5,18,6);rect(5,9,6,10);rect(17,9,18,10);rect(10,7,10,7);rect(14,7,14,7)}
    if(room===1){rect(6,5,8,6);rect(16,8,18,9);rect(10,3,11,3);rect(12,9,13,9);rect(5,10,6,10);rect(18,4,18,5)}
    if(room===2){rect(5,4,6,5);rect(18,4,19,5);rect(5,10,6,11);rect(18,10,19,11)}
    if(room===3){rect(11,3,13,4);rect(14,10,16,11);rect(5,9,6,9);rect(18,4,19,5);rect(10,8,11,9);rect(16,6,17,7)}
    if(room===4){rect(7,1,7,13);if(state.pipPlate){wall.delete('7,6');wall.delete('7,7')}rect(12,3,13,4);rect(15,9,16,10);rect(19,4,19,5)}
    if(room===5){rect(6,4,7,5);rect(17,4,18,5);rect(6,10,7,11);rect(17,10,18,11)}
    if(room===6){rect(9,5,10,6);rect(14,3,15,4);rect(5,8,6,9);rect(17,5,18,6);rect(12,10,13,11)}
    if(room===7){rect(17,1,17,13);if(state.crystalAwake){wall.delete('17,7');wall.delete('17,8')}rect(7,3,8,4);rect(11,5,12,6);rect(5,9,6,9);rect(20,10,20,11)}
    if(room===8){rect(5,4,6,5);rect(17,4,18,5);rect(5,10,6,11);rect(16,10,17,11)}
    if(room===9){
      for(let y=1;y<=13;y++){if(Math.abs(y-[3,11,7][state.mazePhase])>0)put(9,y);if(Math.abs(y-[3,11,7][state.mazePhase])>0)put(17,y)}
      rect(6,2,7,2);rect(12,9,13,10);rect(19,3,20,4);
    }
    if(room===10){rect(6,6,7,7);rect(15,5,16,6);rect(10,10,11,11);rect(19,3,20,4)}
    if(room===11){rect(7,5,8,6);rect(17,4,18,5);rect(6,10,7,11);rect(17,9,18,10)}
    if(room===12){
      // Three chambers, each with two doors. Every chamber is fully navigable.
      for(let y=1;y<14;y++)for(const x of [7,12,17])put(x,y);
      for(const y of [3,11])wall.delete(`7,${y}`);
      for(const y of [5,9])wall.delete(`12,${y}`);
      for(const y of [3,12])wall.delete(`17,${y}`);
      rect(4,4,5,4);rect(9,7,10,7);rect(14,10,15,10);rect(19,7,20,7);
      // Never build an invisible trap in the first few tiles around the torch.
    }
    if(room===13){rect(11,5,12,6);rect(15,8,16,9);rect(5,9,6,9);rect(19,10,20,10)}
    if(room===14){rect(7,5,8,6);rect(17,4,18,5);rect(6,10,7,11);rect(17,9,18,10)}
    return wall;
  }
  function initEnemies(room){
    if(room===0)return [[9,4],[11,10],[19,8]].map(([x,y],i)=>enemy(x,y,i));
    if(room===1)return [[4,9],[10,5],[17,11],[20,5]].map(([x,y],i)=>enemy(x,y,i));
    if(room===3)return [[9,8],[19,10],[17,3]].map(([x,y],i)=>enemy(x,y,i,'wisp'));
    if(room===4)return [[4,11],[11,7],[18,6],[20,11]].map(([x,y],i)=>enemy(x,y,i,'wisp'));
    if(room===5)return [[9,3],[16,11]].map(([x,y],i)=>enemy(x,y,i,'wisp'));
    if(room===6)return [[10,9],[14,7],[19,4]].map(([x,y],i)=>enemy(x,y,i,'frost'));
    if(room===7)return [[5,6],[12,9],[20,4]].map(([x,y],i)=>enemy(x,y,i,'frost'));
    if(room===8)return [[10,3],[15,11]].map(([x,y],i)=>enemy(x,y,i,'frost'));
    if(room===9)return [[6,4],[12,12],[20,8]].map(([x,y],i)=>enemy(x,y,i,'shade'));
    if(room===10)return [[7,9],[14,6],[20,12],[19,6]].map(([x,y],i)=>enemy(x,y,i,'shade'));
    if(room===11)return [[10,3],[14,11]].map(([x,y],i)=>enemy(x,y,i,'shade'));
    if(room===12)return [[9,7],[17,11],[17,3]].map(([x,y],i)=>enemy(x,y,i,'shade'));
    if(room===13)return [[8,9],[15,4],[19,12]].map(([x,y],i)=>enemy(x,y,i,'shade'));
    if(room===14)return [[10,3],[14,11]].map(([x,y],i)=>enemy(x,y,i,'shade'));
    return [];
  }
  function enemy(x,y,i,kind='slime'){return {x:px(x),y:px(y),hp:kind==='wisp'?2:kind==='frost'||kind==='shade'?3:3,kind,alive:true,speed:kind==='wisp'?52:kind==='frost'?43:kind==='shade'?48:39+(i%2)*8,id:i,phase:hash(i,x)%6,flash:0,contact:0,shot:1.4+i*.45}}
  function initialBoss(room=2){const second=room===5,third=room===8,fourth=room===11,fifth=room===14;return {x:px(15),y:px(7),hp:fifth?24:fourth?26:third?22:second?18:12,maxHp:fifth?24:fourth?26:third?22:second?18:12,alive:fifth?!state.ch5BossDefeated:fourth?!state.ch4BossDefeated:third?!state.ch3BossDefeated:second?!state.ch2BossDefeated:!state.bossDefeated,windup:0,cooldown:1.5,flash:0,invuln:0,attacks:0,lockedAngle:0,lockedTargetX:0,lockedTargetY:0,kind:fifth?'sovereign':fourth?'mirror':third?'frost':second?'rift':'stone'}}
  const FRAGMENT_TITLES=['MOSS-SLEEPING SHARD','SKY-GLASS SHARD','SNOW-BOUND SHARD','ECHO-SILVER SHARD','THE LAST SHARD'];
  function awardFragment(chapter,who='THE PARTY'){
    if(state.fragments[chapter])return;
    state.fragments[chapter]=true;
    addSparks(state.player.x,state.player.y-24,36,'#eedfc3');ding('pickup');
    floatText(state.player.x,state.player.y-39,'✦ UNWRITTEN FRAGMENT ✦','#fff2c1');
    notice(`${FRAGMENT_TITLES[chapter]} FOUND · ${state.fragments.filter(Boolean).length} / 5`);
    refreshFragments();save();
  }
  const FRAGMENT_ORIGINS=['THE WANDERER · FORGOTTEN TEMPLE','PIP · SHATTERED ISLES','ROOK · FROSTBOUND PEAKS','THE WANDERER · ENDLESS LABYRINTH','THE WHOLE PARTY · LAST HORIZON'];
  function fragmentScene(chapter,callback=null){
    // A dialogue always finishes before this scene opens; avoid swallowing its callback.
    if(!state.fragments[chapter])awardFragment(chapter);
    state.mode='fragment';state.fragmentCallback=callback;
    el('fragment-name').textContent=FRAGMENT_TITLES[chapter];
    el('fragment-symbol').textContent=['✦','◆','✧','◇','✺'][chapter];
    el('fragment-discovery').textContent=FRAGMENT_ORIGINS[chapter]+' — Its surface is still clouded. Nobody knows what these pieces form.';
    el('fragment-progress').textContent=state.fragments.filter(Boolean).length+' / 5 FRAGMENTS GATHERED';
    el('fragment-scene').classList.remove('hidden');refreshFragments();
    el('fragment-continue').focus({preventScroll:true});
  }
  function closeFragmentScene(){
    el('fragment-scene').classList.add('hidden');state.mode='play';
    const done=state.fragmentCallback;state.fragmentCallback=null;
    if(done)done();canvas.focus({preventScroll:true});
  }
  function refreshFragments(){
    const count=state.fragments.filter(Boolean).length;
    const counter=el('fragment-count');if(counter)counter.textContent=`${count} / 5`;
    const tray=el('fragment-tray');if(tray)tray.innerHTML=state.fragments.map((on,i)=>`<span class="fragment-chip ${on?'found':'unknown'}" title="${on?FRAGMENT_TITLES[i]:'Unknown fragment'}" aria-label="${on?FRAGMENT_TITLES[i]:'Undiscovered fragment'}">${on?['✦','◆','✧','◇','✺'][i]:'?'}</span>`).join('');
  }
  // Shortest walkable route: Pip never points through an impenetrable maze wall.
  function mazeRoute(target){
    const source=[Math.floor(state.player.x/TILE),Math.floor(state.player.y/TILE)];
    const destination=[target.x,target.y],code=([x,y])=>`${x},${y}`;
    const queue=[source],seen=new Map([[code(source),null]]);
    for(let i=0;i<queue.length;i++){
      const here=queue[i];if(code(here)===code(destination))break;
      for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){
        const next=[here[0]+dx,here[1]+dy],k=code(next);
        if(next[0]<1||next[0]>=W-1||next[1]<1||next[1]>=H-1||state.roomArr.has(k)||seen.has(k))continue;
        seen.set(k,code(here));queue.push(next);
      }
    }
    if(!seen.has(code(destination)))return [];
    const path=[];let at=code(destination);
    while(at!==null){path.push(at.split(',').map(Number));at=seen.get(at)}
    return path.reverse();
  }
  function senseWithPip(){
    if(state.mode!=='play'||state.room!==12||!state.hasTorch)return;
    if(state.pipSenseCooldown>0){notice('PIP NEEDS ANOTHER MOMENT TO FOCUS');return}
    state.pipSenseCooldown=7;state.pipSenseTime=4.2;
    const goals=worldObjects[12].filter(o=>o.type==='waystone'&&!state.waystones[o.id]);
    const targets=goals.length?goals:worldObjects[12].filter(o=>o.type==='gate');
    const routes=targets.map(target=>({target,path:mazeRoute(target)})).filter(item=>item.path.length);
    const chosen=routes.sort((a,b)=>a.path.length-b.path.length)[0];
    if(!chosen){notice('PIP CANNOT SENSE A CLEAR ROUTE YET');return}
    state.pipSenseTarget=chosen.target;
    addSparks(state.pip.x,state.pip.y,26,'#d7b8ff');ding('pickup');
    notice(`PIP FOUND A ROUTE TO ${goals.length?'THE NEXT WAYSTONE':'THE EXIT'} — FOLLOW HER LAVENDER SPARKS`);
  }
  function roomLoad(room){
    state.room=room;state.bridgeFallTime=state.bridgeCollapsed?3:0;state.roomArr=makeWalls(room);state.enemies=initEnemies(room);state.projectiles=[];state.particles=[];state.floatingText=[];state.screenShake=0;
    state.player.x=px(2);state.player.y=px(7);state.player.facing='right';state.player.invuln=.8;
    state.rook.x=px(2);state.rook.y=px(9);state.pip.x=px(3);state.pip.y=px(9);
    if(room===3&&state.rookSwitch){state.rook.x=px(8);state.rook.y=px(4)}
    if(room===4&&state.pipPlate){state.pip.x=px(5);state.pip.y=px(7)}
    if(room===7&&!state.rookRescued){state.rook.x=px(11);state.rook.y=px(8)}
    if(room===10){if(!state.rookFound){state.rook.x=px(7);state.rook.y=px(8)}if(!state.pipFound){state.pip.x=px(12);state.pip.y=px(12)}}
    if(room===11&&state.regentAnchors[0]){state.rook.x=px(6);state.rook.y=px(4)}
    if(room===11&&state.regentAnchors[1]){state.pip.x=px(19);state.pip.y=px(11)}
    if(room===13&&state.engineRelays[0]){state.rook.x=px(10);state.rook.y=px(11)}
    if(room===13&&state.engineRelays[1]){state.pip.x=px(19);state.pip.y=px(4)}
    if(room===14&&state.finalWards[0]){state.rook.x=px(6);state.rook.y=px(4)}
    if(room===14&&state.finalWards[1]){state.pip.x=px(19);state.pip.y=px(11)}
    state.rookAssistUsed=false;state.pipSenseCooldown=0;state.pipSenseTime=0;document.body.classList.toggle('gloam-active',room===12);
    state.slipVX=0;state.slipVY=0;state.warmth=clamp(state.warmth,30,100);
    state.rookVisible=room>=3;state.boss=[2,5,8,11,14].includes(room)?initialBoss(room):null;
    updateTrail();refreshUI();save();
  }
  const CHAPTERS=[
    {start:0,title:'THE FORGOTTEN TEMPLE',short:'THE FORGOTTEN\nTEMPLE',subtitle:'THE WORLD IS BREAKING',description:'A lone wanderer. A lost celestial seal. And a ruin that definitely does not look safe.',rooms:['THE MOSS GATE','HALL OF ECHOES','THE SANCTUM']},
    {start:3,title:'THE SHATTERED ISLES',short:'THE SHATTERED\nISLES',subtitle:'THE SKY IS FRACTURING',description:'Three adventurers. Floating kingdoms. A bridge that looks suspiciously temporary.',rooms:['WINDWARD LANDING','THE DRIFTING SPAN','STORMGLASS AERIE']},
    {start:6,title:'THE FROSTBOUND PEAKS',short:'THE FROSTBOUND\nPEAKS',subtitle:'THE STORM NEVER SLEEPS',description:'An unforgiving mountain. Frozen ruins. One extremely unprepared adventurer in a green hat.',rooms:['GLACIER APPROACH','WHITEOUT PASS','THE WINTER HEART']},
    {start:9,title:'THE ENDLESS LABYRINTH',short:'THE ENDLESS\nLABYRINTH',subtitle:'THE WALLS ARE LISTENING',description:'A maze that rearranges itself. Reflections that lie. And one adventurer who insists this is a shortcut.',rooms:['THE TURNING GALLERIES','HALL OF FALSE FACES','THE MIRROR THRONE']},
    {start:12,title:'THE LAST HORIZON',short:'THE LAST\nHORIZON',subtitle:'WHERE ALL ROADS MEET',description:'A torch in the darkness. A curious experiment. Three companions facing the last horizon.',rooms:['THE GLOAM MAZE','THE ALCHEMIST’S OBSERVATORY','THE LAST HORIZON']}
  ];
  function updateTrail(){
    const chapter=Math.min(4,Math.floor(state.room/3)),data=CHAPTERS[chapter],current=state.room%3;
    document.querySelector('.chapter-trail').innerHTML=data.rooms.map((name,i)=>`<div class="trail-node ${i===current?'active':i<current?'done':''}" data-room="${data.start+i}"><span class="trail-index">0${i+1}</span><span>${name}</span></div>${i<2?'<div class="trail-line"></div>':''}`).join('');
    el('header-chapter').textContent=`CHAPTER ${['I','II','III','IV','V'][chapter]}`;el('header-region').textContent=data.title;
    el('chapter-counter').textContent=`CHAPTER 0${chapter+1} / 05`;
    document.title=`A World Away | ${data.title}`;
    // Gift menu keeps its spoiler-free title; chapter-specific names are only shown during play.
    el('warmth-hud').classList.toggle('hidden',state.room<6||state.room>8);
  }
  function save(){if(initializing)return;storage.put({room:state.room,hp:state.player.hp,braziers:state.braziers,runesIndex:state.runesIndex,runesSolved:state.runesSolved,readTablet:state.readTablet,chest:state.chest,usedPotions:state.usedPotions,bossDefeated:state.bossDefeated,bridgeCollapsed:state.bridgeCollapsed,rookSwitch:state.rookSwitch,pipPlate:state.pipPlate,pipPlateRequested:state.pipPlateRequested,foundSandwich:state.foundSandwich,ch2BossDefeated:state.ch2BossDefeated,ch2Complete:state.ch2Complete,ch3Fires:state.ch3Fires,rookRescued:state.rookRescued,crystalAwake:state.crystalAwake,ch3Hearts:state.ch3Hearts,ch3BossDefeated:state.ch3BossDefeated,ch3Complete:state.ch3Complete,mazePhase:state.mazePhase,mazeEchoes:state.mazeEchoes,rookFound:state.rookFound,pipFound:state.pipFound,mirrorSteps:state.mirrorSteps,mirrorSeen:state.mirrorSeen,regentAnchors:state.regentAnchors,regentReformed:state.regentReformed,ch4BossDefeated:state.ch4BossDefeated,ch4Complete:state.ch4Complete,waystones:state.waystones,engineStar:state.engineStar,engineRelays:state.engineRelays,finalWards:state.finalWards,finalReformed:state.finalReformed,pipMiracle:state.pipMiracle,ch5BossDefeated:state.ch5BossDefeated,ch5Complete:state.ch5Complete,warmth:state.warmth,fragments:state.fragments,hasTorch:state.hasTorch,mazeBeacons:state.mazeBeacons,mazeMarks:state.mazeMarks,labAnalyzed:state.labAnalyzed,labPhase:state.labPhase,notesRead:state.notesRead,latestNote:state.latestNote})}
  function replenishChapterChests(room=state.room){
    const chapter=Math.floor(room/3),start=chapter*3;
    state.usedPotions=state.usedPotions.filter(id=>!Array.from({length:3},(_,i)=>`${start+i}-`).some(prefix=>id.startsWith(prefix)));
  }
  function reset(){if(state.mode==='paused')resumeGame();storage.clear();state.player.hp=6;state.braziers=[false,false];state.runesIndex=0;state.runesSolved=false;state.readTablet=false;state.chest=false;state.usedPotions=[];state.bossDefeated=false;state.bridgeCollapsed=false;state.rookVisible=false;state.rookSwitch=false;state.pipPlate=false;state.pipPlateRequested=false;state.foundSandwich=false;state.ch2BossDefeated=false;state.ch2Complete=false;state.ch3Fires=[false,false];state.rookRescued=false;state.crystalAwake=false;state.ch3Hearts=[false,false];state.ch3BossDefeated=false;state.ch3Complete=false;state.mazePhase=0;state.mazeEchoes=[false,false];state.rookFound=false;state.pipFound=false;state.mirrorSteps=0;state.mirrorSeen=[false,false,false];state.regentAnchors=[false,false];state.regentReformed=false;state.ch4BossDefeated=false;state.ch4Complete=false;state.waystones=[false,false,false];state.engineStar=false;state.engineRelays=[false,false];state.finalWards=[false,false];state.finalReformed=false;state.pipMiracle=false;state.ch5BossDefeated=false;state.ch5Complete=false;state.fragments=[false,false,false,false,false];state.hasTorch=false;state.mazeBeacons=[false,false,false];state.mazeMarks=[];state.pipSenseCooldown=0;state.pipSenseTime=0;state.labAnalyzed=false;state.labPhase=0;state.finaleStep=0;state.warmth=100;state.coldDamageTimer=0;state.slipVX=0;state.slipVY=0;state.notesRead=[];state.latestNote=null;state.selectedNote=null;state.floatingText=[];state.screenShake=0;state.pipPetCooldown=0;state.rookShieldCooldown=0;roomLoad(0);state.mode='intro';el('intro').classList.remove('hidden');el('victory').classList.add('hidden');el('victory2').classList.add('hidden');el('victory3').classList.add('hidden');el('victory4').classList.add('hidden');el('finale').classList.add('hidden');el('death').classList.add('hidden');el('dialogue').classList.add('hidden');storage.clear()}
  function restore(){const data=storage.get();if(!data||typeof data.room!=='number'||data.room<0||data.room>14){roomLoad(0);storage.clear();return}state.braziers=Array.isArray(data.braziers)?data.braziers:[false,false];state.runesIndex=clamp(Number(data.runesIndex)||0,0,3);state.runesSolved=!!data.runesSolved;state.readTablet=!!data.readTablet;state.chest=!!data.chest;state.usedPotions=Array.isArray(data.usedPotions)?data.usedPotions:[];state.bossDefeated=!!data.bossDefeated;state.bridgeCollapsed=!!data.bridgeCollapsed;
    state.rookSwitch=!!data.rookSwitch;state.pipPlate=!!data.pipPlate;state.pipPlateRequested=!!data.pipPlateRequested;state.foundSandwich=!!data.foundSandwich;
    state.ch2BossDefeated=!!data.ch2BossDefeated;state.ch2Complete=!!data.ch2Complete;
    state.ch3Fires=Array.isArray(data.ch3Fires)?data.ch3Fires.slice(0,2).map(Boolean):[false,false];state.rookRescued=!!data.rookRescued;state.crystalAwake=!!data.crystalAwake;state.ch3Hearts=Array.isArray(data.ch3Hearts)?data.ch3Hearts.slice(0,2).map(Boolean):[false,false];state.ch3BossDefeated=!!data.ch3BossDefeated;state.ch3Complete=!!data.ch3Complete;state.mazePhase=clamp(Number(data.mazePhase)||0,0,2);state.mazeEchoes=Array.isArray(data.mazeEchoes)?data.mazeEchoes.slice(0,2).map(Boolean):[false,false];state.rookFound=!!data.rookFound;state.pipFound=!!data.pipFound;state.mirrorSteps=clamp(Number(data.mirrorSteps)||0,0,2);state.mirrorSeen=Array.isArray(data.mirrorSeen)?data.mirrorSeen.slice(0,3).map(Boolean):[false,false,false];state.regentAnchors=Array.isArray(data.regentAnchors)?data.regentAnchors.slice(0,2).map(Boolean):[false,false];state.regentReformed=!!data.regentReformed;state.ch4BossDefeated=!!data.ch4BossDefeated;state.ch4Complete=!!data.ch4Complete;state.waystones=Array.isArray(data.waystones)?data.waystones.slice(0,3).map(Boolean):[false,false,false];state.engineStar=!!data.engineStar;state.engineRelays=Array.isArray(data.engineRelays)?data.engineRelays.slice(0,2).map(Boolean):[false,false];state.finalWards=Array.isArray(data.finalWards)?data.finalWards.slice(0,2).map(Boolean):[false,false];state.finalReformed=!!data.finalReformed;state.pipMiracle=!!data.pipMiracle;state.ch5BossDefeated=!!data.ch5BossDefeated;state.ch5Complete=!!data.ch5Complete;state.fragments=Array.isArray(data.fragments)&&data.fragments.length===5?data.fragments.map(Boolean):[!!data.bossDefeated,!!(data.pipPlate||data.ch2Complete),!!(data.rookRescued||data.ch3Complete),!!(data.mirrorSteps===2||data.ch4Complete),!!data.ch5BossDefeated];state.hasTorch=!!data.hasTorch;state.mazeBeacons=Array.isArray(data.mazeBeacons)&&data.mazeBeacons.length===3?data.mazeBeacons.map(Boolean):[false,false,false];state.mazeMarks=Array.isArray(data.mazeMarks)?data.mazeMarks.slice(-100).filter(x=>/^\d{1,2},\d{1,2}$/.test(x)):[];state.labAnalyzed=!!data.labAnalyzed;state.labPhase=clamp(Number(data.labPhase)||0,0,2);if(state.labPhase===2)state.engineStar=true;state.warmth=clamp(Number(data.warmth)||100,1,100);
    state.notesRead=Array.isArray(data.notesRead)?data.notesRead.filter(n=>noteRooms.includes(n)):[];
    state.latestNote=noteRooms.includes(data.latestNote)?data.latestNote:(state.notesRead.length?state.notesRead[state.notesRead.length-1]:null);state.selectedNote=null;
    if(data.readTablet&&!state.notesRead.includes(1))state.notesRead.push(1);
    if(state.latestNote===null&&state.notesRead.length)state.latestNote=state.notesRead[state.notesRead.length-1];
    state.player.hp=clamp(data.hp||6,1,6);if(Number(data.room)===5&&!state.ch2Complete&&state.ch2BossDefeated)state.ch2BossDefeated=false;roomLoad(data.room)}
  function hideOverlays(){for(const id of ['intro','death','dialogue','fragment-scene','victory','victory2','victory3','victory4','finale'])el(id).classList.add('hidden')}
  let finalePreview=false;
  // Title menu: no chapter names or ending preview until the entire ending has been viewed.
  function updateGiftMenu(){
    const hasSave=!!storage.get(),unlocked=canReplay();
    const play=el('start');
    play.textContent=journeyCleared&&!creatorMode?'▶  PLAY AGAIN':hasSave?'▶  CONTINUE JOURNEY':'▶  PLAY';
    el('new-journey').classList.toggle('hidden',!hasSave||journeyCleared&&!creatorMode);
    el('chapter-replay-toggle').classList.toggle('hidden',!unlocked);
    el('preview-ending').classList.toggle('hidden',!unlocked);
    el('preview-ending').innerHTML=creatorMode&&!journeyCleared?'✧ &nbsp; WATCH ENDING <span>CREATOR PREVIEW · SPOILERS</span>':'✧ &nbsp; REPLAY ENDING';
    const panel=el('chapter-replay-panel');
    if(!unlocked){panel.classList.add('hidden');el('chapter-replay-toggle').setAttribute('aria-expanded','false')}
    for(const button of document.querySelectorAll('[data-chapter-start]'))button.disabled=!unlocked;
    el('pause-chapters').textContent='⌂ Main Menu';
    for(const id of ['chapter-menu-victory2','chapter-menu-victory3','chapter-menu-victory4'])el(id).textContent=unlocked?'▦ Chapter Select':'⌂ Main Menu';
  }
  function showChapterMenu(){
    if(state.mode==='paused')resumeGame();
    finalePreview=false;el('finale-preview-tools').classList.add('hidden');journalClose();keys.clear();
    state.mode='intro';hideOverlays();el('intro').classList.remove('hidden');document.title='A World Away | A Pixel-Art Adventure';
    el('chapter-replay-panel').classList.add('hidden');el('chapter-replay-toggle').setAttribute('aria-expanded','false');
    updateGiftMenu();refreshChapterButtons();
  }
  function refreshChapterButtons(){document.querySelectorAll('[data-chapter-start]').forEach(button=>{const n=Number(button.dataset.chapterStart);button.classList.toggle('chapter-current',Math.floor(state.room/3)===n)})}
  function markAdventureComplete(){
    if(finalePreview||!state.ch5Complete)return;
    journeyCleared=true;
    try{localStorage.setItem(COMPLETED_KEY,'yes')}catch{}
    updateGiftMenu();
  }
  function beginChapter(chapter,fromVictory=false){
    if(state.audioOn)soundtrack.unlock();
    chapter=clamp(Number(chapter)||0,0,4);journalClose();keys.clear();hideOverlays();state.mode='play';state.player.hp=6;state.player.invuln=1.4;
    if(chapter===0){state.braziers=[false,false];state.runesIndex=0;state.runesSolved=false;state.readTablet=false;state.bossDefeated=false;state.bridgeCollapsed=false;state.chest=false}
    if(chapter===1){state.bossDefeated=true;state.bridgeCollapsed=true;state.rookSwitch=false;state.pipPlate=false;state.pipPlateRequested=false;state.foundSandwich=false;state.ch2BossDefeated=false;state.ch2Complete=false}
    if(chapter===2){state.bossDefeated=true;state.ch2BossDefeated=true;state.ch2Complete=true;state.ch3Fires=[false,false];state.rookRescued=false;state.crystalAwake=false;state.ch3Hearts=[false,false];state.ch3BossDefeated=false;state.ch3Complete=false;state.warmth=100;state.coldDamageTimer=0}
    if(chapter===3){state.bossDefeated=true;state.ch2BossDefeated=true;state.ch2Complete=true;state.ch3BossDefeated=true;state.ch3Complete=true;state.mazePhase=0;state.mazeEchoes=[false,false];state.rookFound=false;state.pipFound=false;state.mirrorSteps=0;state.mirrorSeen=[false,false,false];state.regentAnchors=[false,false];state.regentReformed=false;state.ch4BossDefeated=false;state.ch4Complete=false;state.warmth=100}
    if(chapter===4){state.hasTorch=false;state.mazeBeacons=[false,false,false];state.mazeMarks=[];state.labAnalyzed=false;state.labPhase=0;state.bossDefeated=true;state.ch2BossDefeated=true;state.ch2Complete=true;state.ch3BossDefeated=true;state.ch3Complete=true;state.ch4BossDefeated=true;state.ch4Complete=true;state.waystones=[false,false,false];state.engineStar=false;state.engineRelays=[false,false];state.finalWards=[false,false];state.finalReformed=false;state.pipMiracle=false;state.ch5BossDefeated=false;state.ch5Complete=false;state.warmth=100}
    state.fragments=Array.from({length:5},(_,i)=>i<chapter);replenishChapterChests(chapter*3);
    roomLoad(chapter*3);canvas.focus({preventScroll:true});
    speak([STORY.opening,STORY.islesIntro,STORY.peaksIntro,STORY.labyrinthIntro,STORY.horizonIntro][chapter]);
  }
  function start(){if(state.audioOn)soundtrack.unlock();hideOverlays();state.mode='play';canvas.focus({preventScroll:true});const saved=storage.get();if(!saved){beginChapter(0);return}
    if(state.ch5Complete&&state.room===14){startFinale();}
    else if(state.ch4Complete&&state.room===11){state.mode='end';el('victory4').classList.remove('hidden')}
    else if(state.ch3Complete&&state.room===8){state.mode='end';el('victory3').classList.remove('hidden')}
    else if(state.ch2Complete&&state.room===5){state.mode='end';el('victory2').classList.remove('hidden')}
    else if(state.bossDefeated&&state.bridgeCollapsed&&state.room===2){state.mode='end';el('victory').classList.remove('hidden')}
    else{notice('JOURNEY RESUMED — FOLLOW YOUR JOURNAL')};refreshUI();}
  function playFromTitle(){
    // After completion, Play Again begins a fresh journey without relocking replay options.
    if(journeyCleared&&!creatorMode){reset();start();return}
    start();
  }
  function startNewJourney(){
    if(!window.confirm('Begin a new adventure? Your current journey progress will be replaced.'))return;
    reset();showChapterMenu();playFromTitle();
  }
  function speak(lines,callback=null){if(!lines||!lines.length){if(callback)callback();return}state.mode='dialogue';state.dialogue=lines;state.dialogueIndex=0;state.dialogueCallback=callback;el('dialogue').classList.remove('hidden');showLine()}
  // Original, source-editable SVG pixel portraits rendered locally; never copied game art.
  function portraitSVG(name){
    const rook=name==='ROOK',pip=name==='PIP',wanderer=name==='THE WANDERER',unknown=name==='???';
    const skin=rook?'#ecc09b':'#e3b894',hair=rook?'#70573e':'#323646',coat=rook?'#b78a5c':'#537d96';
    if(pip)return `<svg viewBox="0 0 120 136" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true"><rect width="120" height="136" fill="#342c58"/><rect x="7" y="10" width="106" height="116" fill="#463b70"/><rect x="10" y="104" width="100" height="22" fill="#9383c0"/><rect x="21" y="48" width="78" height="62" rx="7" fill="#b3a5d9"/><rect x="19" y="20" width="18" height="48" fill="#b7def0"/><rect x="83" y="18" width="18" height="48" fill="#b7def0"/><rect x="34" y="70" width="12" height="10" fill="#352e50"/><rect x="76" y="70" width="12" height="10" fill="#352e50"/><rect x="54" y="86" width="12" height="8" fill="#f6d0df"/><rect x="56" y="90" width="8" height="5" fill="#694e83"/><rect x="14" y="112" width="24" height="7" fill="#d4c5e9"/><rect x="82" y="112" width="24" height="7" fill="#d4c5e9"/><rect x="34" y="37" width="52" height="7" fill="#e5d8f7"/><rect x="51" y="28" width="20" height="7" fill="#e6d7ff"/></svg>`;
    if(!rook&&!wanderer&&!unknown){return `<svg viewBox="0 0 120 136" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true"><rect width="120" height="136" fill="#1e253e"/><rect x="14" y="18" width="92" height="108" fill="#574568"/><path d="M 35 88 L 60 12 L 85 88 Z" fill="#b49fd2"/><rect x="39" y="65" width="42" height="30" fill="#25304c"/><rect x="54" y="72" width="12" height="13" fill="#fff0ba"/><rect x="15" y="110" width="90" height="12" fill="#746c90"/></svg>`}
    if(unknown)return `<svg viewBox="0 0 120 136" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true"><rect width="120" height="136" fill="#213139"/><rect x="12" y="108" width="96" height="20" fill="#26352e"/><rect x="32" y="49" width="56" height="65" fill="#1b2930"/><rect x="39" y="27" width="42" height="34" fill="#1b2930"/><rect x="24" y="24" width="72" height="11" fill="#354b3c"/><rect x="43" y="13" width="34" height="16" fill="#354b3c"/><rect x="42" y="69" width="10" height="5" fill="#f5dfb7"/><rect x="69" y="69" width="10" height="5" fill="#f5dfb7"/></svg>`;
    const cap=rook?`<rect x="23" y="30" width="75" height="12" fill="#688051"/><rect x="35" y="17" width="50" height="17" fill="#789563"/><rect x="24" y="38" width="72" height="7" fill="#3d5245"/>`:`<rect x="25" y="28" width="70" height="21" fill="${hair}"/><rect x="29" y="22" width="24" height="23" fill="${hair}"/><rect x="68" y="21" width="24" height="23" fill="${hair}"/>`;
    const grin=rook?`<rect x="48" y="86" width="26" height="6" fill="#6b3d38"/><rect x="52" y="86" width="18" height="3" fill="#fff5e1"/>`:`<rect x="53" y="89" width="16" height="3" fill="#7c5147"/>`;
    return `<svg viewBox="0 0 120 136" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true"><rect width="120" height="136" fill="${rook?'#324839':'#233c4b'}"/><rect x="9" y="10" width="102" height="117" fill="${rook?'#395a46':'#304d61'}"/><rect x="13" y="114" width="94" height="13" fill="#202b36"/><rect x="17" y="101" width="86" height="26" fill="${coat}"/><rect x="24" y="108" width="72" height="19" fill="${coat}"/><rect x="36" y="62" width="48" height="50" fill="${skin}"/><rect x="35" y="47" width="50" height="30" fill="${skin}"/>${cap}<rect x="41" y="69" width="11" height="8" fill="#243442"/><rect x="69" y="69" width="11" height="8" fill="#243442"/><rect x="45" y="69" width="4" height="5" fill="#94c0c1"/><rect x="73" y="69" width="4" height="5" fill="#94c0c1"/><rect x="56" y="81" width="10" height="5" fill="#d7a184"/>${grin}<rect x="39" y="108" width="42" height="6" fill="${rook?'#d9b879':'#b9d5e6'}"/><rect x="54" y="113" width="14" height="12" fill="${rook?'#bea45f':'#e2bb7c'}"/></svg>`;
  }
  function showLine(){
    const line=state.dialogue[state.dialogueIndex];
    if(state.room===2&&state.bridgeCollapsed&&['???','ROOK','PIP'].includes(line.who))state.rookVisible=true;
    el('dialogue-name').textContent=line.who;
    el('dialogue-text').textContent=line.text;
    const narr=['NARRATOR','ANCIENT TABLET','ANCIENT GATE'].includes(line.who);
    const stage=el('dialogue-stage');stage.classList.toggle('narration',narr);
    const primary=el('portrait-primary'),secondary=el('portrait-secondary');
    if(narr){stage.classList.remove('single-speaker');primary.innerHTML='';secondary.innerHTML='';return}
    primary.innerHTML=portraitSVG(line.who);
    let partner='THE WANDERER';
    if(line.who==='THE WANDERER')partner=state.room<3?'': 'ROOK';
    if(line.who==='ROOK'||line.who==='???')partner='THE WANDERER';
    if(line.who==='PIP')partner='ROOK';
    if(line.who.startsWith('THE ')&&line.who!=='THE WANDERER')partner='THE WANDERER';
    secondary.innerHTML=partner?portraitSVG(partner):'';
    secondary.classList.toggle('empty',!partner);
    stage.classList.toggle('single-speaker',!partner);
  }
  function nextLine(){if(state.mode!=='dialogue')return;state.dialogueIndex++;if(state.dialogueIndex>=state.dialogue.length){el('dialogue').classList.add('hidden');state.mode='play';const done=state.dialogueCallback;state.dialogueCallback=null;if(done)done();canvas.focus({preventScroll:true})}else showLine()}
  el('fragment-continue').addEventListener('click',closeFragmentScene);
  function startFinale(){
    finalePreview=false;el('finale-preview-tools').classList.add('hidden');
    keys.clear();journalClose();hideOverlays();state.mode='cinematic';state.finaleStep=0;
    el('finale').classList.remove('hidden');renderFinale();save();
  }
  // A creator-only viewing route: never awards fragments, unlocks chapters, or writes save data.
  function startFinalePreview(){
    if(!canReplay())return;
    if(state.audioOn)soundtrack.unlock();
    finalePreview=true;keys.clear();journalClose();hideOverlays();state.mode='cinematic';state.finaleStep=0;
    el('finale-preview-tools').classList.remove('hidden');
    el('finale').classList.remove('hidden');renderFinale();
    el('finale-next').focus({preventScroll:true});
  }
  function previousFinalePreview(){
    if(!finalePreview||state.mode!=='cinematic')return;
    if(state.finaleStep>0){state.finaleStep--;renderFinale()}
  }
  function renderFinale(){
    const slide=STORY.endingSlides[state.finaleStep];if(!slide)return;
    el('finale-eyebrow').textContent=slide.eyebrow;
    el('finale-title').textContent=slide.title;
    el('finale-text').textContent=slide.text;
    el('finale-progress').textContent=`${String(state.finaleStep+1).padStart(2,'0')} / ${String(STORY.endingSlides.length).padStart(2,'0')}`;
    el('finale-next').textContent=state.finaleStep===STORY.endingSlides.length-1?(finalePreview?'✦ BACK TO MENU':'✦ RETURN TO MAIN MENU'):'CONTINUE ✦';
    el('finale-preview-prev').disabled=!finalePreview||state.finaleStep===0;
    el('finale').dataset.chapter=String(state.finaleStep);el('emblem-reveal').classList.toggle('visible',state.finaleStep>=1);el('emblem-reveal').classList.toggle('shaping',state.finaleStep>=2);el('emblem-reveal').classList.toggle('decoded',state.finaleStep>=3);el('shard-constellation').classList.toggle('show',state.finaleStep===1||state.finaleStep===2);el('shard-constellation').classList.toggle('assembling',state.finaleStep>=2);el('emblem-reveal').setAttribute('aria-hidden',String(state.finaleStep<3));
  }
  function advanceFinale(){
    if(state.mode!=='cinematic')return;
    if(state.finaleStep===STORY.endingSlides.length-1){markAdventureComplete();showChapterMenu();return}
    state.finaleStep++;renderFinale();
  }
  function notice(message){state.notice=message;state.noticeTimer=2.8;el('objective-flash').textContent=message;el('objective-flash').classList.add('show')}
  function ding(type){if(state.audioOn)soundtrack.effect(type)}
  function isWall(x,y){const tx=Math.floor(x/TILE),ty=Math.floor(y/TILE);return tx<0||tx>=W||ty<0||ty>=H||state.roomArr.has(`${tx},${ty}`)}
  function free(x,y,r=9){return !isWall(x-r,y-r)&&!isWall(x+r,y-r)&&!isWall(x-r,y+r)&&!isWall(x+r,y+r)}
  function moveActor(a,dx,dy,dt,speed,r=9){if(!dx&&!dy)return;const mag=Math.hypot(dx,dy)||1;const vx=dx/mag*dt*speed,vy=dy/mag*dt*speed;if(free(a.x+vx,a.y,r))a.x+=vx;if(free(a.x,a.y+vy,r))a.y+=vy}
  function followCompanion(actor,tx,ty,dt,speed){
    const d=dist(actor.x,actor.y,tx,ty);
    if(d>185){const x=state.player.x-20,y=state.player.y+27;if(free(x,y,8)){actor.x=x;actor.y=y}}
    else if(d>19)moveActor(actor,tx-actor.x,ty-actor.y,dt,speed,7);
  }
  function floatText(x,y,message,color='#fff0bd'){state.floatingText.push({x,y,text:message,color,life:.85,max:.85});}
  function addSparks(x,y,count=10,color='#d8efb4'){for(let i=0;i<count;i++){const ang=Math.random()*Math.PI*2,vel=35+Math.random()*75;state.particles.push({x,y,vx:Math.cos(ang)*vel,vy:Math.sin(ang)*vel,life:.35+Math.random()*.55,max:.8,color,size:2+Math.random()*3})}}
  function attack(){if(state.mode!=='play')return;const p=state.player;if(p.swing>0)return;p.swing=.27;ding('attack');let dx=0,dy=0;if(p.facing==='up')dy=-1;if(p.facing==='down')dy=1;if(p.facing==='left')dx=-1;if(p.facing==='right')dx=1;
    for(const e of state.enemies){if(!e.alive)continue;const d=dist(p.x,p.y,e.x,e.y),dot=((e.x-p.x)*dx+(e.y-p.y)*dy)/(d||1);if(d<56&&dot>-.05){e.hp-=2;e.flash=.22;addSparks(e.x,e.y,6,'#baffbd');floatText(e.x,e.y-15,'−2','#d3ffe4');if(e.hp<=0){e.alive=false;addSparks(e.x,e.y,17,'#caffb2');ding('pickup')}}}
    const b=state.boss;if(b&&b.alive&&b.invuln<=0){const d=dist(p.x,p.y,b.x,b.y),dot=((b.x-p.x)*dx+(b.y-p.y)*dy)/(d||1);if(d<67&&dot>-.20){if(b.kind==='sovereign'&&!state.finalWards.every(Boolean)){floatText(b.x,b.y-42,'SHADOW WARD!','#ead5ff');notice('SECURE THE WESTERN WARD AND THE EASTERN STAR');ding('fail');return}if(b.kind==='mirror'&&!state.regentAnchors.every(Boolean)){floatText(b.x,b.y-42,'REFLECTED!','#f4caff');notice('ROOK MUST HOLD THE ANCHOR AND PIP MUST LIGHT THE PRISM');ding('fail');return}if(b.kind==='frost'&&!state.ch3Hearts.every(Boolean)){floatText(b.x,b.y-42,'ICE ARMOR!','#c6e8ff');addSparks(b.x,b.y,7,'#c7eeff');notice('AWAKEN BOTH HEART-FLAMES TO MELT ITS ARMOR');return}b.hp=Math.max(0,b.hp-1);b.invuln=.23;b.flash=.24;addSparks(b.x,b.y,11,'#ffe6a0');floatText(b.x,b.y-42,'−1','#ffe9ad');state.screenShake=Math.max(state.screenShake,1.6);ding('boss');if(b.kind==='sovereign'&&b.hp<=12&&!state.finalReformed){state.finalReformed=true;state.finalWards=[false,false];notice('THE SOVEREIGN REFORMS ITS SHADOW WARD!');addSparks(b.x,b.y,45,'#d0bbff');ding('door');save();refreshUI();return}
      if(b.kind==='sovereign'&&b.hp<=6&&!state.pipMiracle){state.pipMiracle=true;b.hp=1;b.invuln=.4;addSparks(b.x,b.y,75,'#ebd0ff');state.projectiles=[];save();refreshUI();speak(STORY.pipLastLight,()=>{notice('THE SOVEREIGN IS EXPOSED — THE FINAL BLOW IS YOURS!')});return}
      if(b.kind==='mirror'&&b.hp<=13&&!state.regentReformed){state.regentReformed=true;state.regentAnchors=[false,false];addSparks(b.x,b.y,38,'#edb5ff');ding('door');save();refreshUI();speak(STORY.regentReformed,()=>notice('REACTIVATE ROOK’S ANCHOR AND PIP’S PRISM'))}if(b.hp<=0){b.alive=false;state.projectiles=[];state.screenShake=4.2;addSparks(b.x,b.y,45,'#ffe0b4');floatText(b.x,b.y-52,'SEAL FREED!','#fff0ad');ding('pickup');
      if(state.room===14){state.ch5BossDefeated=true;save();refreshUI();speak(STORY.finalGuardianDefeat,()=>{fragmentScene(4,()=>notice('THE HORIZON IS FREE — FOLLOW THE EASTERN LIGHT'))})}
      else if(state.room===11){state.ch4BossDefeated=true;save();refreshUI();speak(STORY.mirrorGuardianDefeat,()=>{notice('THE HORIZON KEY IS UNBOUND — TAKE THE EASTERN EXIT');refreshUI()})}
      else if(state.room===8){state.ch3BossDefeated=true;save();refreshUI();speak(STORY.peaksGuardianDefeat,()=>{notice('THIRD SEAL RECOVERED — THE EASTERN GATE IS OPEN');refreshUI()})}
      else if(state.room===5){state.ch2BossDefeated=true;save();refreshUI();speak(STORY.islesGuardianDefeat,()=>{notice('SECOND SEAL RECOVERED — SEEK THE EASTERN EXIT');refreshUI()})}
      else{state.bossDefeated=true;save();refreshUI();speak(STORY.guardianDefeat,()=>speak(STORY.fragmentOne,()=>fragmentScene(0,()=>notice('FIRST SEAL RECOVERED — CHECK THE EASTERN BRIDGE'))))}
    }}}
  }
  function triggerBridgeFall(){
    if(state.bridgeCollapsed||!state.bossDefeated)return;
    state.bridgeCollapsed=true;state.bridgeFallTime=0;state.rookVisible=false;state.screenShake=13;
    addSparks(px(22),px(7),70,'#ead9bc');ding('fail');save();refreshUI();
    speak(STORY.bridgeFall,()=>speak(STORY.rookEntrance,()=>{
      state.rookVisible=true;state.mode='end';refreshUI();
      el('victory').classList.remove('hidden');el('interaction-prompt').textContent='';ding('door');
    }));
  }
  function dash(){if(state.mode!=='play')return;const p=state.player;if(p.dash>0)return;p.dash=1.85;p.dashTime=.17;p.invuln=Math.max(.24,p.invuln);let dx=0,dy=0;dx=Number(keys.has('d')||keys.has('ArrowRight'))-Number(keys.has('a')||keys.has('ArrowLeft'));dy=Number(keys.has('s')||keys.has('ArrowDown'))-Number(keys.has('w')||keys.has('ArrowUp'));if(!dx&&!dy){dx=p.facing==='right'?1:p.facing==='left'?-1:0;dy=p.facing==='down'?1:p.facing==='up'?-1:0}const m=Math.hypot(dx,dy)||1;p.dashDX=dx/m;p.dashDY=dy/m;addSparks(p.x,p.y,6,'#fce6a7');ding('step')}
  function interactionTarget(){if(state.mode!=='play')return null;const p=state.player;let nearest=null,best=51;for(const o of worldObjects[state.room]){if(o.type==='torch'&&state.hasTorch)continue;const d=dist(p.x,p.y,px(o.x),px(o.y));if(d<best){best=d;nearest=o}}if(state.room>=3&&!(state.room===10&&!state.pipFound)&&!state.pipPlate){const d=dist(p.x,p.y,state.pip.x,state.pip.y);if(d<best&&d<45){nearest={type:'pip',display:'Pet Pip',x:state.pip.x/TILE-.5,y:state.pip.y/TILE-.5};best=d}}
    else if(state.room>=3&&!(state.room===10&&!state.pipFound)&&state.pipPlate&&state.room!==4){const d=dist(p.x,p.y,state.pip.x,state.pip.y);if(d<best&&d<45)nearest={type:'pip',display:'Pet Pip',x:state.pip.x/TILE-.5,y:state.pip.y/TILE-.5}}
    if(state.room===4&&state.pipPlateRequested&&!state.pipPlate&&dist(p.x,p.y,state.pip.x,state.pip.y)<58){
      return {type:'pip',display:'Pet Pip to open the bridge',x:state.pip.x/TILE-.5,y:state.pip.y/TILE-.5};
    }
    return nearest}
  function doInteract(){if(state.mode!=='play')return;const o=interactionTarget();if(!o)return;
    if(o.type==='torch'){
      if(state.hasTorch){notice('THE TORCH IS ALREADY LIT — THE GLOAM WILL NOT SWALLOW YOU');return}
      state.hasTorch=true;addSparks(px(o.x),px(o.y),35,'#ffe29e');floatText(px(o.x),px(o.y)-25,'TORCH LIT','#fff2bb');ding('pickup');save();refreshUI();
      speak([{who:'THE WANDERER',text:'A torch. Finally, something the shadows cannot argue with.'},{who:'ROOK',text:'I shall mark our route with chalk! Incredibly sophisticated cave navigation.'},{who:'NARRATOR',text:'Your torch reveals nearby tiles. Rook leaves chalk marks along the path. Press Q for Pip’s directional magic, or use SENSE on touchscreens.'}]);return;
    }
    if(o.type==='beacon'){
      if(!state.hasTorch){notice('FIND THE TORCH AT THE MAZE ENTRANCE FIRST');return}
      if(state.mazeBeacons[o.id]){notice('ROOK’S GUIDE FLAME IS STILL BURNING');return}
      if(dist(state.rook.x,state.rook.y,px(o.x),px(o.y))>185){notice('BRING ROOK CLOSER TO LIGHT THIS GUIDE FLAME');return}
      state.mazeBeacons[o.id]=true;addSparks(px(o.x),px(o.y),30,'#ffd89f');ding('door');
      notice('ROOK LIGHTS A GUIDE FLAME — THIS AREA WILL STAY BRIGHT');save();refreshUI();return;
    }
    if(o.type==='indicator'){
      if(state.labAnalyzed){notice('INDICATOR RESULTS: PINK = MILDLY ACIDIC; BLUE = ALKALINE');return}
      state.labAnalyzed=true;addSparks(px(o.x),px(o.y),20,'#bbd8ff');save();refreshUI();
      speak(STORY.labTest,()=>notice('CARBONATE DEPOSITS: USE MILD ACID, THEN NEUTRALIZE BEFORE ACTIVATING THE LENS'));return;
    }
    if(o.type==='acid'){
      if(!state.labAnalyzed){notice('TEST THE SOLUTIONS WITH THE INDICATOR FIRST');return}
      if(state.labPhase>=1){notice('THE MINERAL DEPOSIT HAS ALREADY DISSOLVED');return}
      state.labPhase=1;addSparks(px(o.x),px(o.y),31,'#b5dfff');ding('pickup');save();refreshUI();speak(STORY.labDissolve);return;
    }
    if(o.type==='base'){
      if(state.labPhase<1){notice('FIRST DISSOLVE THE CARBONATE DEPOSIT WITH THE MILD ACID');return}
      if(state.labPhase>=2){notice('THE RINSE IS ALREADY NEUTRALIZED');return}
      state.labPhase=2;addSparks(px(o.x),px(o.y),32,'#d3eeaf');ding('pickup');save();refreshUI();speak(STORY.labNeutralize);return;
    }
    if(o.type==='lens'){
      if(state.engineStar){notice('THE CRYSTAL LENS IS RESTORED — COORDINATE THE TWO RELAYS');return}
      if(state.labPhase!==2){notice('THE LENS NEEDS CLEANED DEPOSITS AND A NEUTRAL CHAMBER');return}
      state.engineStar=true;addSparks(px(o.x),px(o.y),42,'#e6c8ff');ding('door');save();refreshUI();speak(STORY.labLens,()=>notice('THE LENS WORKS — NOW ROOK’S RELAY, THEN PIP’S SPARK'));return;
    }
    if(o.type==='waystone'){
      if(!state.hasTorch){notice('THE SHADOWS ARE TOO DEEP — TAKE THE TORCH FIRST');return}
      if(state.waystones[o.id]){notice('THIS CELESTIAL WAYSTONE IS ALREADY AWAKE');return}
      state.waystones[o.id]=true;addSparks(px(o.x),px(o.y),30,'#f3e1b9');ding('door');
      notice(state.waystones.every(Boolean)?'ALL THREE SEALS RESONATE — THE ENGINE OPENS!':`WAYSTONE ${state.waystones.filter(Boolean).length} / 3 AWAKENED`);
      save();refreshUI();return;
    }
    if(o.type==='starwheel'){
      if(state.engineStar){notice('THE WANDERING STAR IS ALIGNED');return}
      state.engineStar=true;addSparks(px(o.x),px(o.y),35,'#c3d9ff');ding('door');
      notice('STAR ALIGNED — NOW ASK ROOK TO HOLD THE WESTERN RELAY');save();refreshUI();return;
    }
    if(o.type==='relay'){
      if(!state.engineStar){notice('FIRST ALIGN THE WANDERING STAR');return}
      if(o.id===1&&!state.engineRelays[0]){notice('ROOK MUST SECURE THE WESTERN RELAY FIRST');return}
      if(state.engineRelays[o.id]){notice('THIS RELAY IS ALREADY POWERED');return}
      const ally=o.id===0?state.rook:state.pip;
      if(dist(ally.x,ally.y,px(o.x),px(o.y))>168){notice(`WAIT FOR ${o.id===0?'ROOK':'PIP'} TO CATCH UP`);return}
      state.engineRelays[o.id]=true;ally.x=px(o.x);ally.y=px(o.y);
      addSparks(px(o.x),px(o.y),32,o.id===0?'#ffe0b0':'#e5bdff');ding('door');
      notice(state.engineRelays.every(Boolean)?'THE ENGINE SINGS — THE LAST GATE IS OPEN!': 'ROOK HOLDS THE RELAY — TAKE PIP TO THE EASTERN SPARK');save();refreshUI();return;
    }
    if(o.type==='ward'){
      if(state.finalWards[o.id]){notice(o.id===0?'ROOK HOLDS THE WESTERN WARD':'PIP GUARDS THE EASTERN STAR');return}
      const ally=o.id===0?state.rook:state.pip;
      if(dist(ally.x,ally.y,px(o.x),px(o.y))>170){notice(`WAIT FOR ${o.id===0?'ROOK':'PIP'} TO CATCH UP`);return}
      state.finalWards[o.id]=true;ally.x=px(o.x);ally.y=px(o.y);
      addSparks(px(o.x),px(o.y),30,o.id===0?'#ffe5b5':'#e7baff');ding('door');
      notice(state.finalWards.every(Boolean)?'THE SHADOW WARD SHATTERS — ATTACK!':'ONE WARD REMAINS — THE PARTY MUST WORK TOGETHER');save();refreshUI();return;
    }
    if(o.type==='turnwheel'){
      state.mazePhase=(state.mazePhase+1)%3;state.roomArr=makeWalls(9);
      addSparks(px(o.x),px(o.y),24,'#d0a9fd');ding('door');floatText(px(o.x),px(o.y)-25,`PHASE ${state.mazePhase+1}`,'#f4d5ff');
      notice(['FIRST FACE — UPPER CORRIDOR','SECOND FACE — LOWER CORRIDOR','THIRD FACE — EASTERN PASSAGE'][state.mazePhase]);save();refreshUI();return;
    }
    if(o.type==='echo'){
      if(state.mazeEchoes[o.id]){notice('THIS ECHO IS ALREADY REMEMBERED');return}
      if(state.mazePhase!==o.id){notice(`THE ${o.id===0?'UPPER':'LOWER'} ECHO ONLY AWAKENS IN ${o.id===0?'THE FIRST':'THE SECOND'} FACE`);ding('fail');return}
      state.mazeEchoes[o.id]=true;addSparks(px(o.x),px(o.y),29,'#e9c6ff');ding('pickup');notice(o.id===0?'UPPER ECHO FOUND — SEEK THE SECOND FACE':'BOTH ECHOES FOUND — TURN TO THE THIRD FACE');save();refreshUI();return;
    }
    if(o.type==='findrook'){
      if(state.rookFound){notice('ROOK IS HERE — STILL EXPLORING AGGRESSIVELY');return}
      state.rookFound=true;addSparks(px(o.x),px(o.y),27,'#fad4ad');ding('pickup');save();refreshUI();speak(STORY.findRook);return;
    }
    if(o.type==='findpip'){
      if(!state.rookFound){notice('ROOK MAY KNOW HOW TO SEE THROUGH THIS ILLUSION');return}
      if(state.pipFound){notice('PIP IS HERE — TRY NOT TO WAKE HER');return}
      state.pipFound=true;addSparks(px(o.x),px(o.y),27,'#dbc3ff');ding('pickup');save();refreshUI();speak(STORY.findPip);return;
    }
    if(o.type==='mirror'){
      if(!state.rookFound||!state.pipFound){notice('FIRST FIND ROOK AND PIP — YOU NEED YOUR PARTY TO READ THE MIRRORS');return}
      if(state.mirrorSteps===2){notice('THE TWO TRUE MIRRORS ARE ALREADY ALIGNED');return}
      if(!state.mirrorSeen[o.id]){
        state.mirrorSeen[o.id]=true;save();refreshUI();
        speak(STORY.mirrorVoices[o.id],()=>notice(state.mirrorSeen.every(Boolean)?'ALL VOICES HEARD — ONE IS LYING. CHOOSE THE TRUE MIRRORS IN ORDER.':'EXAMINE THE OTHER MIRRORS BEFORE ALIGNING THEM'));
        return;
      }
      if(!state.mirrorSeen.every(Boolean)){notice('LISTEN TO THE VOICES OF ALL THREE MIRRORS FIRST');return}
      if(o.id===state.mirrorSteps){
        state.mirrorSteps++;addSparks(px(o.x),px(o.y),22,'#f7ceff');ding('pickup');save();refreshUI();
        if(state.mirrorSteps===2)speak(STORY.fragmentFour,()=>fragmentScene(3,()=>notice('THE FALSE GATE DISSOLVES — HEAD EAST')));
        else notice('A TRUE REFLECTION ANSWERS. THE NEXT TRUE MIRROR IS STILL WAITING.');
      }else{state.mirrorSteps=0;notice('THE MIRRORS DARKEN. RECONSIDER THEIR STATEMENTS.');ding('fail');state.screenShake=3;floatText(px(o.x),px(o.y)-28,'FALSE!','#ffc3cd');save();refreshUI()}
      return;
    }
    if(o.type==='anchor'){
      if(state.regentAnchors[o.id]){notice(o.id===0?'ROOK IS HOLDING THE ANCHOR':'PIP IS RESTING AT THE PRISM');return}
      if(o.id===0&&dist(state.rook.x,state.rook.y,px(o.x),px(o.y))>140){notice('WAIT FOR ROOK TO CATCH UP');return}
      if(o.id===1&&dist(state.pip.x,state.pip.y,px(o.x),px(o.y))>150){notice('WAIT FOR PIP TO CATCH UP');return}
      state.regentAnchors[o.id]=true;
      if(o.id===0){state.rook.x=px(o.x);state.rook.y=px(o.y)}else{state.pip.x=px(o.x);state.pip.y=px(o.y)}
      addSparks(px(o.x),px(o.y),25,o.id===0?'#b8eafb':'#f6d3ff');ding('door');
      notice(state.regentAnchors.every(Boolean)?'THE MIRROR SHIELD HAS SHATTERED!':o.id===0?'ROOK HOLDS THE ANCHOR — SEEK PIP’S PRISM':'PIP RESTS AT THE PRISM — FIND ROOK’S ANCHOR');save();refreshUI();return;
    }
    if(o.type==='fire'){if(state.ch3Fires[o.id]){notice('THE WARMING BEACON IS ALREADY BURNING');return}state.ch3Fires[o.id]=true;state.warmth=100;addSparks(px(o.x),px(o.y),30,'#ffdf9a');ding('pickup');floatText(px(o.x),px(o.y)-31,'WARMTH!','#ffeac3');notice('A WARMING BEACON BLAZES TO LIFE');save();refreshUI();return}
    if(o.type==='heart'){if(state.ch3Hearts[o.id]){notice('THE HEART-FLAME IS ALREADY LIT');return}state.ch3Hearts[o.id]=true;state.warmth=100;addSparks(px(o.x),px(o.y),35,'#ffd29d');floatText(px(o.x),px(o.y)-31,'HEART-FLAME','#ffeab4');ding('door');notice(state.ch3Hearts.every(Boolean)?'THE FROST GUARDIAN IS VULNERABLE!':'ONE MORE HEART-FLAME REMAINS');save();refreshUI();return}
    if(o.type==='rescue'){if(state.rookRescued){notice('ROOK IS FREE. HE SAYS HE WAS NEVER STUCK.');return}state.rookRescued=true;state.rook.x=state.player.x+20;state.rook.y=state.player.y+20;addSparks(state.rook.x,state.rook.y,30,'#d0f4ff');ding('pickup');save();refreshUI();speak(STORY.rookSnowRescue,()=>fragmentScene(2));return}
    if(o.type==='crystal'){if(state.crystalAwake){notice('PIP’S CRYSTAL SHINES BRIGHTLY');return}if(!state.rookRescued){notice('ROOK IS STILL BURIED IN SNOW. HELP HIM FIRST!');return}if(dist(state.pip.x,state.pip.y,px(o.x),px(o.y))>155){notice('WAIT FOR PIP TO CATCH UP');return}state.crystalAwake=true;state.roomArr=makeWalls(7);addSparks(px(o.x),px(o.y),42,'#b8e9ff');floatText(px(o.x),px(o.y)-40,'PATH OPEN!','#d7faff');ding('door');save();refreshUI();speak(STORY.pipIceCrystal);return}
    if(o.type==='shelter'){state.warmth=100;state.coldDamageTimer=0;addSparks(px(o.x),px(o.y),8,'#ffe8b0');notice('SHELTER FOUND — WARMTH RESTORED');ding('pickup');save();refreshUI();return}
    if(o.type==='brazier'){if(state.braziers[o.id]){notice('THIS BRAZIER IS ALREADY LIT');return}state.braziers[o.id]=true;addSparks(px(o.x),px(o.y),20,'#ffdc83');ding('pickup');notice(`BRAZIER ${state.braziers.filter(Boolean).length} / 2 IGNITED`);if(state.braziers.every(Boolean))setTimeout(()=>{if(state.mode==='play')notice('ANCIENT GATE UNSEALED — HEAD EAST')},900);save();refreshUI();return}
    if(o.type==='rune'){if(state.runesSolved){notice('THE RUNES ARE ALREADY ALIGNED');return}if(o.id===state.runesIndex){state.runesIndex++;ding('pickup');addSparks(px(o.x),px(o.y),12,'#e0c3ff');if(state.runesIndex===3){state.runesSolved=true;notice('ALL THREE RUNES ALIGN — THE GATE OPENS!');ding('door')}else{notice(['DAWN AWAKENS · 1 / 3','THE MOON ANSWERS · 2 / 3'][state.runesIndex-1])}}else{state.runesIndex=0;notice('THE RUNES GO DARK. TRY THE SEQUENCE AGAIN.');ding('fail');addSparks(px(o.x),px(o.y),8,'#ec9090')}save();refreshUI();return}
    if(o.type==='tablet'){
      if(!state.notesRead.includes(state.room))state.notesRead.push(state.room);
      state.latestNote=state.room;state.selectedNote=state.room;
      if(state.room===1)state.readTablet=true;
      addSparks(px(o.x),px(o.y)-10,12,'#ffe3a2');
      floatText(px(o.x),px(o.y)-24,'CLUE FOUND','#fff1c8');
      ding('pickup');save();refreshUI();speak(STORY.notes[state.room]);return;
    }
    if(o.type==='chest'){const id=`${state.room}-${o.x}-${o.y}`;if(state.usedPotions.includes(id)){notice('THIS CHEST IS EMPTY');return}if(state.player.hp>=state.player.maxHp){notice('YOUR HEALTH IS FULL — KEEP THIS TONIC FOR LATER');return}state.usedPotions.push(id);state.player.hp=Math.min(6,state.player.hp+3);notice('FOUND A HEALING TONIC · +3 HP');ding('pickup');addSparks(px(o.x),px(o.y),17,'#ffdd9c');save();refreshUI();return}
    if(o.type==='pip'){
      if(state.room===4&&state.pipPlateRequested&&!state.pipPlate){
        state.pipPlate=true;state.pipPlateRequested=false;
        state.pip.x=px(5);state.pip.y=px(7);state.roomArr=makeWalls(4);
        floatText(px(5),px(7)-27,'BRIDGE ON','#d6d1ff');addSparks(state.pip.x,state.pip.y,36,'#e1b9ff');ding('door');
        save();refreshUI();speak(STORY.pipPlate,()=>fragmentScene(1));return;
      }
      if(state.pipPetCooldown>0){notice('PIP ACCEPTS THE ATTENTION, BUT NEEDS A NAP');return}
      state.pipPetCooldown=20;addSparks(state.pip.x,state.pip.y,17,'#e6c7f5');floatText(state.pip.x,state.pip.y-24,'♥','#ffd7ed');ding('pickup');
      if(state.player.hp<state.player.maxHp){state.player.hp++;notice('PIP PURRS WITH MAGIC · +1 HP');save();refreshUI()}
      else notice('PIP IS DELIGHTED. THE WANDERER FEELS BRAVER.');return;
    }
    if(o.type==='switch'){
      if(state.rookSwitch){notice('ROOK IS STILL HEROICALLY HOLDING THE SWITCH');return}
      if(dist(state.rook.x,state.rook.y,px(o.x),px(o.y))>125){notice('WAIT FOR ROOK TO CATCH UP');return}
      state.rookSwitch=true;state.rook.x=px(o.x);state.rook.y=px(o.y);floatText(px(o.x),px(o.y)-27,'BRIDGE ON','#c3fff4');addSparks(state.rook.x,state.rook.y,24,'#b4eff0');ding('door');save();refreshUI();speak(STORY.switchSolved);return;
    }
    if(o.type==='snack'){
      if(state.foundSandwich){notice('ONLY CRUMBS REMAIN. ROOK IS STILL EMOTIONAL.');return}
      state.foundSandwich=true;save();speak([{who:'ROOK',text:'MY SANDWICH! I buried it on this island for safekeeping.'},{who:'THE WANDERER',text:'You buried a sandwich?'},{who:'ROOK',text:'It was a tactical picnic reserve. Unfortunately I forgot the coordinates.'},{who:'NARRATOR',text:'Rook retrieves a somewhat dusty sandwich. You are awarded the title: HONORARY SNACK FINDER.'}]);return;
    }
    if(o.type==='plate'){
      if(state.pipPlate){notice('PIP IS ASLEEP ON THE PRESSURE PLATE');return}
      if(state.pipPlateRequested){notice('PIP IS WAITING FOR HEAD SCRATCHES — APPROACH HER AND PRESS E');return}
      state.pipPlateRequested=true;save();refreshUI();speak(STORY.pipRequest);return;
    }
    if(o.type==='gate'){
      if(state.room===0){if(!state.braziers.every(Boolean)){speak([{who:'ANCIENT GATE',text:'The stone remains sealed. Two nearby braziers must burn before the way can open.'}]);return}ding('door');roomLoad(1);notice('THE HALL OF ECHOES');speak([{who:'NARRATOR',text:'Beyond the gate, three ancient runes pulse in different corners of the hall. Their sequence is carved into a nearby tablet.'}]);return}
      if(state.room===1){if(!state.runesSolved){notice('THE GATE REQUIRES THE THREE RUNES');return}ding('door');roomLoad(2);notice('THE INNER SANCTUM');speak(STORY.guardianIntro);return}
      if(state.room===2){if(!state.bossDefeated){speak([{who:'NARRATOR',text:'The exit is sealed by the Warden. Defeat the guardian to retrieve the celestial seal.'}]);return}if(!state.bridgeCollapsed){triggerBridgeFall();return}notice('ROOK AND PIP ARE READY — THE NEXT CHAPTER IS UNLOCKED');return}
      if(state.room===3){if(!state.rookSwitch){notice('THE SKYBRIDGE NEEDS SOMEONE TO HOLD THE SWITCH');return}ding('door');roomLoad(4);speak([{who:'ROOK',text:'My years of standing around have finally paid off.'},{who:'THE WANDERER',text:'You followed us over the bridge. Who is holding the switch?'},{who:'ROOK',text:'A pebble. Surprisingly good employee.'},{who:'NARRATOR',text:'Ahead, the next skybridge has vanished into thin air.'}]);return}
      if(state.room===4){if(!state.pipPlate){notice('THE GAP REMAINS — FIND THE ANCIENT PRESSURE PLATE');return}if(!state.ch2Complete){state.ch2BossDefeated=false;}ding('door');roomLoad(5);state.boss=initialBoss(5);refreshUI();addSparks(state.boss.x,state.boss.y,32,'#d7c6ff');speak(STORY.islesGuardianIntro);return}
      if(state.room===5){if(!state.ch2BossDefeated||(state.boss&&state.boss.alive)){notice('DEFEAT THE RIFT SENTINEL BEFORE CLAIMING THE SEAL');return}state.ch2Complete=true;save();state.mode='end';refreshUI();el('victory2').classList.remove('hidden');el('interaction-prompt').textContent='';ding('door');return}
      if(state.room===6){if(!state.ch3Fires.every(Boolean)){notice('LIGHT BOTH WARMING BEACONS BEFORE THE PASS OPENS');return}ding('door');roomLoad(7);state.warmth=100;speak(STORY.whiteoutIntro);return}
      if(state.room===7){if(!state.rookRescued||!state.crystalAwake){notice('THE ICE CHASM IS SEALED — HELP ROOK AND PIP');return}ding('door');roomLoad(8);state.warmth=100;speak(STORY.peaksGuardianIntro);return}
      if(state.room===8){if(!state.ch3BossDefeated){notice('THE FROST GUARDIAN STILL HOLDS THE THIRD SEAL');return}state.ch3Complete=true;save();state.mode='end';refreshUI();el('victory3').classList.remove('hidden');el('interaction-prompt').textContent='';ding('door');return}
      if(state.room===9){if(!state.mazeEchoes.every(Boolean)||state.mazePhase!==2){notice('FIND BOTH ECHOES AND TURN THE CORRIDORS TO THE THIRD FACE');return}ding('door');roomLoad(10);speak(STORY.galleryIntro);return}
      if(state.room===10){if(!state.rookFound||!state.pipFound||state.mirrorSteps<2){notice('FIND YOUR COMPANIONS AND ALIGN THE TWO TRUE MIRRORS');return}ding('door');roomLoad(11);speak(STORY.mirrorGuardianIntro);return}
      if(state.room===11){if(!state.ch4BossDefeated){notice('THE MIRROR REGENT STILL GUARDS THE HORIZON KEY');return}state.ch4Complete=true;save();state.mode='end';refreshUI();el('victory4').classList.remove('hidden');el('interaction-prompt').textContent='';ding('door');return}
      if(state.room===12){if(!state.hasTorch||!state.waystones.every(Boolean)){notice('AWAKEN ALL THREE CELESTIAL WAYSTONES');return}ding('door');roomLoad(13);speak(STORY.engineIntro);return}
      if(state.room===13){if(state.labPhase!==2||!state.engineStar||!state.engineRelays.every(Boolean)){notice('ALIGN THE STAR, THEN COMPLETE BOTH COMPANION RELAYS');return}ding('door');roomLoad(14);speak(STORY.finalGuardianIntro);return}
      if(state.room===14){if(!state.ch5BossDefeated){notice('THE HOLLOW SOVEREIGN STILL HOLDS THE HORIZON');return}if(!state.fragments.every(Boolean)){notice('THE FIVE UNWRITTEN FRAGMENTS ARE CALLING — SEEK WHAT IS MISSING');return}state.ch5Complete=true;save();startFinale();return}
    }
  }
  function hurt(damage){const p=state.player;if(p.invuln>0||state.mode!=='play')return;
    if((state.room===5||state.room===8||state.room===11||state.room===14||(state.room===7&&state.rookRescued))&&state.rookShieldCooldown<=0&&dist(p.x,p.y,state.rook.x,state.rook.y)<105){
      state.rookShieldCooldown=10;addSparks(p.x,p.y,19,'#c8e9ff');ding('door');notice('ROOK BLOCKS THE ATTACK! “TOTALLY INTENTIONAL!”');p.invuln=.65;return;
    }
    p.hp=Math.max(0,p.hp-damage);p.invuln=1.35;
    if(p.hp===1&&state.room>=3&&!state.rookAssistUsed&&!(state.room===7&&!state.rookRescued)&&!(state.room===10&&!state.rookFound)&&dist(p.x,p.y,state.rook.x,state.rook.y)<235){
      state.rookAssistUsed=true;p.hp=2;addSparks(p.x,p.y,21,'#ffdfaa');floatText(p.x,p.y-39,'ROOK +1 ♥','#ffe6ae');
      ding('pickup');speak(STORY.emergencyHeart,()=>notice('ROOK’S EMERGENCY SNACK RESTORED +1 HEART')); 
    }state.screenShake=5.2;floatText(p.x,p.y-28,`−${damage} HP`,'#ffc2af');addSparks(p.x,p.y,13,'#ff9b7c');ding('hurt');refreshUI();save();if(p.hp<=0){state.mode='death';el('death').classList.remove('hidden');el('interaction-prompt').textContent=''}}
  function respawn(){
    // A fresh attempt restocks healing chests in the current chapter, but retains solved puzzles.
    replenishChapterChests();
    state.player.hp=6;state.player.invuln=1.5;state.coldDamageTimer=0;
    state.warmth=100;state.rookShieldCooldown=0;state.pipPetCooldown=0;
    if(state.room===11){state.regentAnchors=[false,false];state.regentReformed=false}
    if(state.room===14){state.finalWards=[false,false];state.finalReformed=false;state.pipMiracle=false}
    el('death').classList.add('hidden');roomLoad(state.room);state.mode='play';
    save();notice('HEALING CHESTS RESTOCKED — YOU CAN DO THIS');canvas.focus({preventScroll:true});
  }
  function spawnBolts(){const b=state.boss,p=state.player;if(!b||!b.alive)return;const a=b.lockedAngle;const count=b.kind==='sovereign'?(b.hp<=12?10:7):b.kind==='mirror'?(b.hp<=13?9:6):b.kind==='frost'?(b.hp<=11?7:5):b.kind==='rift'?(b.hp<=9?7:5):(b.hp<=6?5:3);const spread=b.kind==='sovereign'?.15:b.kind==='mirror'?.18:b.kind==='frost'?.16:b.kind==='rift'?.19:(b.hp<=6?.22:.25);for(let i=0;i<count;i++){const angle=a+(i-(count-1)/2)*spread;state.projectiles.push({x:b.x,y:b.y,vx:Math.cos(angle)*145,vy:Math.sin(angle)*145,ttl:3.6,r:8,kind:b.kind})}addSparks(b.x,b.y,12,'#ffbd90');ding('boss')}
  function update(dt){if(state.mode==='paused')return;state.frame++;state.viewTime+=dt;if(state.room===2&&state.bridgeCollapsed)state.bridgeFallTime=Math.min(3,state.bridgeFallTime+dt);state.screenShake=Math.max(0,state.screenShake-dt*17);const p=state.player;
    for(const f of state.floatingText){f.y-=dt*28;f.life-=dt}state.floatingText=state.floatingText.filter(f=>f.life>0);if(state.noticeTimer>0){state.noticeTimer-=dt;if(state.noticeTimer<=0)el('objective-flash').classList.remove('show')}
    for(const pt of state.particles){pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;pt.vx*=.96;pt.vy*=.96;pt.life-=dt}state.particles=state.particles.filter(q=>q.life>0);
    if(state.mode!=='play')return;
    if(state.room===2&&state.bossDefeated&&!state.bridgeCollapsed&&dist(p.x,p.y,px(22),px(7))<88){triggerBridgeFall();return}
    p.invuln=Math.max(0,p.invuln-dt);p.swing=Math.max(0,p.swing-dt);p.dash=Math.max(0,p.dash-dt);
    state.pipPetCooldown=Math.max(0,state.pipPetCooldown-dt);state.rookShieldCooldown=Math.max(0,state.rookShieldCooldown-dt);
    state.windPulse+=dt;
    if(state.room===12){
      state.pipSenseCooldown=Math.max(0,state.pipSenseCooldown-dt);
      state.pipSenseTime=Math.max(0,state.pipSenseTime-dt);
      if(state.hasTorch){
        const tx=Math.floor(state.rook.x/TILE),ty=Math.floor(state.rook.y/TILE),key=`${tx},${ty}`;
        const last=state.mazeMarks.length?state.mazeMarks[state.mazeMarks.length-1].split(',').map(Number):null;
        if(!last||Math.abs(tx-last[0])+Math.abs(ty-last[1])>=2){
          state.mazeMarks.push(key);if(state.mazeMarks.length>140)state.mazeMarks.shift();
          if(state.mazeMarks.length===2)notice('ROOK IS LEAVING BRIGHT CHALK ARROWS BEHIND YOU');
        }
      }
    }
    if(state.room>=3){
      if(!(state.room===3&&state.rookSwitch)&&!(state.room===7&&!state.rookRescued)&&!(state.room===10&&!state.rookFound)&&!(state.room===11&&state.regentAnchors[0])&&!(state.room===13&&state.engineRelays[0])&&!(state.room===14&&state.finalWards[0]))followCompanion(state.rook,p.x-31,p.y+42,dt,state.room===12?145:83);
      if(!(state.room===4&&state.pipPlate)&&!(state.room===10&&!state.pipFound)&&!(state.room===11&&state.regentAnchors[1])&&!(state.room===13&&state.engineRelays[1])&&!(state.room===14&&state.finalWards[1]))followCompanion(state.pip,(state.room===7&&!state.rookRescued||state.room===11&&state.regentAnchors[0]||state.room===13&&state.engineRelays[0]||state.room===14&&state.finalWards[0])?p.x-18:state.rook.x-34,(state.room===7&&!state.rookRescued||state.room===11&&state.regentAnchors[0]||state.room===13&&state.engineRelays[0]||state.room===14&&state.finalWards[0])?p.y+26:state.rook.y+23,dt,state.room===12?151:88);
      if(state.room>=6&&state.room<=8){
        const warmSpots=state.room===6?worldObjects[6].filter(o=>o.type==='fire'&&state.ch3Fires[o.id]):state.room===7?worldObjects[7].filter(o=>o.type==='shelter'):worldObjects[8].filter(o=>o.type==='heart'&&state.ch3Hearts[o.id]);
        const isWarm=warmSpots.some(o=>dist(p.x,p.y,px(o.x),px(o.y))<88)||(state.room===7&&state.rookRescued&&dist(p.x,p.y,state.rook.x,state.rook.y)<76);
        const storm=state.room===7?1.45:state.room===8?.78:1;
        state.warmth=clamp(state.warmth+(isWarm?dt*35:-dt*3.7*storm),0,100);
        if(state.warmth<=0){state.coldDamageTimer+=dt;if(state.coldDamageTimer>=2.9){state.coldDamageTimer=0;hurt(1);notice('FREEZING! FIND SHELTER OR A WARMING FLAME')}}else state.coldDamageTimer=0;
        el('warmth-fill').style.width=`${state.warmth}%`;el('warmth-value').textContent=`${Math.round(state.warmth)}%`;el('warmth-hud').classList.toggle('danger',state.warmth<25);
      }
    }
    let dx=Number(keys.has('d')||keys.has('ArrowRight'))-Number(keys.has('a')||keys.has('ArrowLeft'));
    let dy=Number(keys.has('s')||keys.has('ArrowDown'))-Number(keys.has('w')||keys.has('ArrowUp'));
    if(p.dashTime>0){p.dashTime=Math.max(0,p.dashTime-dt);moveActor(p,p.dashDX,p.dashDY,dt,500,8);if(Math.random()<.65)addSparks(p.x,p.y,1,'#cfefd1')}
    else if(dx||dy){if(Math.abs(dx)>Math.abs(dy))p.facing=dx>0?'right':'left';else p.facing=dy>0?'down':'up';
      const onIce=state.room===7&&p.x>px(4)&&p.x<px(16)&&p.y>px(5)&&p.y<px(11);
      if(onIce){state.slipVX=state.slipVX*.945+(dx/(Math.hypot(dx,dy)||1))*18*dt;state.slipVY=state.slipVY*.945+(dy/(Math.hypot(dx,dy)||1))*18*dt;const mag=Math.hypot(state.slipVX,state.slipVY);if(mag>1){state.slipVX/=mag;state.slipVY/=mag}moveActor(p,state.slipVX,state.slipVY,dt,139,8)}else{state.slipVX=dx;state.slipVY=dy;moveActor(p,dx,dy,dt,115,8)}}
    else if(state.room===7&&(Math.abs(state.slipVX)+Math.abs(state.slipVY))>.04&&p.x>px(4)&&p.x<px(16)&&p.y>px(5)&&p.y<px(11)){moveActor(p,state.slipVX,state.slipVY,dt,130,8);state.slipVX*=Math.pow(.12,dt);state.slipVY*=Math.pow(.12,dt)}
    for(const e of state.enemies){if(!e.alive)continue;e.flash=Math.max(0,e.flash-dt);e.contact=Math.max(0,e.contact-dt);const d=dist(e.x,e.y,p.x,p.y);if(d<215&&d>(e.kind==='wisp'?97:20)){moveActor(e,p.x-e.x,p.y-e.y,dt,e.speed,9)}
      if(e.kind==='wisp'||e.kind==='frost'||e.kind==='shade'){e.shot-=dt;if(d<225&&e.shot<=0){const a=Math.atan2(p.y-e.y,p.x-e.x);state.projectiles.push({x:e.x,y:e.y,vx:Math.cos(a)*(e.kind==='frost'?124:e.kind==='shade'?135:108),vy:Math.sin(a)*(e.kind==='frost'?124:e.kind==='shade'?135:108),ttl:2.7,r:6,kind:e.kind});e.shot=2.5+e.id*.28;addSparks(e.x,e.y,4,'#b6ebff')}}
      if(d<24&&e.contact<=0){hurt(1);e.contact=.85}}
    const b=state.boss;if(b&&b.alive){b.invuln=Math.max(0,b.invuln-dt);b.flash=Math.max(0,b.flash-dt);const d=dist(b.x,b.y,p.x,p.y);if(d>78&&b.windup<=0)moveActor(b,p.x-b.x,p.y-b.y,dt,b.kind==='sovereign'?(b.hp<=12?67:50):b.kind==='mirror'?(b.hp<=13?58:44):b.kind==='frost'?(b.hp<=11?46:33):b.kind==='rift'?(b.hp<=9?52:42):(b.hp<=6?39:29),20);if(d<36)hurt(1);if(b.windup>0){b.windup-=dt;if(b.windup<=0){b.windup=0;spawnBolts();b.cooldown=b.kind==='sovereign'?(b.hp<=12?.82:1.18):b.kind==='frost'?(b.hp<=11?.95:1.4):b.kind==='rift'?(b.hp<=9?1.0:1.3):(b.hp<=6?1.05:1.55);b.attacks++}}else{b.cooldown-=dt;if(b.cooldown<=0){b.windup=.79;b.lockedAngle=Math.atan2(p.y-b.y,p.x-b.x);ding('boss')}}}
    if(state.room===5&&state.boss&&state.boss.alive){
      // Visible storm wells pulse every four seconds. Dash or move out of their centers.
      const phase=state.windPulse%4;if(phase>2.45&&phase<3.05){
        for(const [tx,ty] of [[9,7],[19,7]])if(dist(p.x,p.y,px(tx),px(ty))<37){hurt(1);break}
      }
    }
    if(state.room===8&&state.boss&&state.boss.alive){
      const phase=state.windPulse%5.1;if(phase>3.45&&phase<4.0){for(const [tx,ty] of [[10,7],[20,7],[13,3]])if(dist(p.x,p.y,px(tx),px(ty))<34){hurt(1);break}}
    }
    if(state.room===9){const phase=state.windPulse%4.2;if(phase>3.0&&phase<3.65){for(const [tx,ty] of [[12,7],[19,7]])if(dist(p.x,p.y,px(tx),px(ty))<33){hurt(1);break}}}
    if(state.room===10){const phase=state.windPulse%4.8;if(phase>3.4&&phase<4.05){for(const [tx,ty] of [[10,8],[19,8]])if(dist(p.x,p.y,px(tx),px(ty))<36){hurt(1);break}}}
    if(state.room===11&&state.boss&&state.boss.alive){const phase=state.windPulse%4.6;if(phase>3.1&&phase<3.7){for(const [tx,ty] of [[10,7],[19,7],[14,3]])if(dist(p.x,p.y,px(tx),px(ty))<35){hurt(1);break}}}
    for(const q of state.projectiles){q.ttl-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(isWall(q.x,q.y))q.ttl=0;if(dist(q.x,q.y,p.x,p.y)<18){hurt(1);q.ttl=0}}state.projectiles=state.projectiles.filter(q=>q.ttl>0);
    const o=interactionTarget();const control=matchMedia('(hover:none) and (pointer:coarse)').matches?'USE':'E';el('interaction-prompt').textContent=o?`[ ${control} ] ${o.type==='tablet'?'READ GLOWING CLUE':o.display}`:'';
    el('dash-label').textContent=p.dash>0?`${p.dash.toFixed(1)}s`:'READY';
  }
  function refreshUI(){const p=state.player;el('hearts').textContent='♥ '.repeat(p.hp)+'♡ '.repeat(p.maxHp-p.hp);el('location').textContent=ROOM_NAMES[state.room];el('seals').textContent=`${state.room<3?(state.bossDefeated?1:0):state.room<6?(state.ch2BossDefeated?2:state.bossDefeated?1:0):(state.ch3BossDefeated?3:state.ch2BossDefeated?2:state.bossDefeated?1:0)} / 3`;el('relic-label').textContent=state.room>=6&&state.ch3BossDefeated?'Three celestial seals':state.room>=3&&state.ch2BossDefeated?'Two celestial seals':state.bossDefeated?'The first seal is yours':'Not yet recovered';const b=state.boss;el('boss-hud').classList.toggle('hidden',!([2,5,8,11,14].includes(state.room)&&b&&b.alive));if(b){el('boss-fill').style.width=`${b.hp/b.maxHp*100}%`;document.querySelector('.boss-title').textContent=b.kind==='sovereign'?'THE HOLLOW SOVEREIGN':b.kind==='mirror'?'THE MIRROR REGENT':b.kind==='frost'?'THE FROST GUARDIAN':b.kind==='rift'?'THE RIFT SENTINEL':'THE STONE WARDEN'}
    let quest='',description='',tasks=[],progress=0,note='';
    if(state.room===0){const n=state.braziers.filter(Boolean).length;quest='Wake the Moss Gate';description='Find and ignite two ancient braziers to open the sealed eastern passage.';progress=(n/2)*30;tasks=[[`Light both braziers (${n}/2)`,n===2],['Reach the eastern gate',false]];note='Stone walls hide shortcuts. If you see a glowing brazier, get close and press E.'}
    if(state.room===1){quest='The Three Celestial Runes';description='Find the order hidden in the tablet and activate the runes without making a mistake.';progress=35+(state.runesSolved?30:state.runesIndex*9);tasks=[['Read the carved tablet',state.readTablet],[`Align the runes (${state.runesSolved?3:state.runesIndex}/3)`,state.runesSolved],['Enter the inner sanctum',false]];note='The carved inscription contains the rune order. A wrong rune resets the sequence.'}
    if(state.room===2){quest=state.bossDefeated?'Cross the Broken Bridge':'Defeat the Stone Warden';description=state.bossDefeated?'The first seal is safe. Find a way across the fractured exit.':'Dodge the guardian’s glowing attacks, then approach with your blade.';progress=state.bossDefeated?95:70;tasks=[['Defeat the Stone Warden',state.bossDefeated],['Recover the first seal',state.bossDefeated],['Explore the far exit',false]];note=state.bossDefeated?'Even a ruined bridge might hold a surprise. Head east.':'Face the Warden when you swing. Shift gives you a quick burst of movement and brief invulnerability.'}
    if(state.room===3){quest='A Bridge Needs a Hero';description='Ask Rook to hold the sky-switch so the party can cross the first floating span.';progress=state.rookSwitch?38:15;tasks=[['Ask Rook to hold the switch',state.rookSwitch],['Find the path to the next island',false],['Recover Rook’s emergency snack (optional)',state.foundSandwich]];note='Stand near the ancient switch and press E. Rook must be nearby to help.'}
    if(state.room===4){quest='The Sleepiest Solution';description='Find a way across the broken skybridge. Pip may be more useful than she looks.';progress=state.pipPlate?70:47;tasks=[['Find the pressure plate',state.pipPlate],['Let Pip hold the bridge open',state.pipPlate],['Reach Stormglass Aerie',false]];note='The luminous gap cannot be crossed until its pressure plate is activated. Give Pip some affection.'}
    if(state.room===5){quest=state.ch2BossDefeated?'Claim the Second Seal':'Calm the Fractured Sky';description=state.ch2BossDefeated?'The second seal is free. Claim it through the eastern gate.':'Defeat the Rift Sentinel. Watch the storm wells and use Rook’s occasional shield.';progress=state.ch2BossDefeated?95:78;tasks=[['Defeat the Rift Sentinel',state.ch2BossDefeated],['Claim the second celestial seal',state.ch2Complete]];note='Dodge the blue bolts. Rook blocks a hit every 10 seconds when he is close. Pip can heal you when petted.'}
    if(state.room===6){const n=state.ch3Fires.filter(Boolean).length;quest='Kindle the Mountain Beacons';description='Two warming flames must pierce the freezing wind before the pass opens.';progress=10+n*23;tasks=[[`Light the warming beacons (${n}/2)`,n===2],['Find the frozen pass',false]];note='The cold meter drains slowly in the open. Stay near lit beacons to warm up.'}
    if(state.room===7){quest='Rescue in the Whiteout';description='Locate Rook beneath the snow, then let Pip awaken the crystal barrier.';progress=56+(state.rookRescued?14:0)+(state.crystalAwake?15:0);tasks=[['Free Rook from the snow',state.rookRescued],['Ask Pip to awaken the ice crystal',state.crystalAwake],['Reach the Winter Heart',false]];note='Ice makes movement slippery. The glowing cairns offer warmth; Rook helps protect you after his rescue.'}
    if(state.room===8){quest=state.ch3BossDefeated?'Recover the Third Seal':'Melt the Winter Guardian’s Armor';description=state.ch3BossDefeated?'The last celestial seal is free. Reach the eastern gate.':'Awaken both heart-flames before battling the ancient guardian.';progress=80+(state.ch3Hearts.filter(Boolean).length*6)+(state.ch3BossDefeated?7:0);tasks=[['Awaken the two heart-flames',state.ch3Hearts.every(Boolean)],['Defeat the Frost Guardian',state.ch3BossDefeated],['Claim the third celestial seal',state.ch3Complete]];note='The guardian is invulnerable while its ice armor is intact. Dodge falling ice; return to the flames for warmth.'}
    if(state.room===9){quest='Remember the Turning Galleries';description='Collect the upper echo in the first face and the lower echo in the second, then turn to the third.';progress=10+state.mazeEchoes.filter(Boolean).length*20+(state.mazePhase===2?12:0);tasks=[['Collect the upper echo in face 1',state.mazeEchoes[0]],['Collect the lower echo in face 2',state.mazeEchoes[1]],['Align the third face and leave',false]];note='Use a turning wheel (E) to shift the corridors. The echo crystals only awaken in their matching phases.'}
    if(state.room===10){quest='Find Your Way Back Together';description='Recover Rook and Pip. Listen to three mirror voices, identify the single liar, and align the truthful reflections.';progress=52+(state.rookFound?9:0)+(state.pipFound?9:0)+state.mirrorSteps*8;tasks=[['Find Rook',state.rookFound],['Find Pip',state.pipFound],['Hear all three mirrors',state.mirrorSeen.every(Boolean)],['Align the true mirrors',state.mirrorSteps===2]];note='Three statements, exactly one lie. Compare what the mirrors say about each other; the inscription gives the order.'}
    if(state.room===11){quest=state.ch4BossDefeated?'Recover the Horizon Key':'Break the Mirror Regent’s Shield';description=state.ch4BossDefeated?'The last passage is open. Claim the key through the eastern gate.':'Ask Rook to anchor one sigil and Pip to awaken the other. The shield reforms halfway through the battle.';progress=84+(state.regentAnchors.filter(Boolean).length*4)+(state.ch4BossDefeated?8:0);tasks=[['Activate both companion devices',state.regentAnchors.every(Boolean)],['Defeat the Mirror Regent',state.ch4BossDefeated],['Claim the Horizon Key',state.ch4Complete]];note='The Regent reflects sword attacks while shielded. After half its HP is gone, reactivate Rook and Pip’s devices.'}
    if(state.room===12){quest='Find the Way Through the Gloam';description='Take the torch near the entrance. Rook marks explored corridors; Pip senses hidden waystones (Q).';progress=10+(state.hasTorch?15:0)+state.waystones.filter(Boolean).length*18;tasks=[['Take the torch',state.hasTorch],[`Awaken the waystones (${state.waystones.filter(Boolean).length}/3)`,state.waystones.every(Boolean)],['Find the eastern observatory',false]];note='Rook’s chalk marks show explored tiles. Braziers become permanent light sources. Press Q to ask Pip for the direction of the next waystone.'}
    if(state.room===13){quest='The Alchemist’s Observatory';description='Test the solutions, dissolve mineral deposits, neutralize the chamber, then restore the lens with Rook and Pip.';progress=41+(state.labAnalyzed?8:0)+state.labPhase*8+(state.engineStar?6:0)+state.engineRelays.filter(Boolean).length*9;tasks=[['Test pH with the indicator',state.labAnalyzed],['Dissolve the carbonate crust',state.labPhase>=1],['Neutralize and restore the lens',state.engineStar],['Connect Rook and Pip’s relays',state.engineRelays.every(Boolean)]];note='Chemistry matters: carbonate deposits react with a mild acid; test the solution first, then rinse and restore neutral conditions before powering the lens.'}
    if(state.room===14){quest=state.ch5BossDefeated?'Follow the Last Light':'Defeat the Hollow Sovereign';description=state.ch5BossDefeated?'The battle is won. Approach the eastern gate to conclude the adventure.':'Activate Rook’s ward and Pip’s star to expose the Sovereign. Its shield reforms at half health.';progress=76+state.finalWards.filter(Boolean).length*5+(state.ch5BossDefeated?14:0);tasks=[['Break the shadow ward',state.finalWards.every(Boolean)],['Defeat the Hollow Sovereign',state.ch5BossDefeated],['Reach the restored horizon',state.ch5Complete]];note='Dodge the crescents, anchor both wards and hit the guardian when its shield falls. Pip may have one last surprise.'}
    if(state.mode==='end'&&state.room===11){quest='Chapter Four Complete!';description='The Horizon Key is yours. The final fortress can now be reached.';progress=100;tasks=[['Collect both maze echoes',true],['Reunite with Rook and Pip',true],['Defeat the Mirror Regent',true]];note='The Last Horizon awaits in Chapter V.'}
    if(state.mode==='end'&&state.room===8){quest='Chapter Three Complete!';description='All three seals shine together, yet the world still trembles. The true source lies deeper.';progress=100;tasks=[['Survive the Frostbound Peaks',true],['Rescue Rook and awaken the ice crystal',true],['Recover the third seal',true]];note='Chapter IV — The Endless Labyrinth — awaits.'}
    if(state.mode==='end'&&state.room===5){quest='Chapter Two Complete!';description='A second celestial seal is restored, and three adventurers are still somehow alive.';progress=100;tasks=[['Cross the shattered skyways',true],['Defeat the Rift Sentinel',true],['Recover the second seal',true]];note='The Frostbound Peaks await in Chapter III.'}
    if(state.mode==='end'&&state.room===2){quest='Chapter One Complete!';description='The first celestial seal has been restored. Two unlikely allies have joined the adventure.';progress=100;tasks=[['Defeat the Stone Warden',true],['Recover the first seal',true],['Find a way across the bridge',true]];note='The next chapter will begin with three travelers instead of one.'}
    updateClueJournal();refreshFragments();
    el('quest-title').textContent=quest;el('quest-description').textContent=description;el('quest-progress').style.width=`${progress}%`;el('quest-progress-label').textContent=`${Math.floor(progress)}%`;el('field-note').textContent=note;el('objectives').innerHTML=tasks.map(([s,done])=>`<div class="objective ${done?'complete':''}"><span class="check">${done?'☑':'◇'}</span><span>${s}</span></div>`).join('')}
  function updateClueJournal(){
    const card=el('clue-card'),title=el('clue-title'),body=el('clue-text'),progress=el('clue-count');
    const note=state.selectedNote!==null?state.selectedNote:state.latestNote;
    const has=note!==null&&state.notesRead.includes(note);
    card.classList.toggle('unfound',!has);
    title.textContent=has?STORY.noteTitles[note]:'UNDISCOVERED INSCRIPTION';
    body.textContent=has?STORY.notes[note][0].text:'Look for a softly glowing parchment resting on an ancient stand. Approach it and press E to read.';
    document.querySelectorAll('[data-note]').forEach(button=>{const n=Number(button.dataset.note),known=state.notesRead.includes(n);button.disabled=!known;button.textContent=known?({0:'MOSS',1:'RUNES',3:'ROOK',4:'SKY',6:'FROST',7:'WIND',8:'HEART',9:'MAZE',10:'GLASS',11:'REGENT',12:'GATE',13:'ENGINE',14:'HORIZON'})[n]:'???';button.setAttribute('aria-pressed',String(known&&n===note))});
    progress.textContent=`${state.notesRead.length} / 13 FOUND`;
  }
  // ---------- Drawing: original procedural pixel artwork, no external assets ----------
  function rect(x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
  function glow(x,y,r,color,alpha=1){c.save();c.globalAlpha=alpha;const g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore()}
  function line(x,y,xx,yy,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()}
  function drawFloor(x,y,room){const p=palettes[room],h=hash(x,y,room);const a=x*TILE,b=y*TILE;rect(a,b,TILE,TILE,h%4===0?p.floor2:p.floor);rect(a,b,TILE,1,'#aab9ab1c');rect(a,b,1,TILE,'#1c262525');if(h%4===0){rect(a+6+(h%17),b+12,9,2,'#2b3d3b44');rect(a+13,b+21,4,2,p.edge+'77')}if(h%8===0){rect(a+6,b+9,3,3,p.moss+'99');rect(a+11,b+14,2,5,p.moss+'88');rect(a+17,b+11,5,3,p.moss+'88')}if(h%9===0&&room===0){rect(a+9,b+9,3,5,'#8db768');rect(a+12,b+8,2,3,'#c3d78c');rect(a+17,b+12,2,4,'#4b8b66')}if(room>=9&&room<=11){if(h%5===0){rect(a+6,b+8,18,1,'#dabffb44');rect(a+13,b+9,2,13,'#30244877')}if(h%11===0)glow(a+16,b+16,28,'#b7a1fa',.08)}if(h%15===0&&(room===2||room===5||room===8)){rect(a+12,b+7,2,13,'#b5b3d159');rect(a+6,b+21,12,1,'#b5b3d138')}}
  function drawWall(x,y,room){const p=palettes[room],h=hash(x,y,room);const a=x*TILE,b=y*TILE;rect(a,b,32,32,p.walls);rect(a,b,32,8,p.walltop);rect(a,b,2,32,'#121e25');rect(a,b+28,32,4,p.shadow);rect(a+2,b+9,27,1,p.edge+'77');rect(a+15,b+9,2,17,p.shadow+'aa');if(h%3===0){rect(a+7,b+2,13,2,p.edge+'77');rect(a+4,b+18,5,3,p.shadow)}if(h%5===0&&room===0){rect(a+11,b+6,4,7,'#557f5e');rect(a+13,b+12,3,7,'#8fac70')}if(h%4===0&&room===2){rect(a+6,b+19,3,3,'#a7a2c263')}if(room>=9&&room<=11){rect(a+4,b+12,21,2,'#b6a1d356');if(h%3===0){rect(a+9,b+20,6,2,'#cdacfc66');rect(a+12,b+26,3,2,'#816caa')}}if(room>=6&&room<=8){rect(a+4,b+8,17,2,'#ecfbff40');rect(a+7,b+17,10,2,'#e6f9ff55');if(h%3===0)rect(a+5,b+24,12,3,'#ddf5ff7a')}}
  function drawGround(){const room=state.room;rect(0,0,WIDTH,HEIGHT,palettes[room].floor);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      if(room===3&&(x===0||x===W-1||y===0||y===H-1||((x===10||x===11)&&(y===8||y===9))||((x===16||x===17)&&(y===6||y===7)))){drawSkyGap(x,y,false);continue}
      if(room===4&&x===7&&y>=1&&y<=13){drawSkyGap(x,y,state.pipPlate&&(y===6||y===7));continue}
      state.roomArr.has(`${x},${y}`)?drawWall(x,y,room):drawFloor(x,y,room);
    }for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(state.roomArr.has(`${x},${y}`))continue;const h=hash(x,y,room);if(h%35===0)drawFlower(px(x),px(y),h%3===0?'#d9e797':'#9ebbbd');if(h%37===0&&room!==2)drawCrack(px(x),px(y));}
    if(room===0){drawWater(10,12);drawWater(11,12);drawWater(10,13);drawWater(11,13);glow(100,80,120,'#e3efb03c',.7)}
    if(room===1){for(let i=0;i<5;i++){const x=px(i*4+2);glow(x,50,50,'#c1d2ff28',.4)}}
    if(room===2){glow(px(13),px(7),230,'#a28cdf3c',.4);for(let i=0;i<5;i++){const t=state.viewTime*.4+i*1.2;const x=px(12)+Math.cos(t)*140,y=px(7)+Math.sin(t)*110;glow(x,y,35,'#ad9bee3d',.4)}}
    if(room>=6&&room<=8){for(let i=0;i<7;i++){const x=px(i*3+2),y=35+((i*113)%378);glow(x,y,50,'#d7f8ff',.10)}if(room===7){
       for(let y=5;y<=11;y++)for(let x=4;x<=16;x++){if(state.roomArr.has(`${x},${y}`))continue;const a=x*TILE,b=y*TILE;rect(a+3,b+4,26,25,'#acdfee6a');line(a+4,b+25,a+25,b+8,'#e2ffff80',2)}
       for(let y=1;y<=13;y++)if(!(state.crystalAwake&&(y===7||y===8)))drawIceBarrier(px(17),px(y));
     }if(room===8&&state.boss&&state.boss.alive){const danger=state.windPulse%5.1>3.45;for(const [tx,ty] of [[10,7],[20,7],[13,3]]){const x=px(tx),y=px(ty);glow(x,y,danger?58:34,danger?'#baf4ff':'#d7ecff',danger?.42:.10);c.save();c.strokeStyle=danger?'#eefdff':'#b2d5f5aa';c.lineWidth=danger?4:2;c.setLineDash(danger?[5,5]:[]);c.beginPath();c.arc(x,y,26,0,Math.PI*2);c.stroke();c.setLineDash([]);line(x-15,y,x+15,y,danger?'#f4ffffaa':'#c5dcf155',2);line(x,y-15,x,y+15,danger?'#f4ffffaa':'#c5dcf155',2);c.restore()}}}
    if(room>=9&&room<=11){
      // Labyrinth rooms glow with etched runnels; trap telegraphs only appear when the guardian is active.
      for(let i=0;i<11;i++){const x=px(2+i*2),y=px(2+(i*3)%11);glow(x,y,36,'#d3abff',.11)}
      if(state.boss&&state.boss.alive){const locations=room===9?[[12,7],[19,7]]:room===10?[[10,8],[19,8]]:[[10,7],[19,7],[14,3]];
      const tick=room===9?4.2:room===10?4.8:4.6;
      const phase=state.windPulse%tick,danger=phase>(room===9?3:room===10?3.4:3.1);
      for(const [tx,ty] of locations){const x=px(tx),y=px(ty);glow(x,y,danger?54:30,danger?'#f29bdf':'#b2a8ff',danger?.34:.08);c.save();c.strokeStyle=danger?'#ffd6f7b4':'#b5acf070';c.lineWidth=danger?3:2;c.setLineDash(danger?[4,5]:[]);c.beginPath();c.arc(x,y,25,0,Math.PI*2);c.stroke();c.setLineDash([]);line(x-14,y,x+14,y,danger?'#ffe2fb92':'#c5bdf04f',2);line(x,y-14,x,y+14,danger?'#ffe2fb92':'#c5bdf04f',2);c.restore()}}
      if(room===9){for(const tx of [9,17])for(let y=1;y<=13;y++)if(state.roomArr.has(`${tx},${y}`)){const x=px(tx),yy=px(y);glow(x,yy,27,'#be9ef2',.19);rect(x-14,yy-1,28,2,'#bcaff18a')}}
      if(room===10){for(let i=0;i<5;i++){const x=px(4+i*4),y=px(5+(i%3)*3);glow(x,y,59,'#e6bdff',.13)}}
      if(room===11&&state.boss&&state.boss.alive){const x=px(15),y=px(7);glow(x,y,155,'#bba1e8',.14);c.save();c.strokeStyle='#d4aceb58';c.lineWidth=2;for(let r of [92,142,190]){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke()}c.restore()}
    }
    if(room>=12){
      glow(px(15),px(7),310,room===14?'#ad8beb':'#8acaff',.18);
      for(let i=0;i<24;i++){
        const x=(hash(i,room,17)%WIDTH+Math.sin(state.viewTime*.18+i)*11+WIDTH)%WIDTH;
        const y=(hash(i,room,27)%HEIGHT-state.viewTime*(i%3+2)+HEIGHT*8)%HEIGHT;
        glow(x,y,14,'#ebedff',.12);rect(x,y,2+(i%3===0),2+(i%3===0),'#f6eece9a');
      }
      if(room===14){const t=state.viewTime;for(let i=0;i<9;i++){const a=t*.23+i*Math.PI*2/9;const x=px(15)+Math.cos(a)*145,y=px(7)+Math.sin(a)*115;glow(x,y,28,'#e4c6ff',.24)}}
    }
    if(room>=3&&room<6){for(let i=0;i<6;i++){const x=px(2+i*4);glow(x,34,53,'#c8f4fa',.18)}
      for(let i=0;i<5;i++){const x=px(i*5+2),y=px(i%2?12:2);drawCloud(x,y,.4+Math.sin(state.viewTime+i)*.11)}
      if(room===5&&state.boss&&state.boss.alive){for(const [tx,ty] of [[9,7],[19,7]]){const x=px(tx),y=px(ty),danger=(state.windPulse%4)>2.45;glow(x,y,danger?56:35,danger?'#ffb6b1':'#bfd5fb',danger?.42:.12);c.save();c.strokeStyle=danger?'#ffd0bb':'#b6d0fb';c.lineWidth=danger?4:2;c.setLineDash(danger?[5,4]:[]);c.beginPath();c.arc(x,y,27+Math.sin(state.viewTime*4)*2,0,Math.PI*2);c.stroke();c.setLineDash([]);line(x-14,y,x+14,y,danger?'#fff1d1aa':'#dce8ff55',2);line(x,y-14,x,y+14,danger?'#fff1d1aa':'#dce8ff55',2);c.restore()}}}
  }
  function drawSceneAtmosphere(){
    const room=state.room,t=state.viewTime,slow=reducedMotion?0:t;
    if(room===0){
      // Moss Gate: hanging vines, bioluminescent spores and slanted shafts of light.
      for(const [tx,ty] of [[3,2],[8,11],[15,2],[20,10]]){
        const x=px(tx),y=px(ty);for(let j=0;j<3;j++){
          const shift=reducedMotion?0:Math.sin(slow*.8+j+tx)*2;
          line(x-13+j*5,y-22,x-10+j*5+shift,y+10,'#8ab78975',2);
          rect(x-10+j*5+shift,y+9,4,3,'#9cc99488');
        }
      }
      for(let i=0;i<18;i++){
        const x=42+hash(i,12,0)%675,y=35+(hash(5,i,0)%400+Math.sin(slow*.7+i)*8+400)%400;
        glow(x,y,9,'#dcf3a0',.12+.08*Math.sin(slow+i));rect(x,y,2,2,'#e9edb988');
      }
    }
    if(room===1){
      // Hall of Echoes: ghostly star-lines suggest ancient rune magic, not rune order.
      for(let i=0;i<13;i++){
        const x=50+hash(i,17,1)%650,y=40+hash(3,i,1)%395;
        glow(x,y,9,'#a9c6ff',.16);rect(x,y,2,2,'#d3d8e6aa');
        if(i%3===0)line(x,y,x+11,y-8,'#b6c2f244',1);
      }
    }
    if(room===2){
      // Inner Sanctum: dormant celestial floor geometry and drifting stardust.
      const x=px(13),y=px(7);
      c.save();c.strokeStyle='#cabcf63d';c.lineWidth=1;
      for(const r of [108,163]){c.beginPath();c.arc(x,y,r,Math.PI*.1,Math.PI*1.9);c.stroke()}
      for(let i=0;i<10;i++){const a=i*Math.PI/5+slow*.06;rect(x+Math.cos(a)*116,y+Math.sin(a)*92,3,3,'#c6b1e899')}
      c.restore();
    }
    if(room>=3&&room<6){
      // Wind streaks and cloud shadows: common language across the floating-island areas.
      for(let i=0;i<15;i++){
        const a=(hash(i,31,room)%800+slow*(8+i%4*6))%850-40;
        const b=35+hash(31,i,room)%400;
        line(a,b,a+14+i%3*7,b-4,'#d3f5fa2e',i%4===0?2:1);
      }
      for(let i=0;i<4;i++){
        const x=((hash(i,22,room)%850+slow*(3+i))%880)-35,y=px(2+i*3);
        glow(x,y,72,room===5?'#bfb4fc':'#b6f4ee',.075);
      }
      if(room===4){
        for(let i=0;i<9;i++){
          const x=px(7)+Math.sin(slow*.8+i*2)*10,y=30+i*51;
          glow(x,y,20,state.pipPlate?'#befff0':'#9cc4f9',state.pipPlate?.12:.06);
        }
      }
      if(room===5){
        for(let i=0;i<13;i++){
          const x=30+hash(i,41,5)%710,y=25+hash(41,i,5)%430;
          rect(x,y,2,2,'#d7d0ff99');
          if(!reducedMotion&&i%4===0)glow(x,y,17,'#c9bbff',.2+Math.sin(t*2+i)*.06);
        }
      }
    }
    if(room>=6&&room<=8){
      // Layered mountain weather, distant aurora and drifting crystalline snow.
      for(let i=0;i<25;i++){const x=(hash(i,41,room)%815+slow*(room===7?43:19)+850)%815-23;const y=(hash(11,i,room)%530+slow*(room===7?14:9))%530-22;line(x,y,x+6+(i%4)*4,y+5,'#eaffff7a',i%5===0?2:1);if(i%6===0)glow(x,y,11,'#c9fcff',.13)}
      if(room===7){for(let i=0;i<5;i++){let x=(hash(i,24,room)%850+slow*22)%850-40;glow(x,hash(34,i,room)%480,106,'#ecfbff',.085)} c.fillStyle='rgba(217,241,255,'+(.05+(reducedMotion?0:.045*Math.sin(slow*1.8)))+')';c.fillRect(0,0,WIDTH,HEIGHT)}
      if(room===8){for(let i=0;i<13;i++){const x=hash(i,32,room)%WIDTH,y=hash(2,i,room)%HEIGHT;glow(x,y,15,'#bdeeff',.15)}}
    }
    // Labyrinth atmospheric motes, reflected floor glimmers and fluttering purple lantern light.
    if(room>=9){
      for(let i=0;i<23;i++){const x=(hash(i,59,room)%WIDTH+slow*(i%3+2)*3)%WIDTH,y=(hash(59,i,room)%HEIGHT+Math.sin(slow*.6+i)*13+HEIGHT)%HEIGHT;glow(x,y,14,i%2?'#d9a9ff':'#a4e9ed',.10);rect(x,y,2,2,'#e3d4ff9e')}
      for(let i=0;i<6;i++){const x=px(3+i*4),y=px(i%2?12:2);glow(x,y,75,room===11?'#ffcaab':'#c5a5ff',.055+(reducedMotion?0:.025*Math.sin(slow+i)))}
      if(room===10){for(let i=0;i<6;i++){const x=px(3+i*3),y=px(2+i%3*5);line(x,y-16,x+Math.sin(slow*.7+i)*7,y+24,'#d8b6f740',2)}}
    }
  }
  function drawFocusHints(){
    if(state.mode!=='play')return;
    const p=state.player;
    for(const o of worldObjects[state.room]){
      if(o.type==='gate'||o.type==='tablet'||o.type==='findrook'||o.type==='findpip')continue;
      const x=px(o.x),y=px(o.y);
      const active=o.type==='chest'?!state.usedPotions.includes(`${state.room}-${o.x}-${o.y}`):
        o.type==='brazier'?!state.braziers[o.id]:o.type==='rune'?!state.runesSolved:
        o.type==='switch'?!state.rookSwitch:o.type==='plate'?!state.pipPlate:o.type==='fire'?!state.ch3Fires[o.id]:o.type==='heart'?!state.ch3Hearts[o.id]:o.type==='rescue'?!state.rookRescued:o.type==='crystal'?!state.crystalAwake:o.type==='shelter'?true:
        o.type==='snack'?!state.foundSandwich:o.type==='echo'?!state.mazeEchoes[o.id]:o.type==='findrook'?!state.rookFound:o.type==='findpip'?!state.pipFound:o.type==='mirror'?state.mirrorSteps!==2:o.type==='turnwheel'?true:o.type==='anchor'?!state.regentAnchors[o.id]:false;
      if(!active)continue;
      const d=dist(p.x,p.y,x,y);
      if(d<110){
        c.save();const pulse=reducedMotion?0:.5+.5*Math.sin(state.viewTime*4);
        c.strokeStyle=`rgba(255,231,160,${d<52?.75:.18+pulse*.27})`;
        c.lineWidth=d<52?3:2;c.beginPath();c.ellipse(x,y+13,23,11,0,0,Math.PI*2);c.stroke();
        if(d<55){c.font='bold 12px monospace';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff2bf';c.shadowColor='#0a1c1b';c.shadowBlur=7;c.fillText('E',x,y-29)}
        c.restore();
      }
    }
  }
  function drawFloatingText(){
    c.save();c.font='bold 13px monospace';c.textAlign='center';c.textBaseline='middle';c.shadowColor='#0b1722';c.shadowBlur=8;
    for(const f of state.floatingText){c.globalAlpha=clamp(f.life/f.max,0,1);c.fillStyle=f.color;c.fillText(f.text,f.x,f.y)}
    c.restore();
  }
  function drawIceBarrier(x,y){glow(x,y,38,'#94e4ff',.18);rect(x-16,y-15,32,31,'#3e79a2');rect(x-12,y-15,21,26,'#73b1d4');rect(x-3,y-13,5,23,'#d7f6ff');rect(x+5,y-5,5,15,'#9dd7e9')}
  function drawSkyGap(x,y,open){const a=x*TILE,b=y*TILE;rect(a,b,TILE,TILE,'#172c44');rect(a+2,b+4,28,3,'#406385');rect(a+10,b+17,12,3,'#344967');if(open){glow(a+16,b+16,45,'#90f9e6',.58);rect(a+1,b+7,30,19,'#63bcb6');rect(a+2,b+10,28,4,'#b6f4dc');rect(a+3,b+24,26,3,'#b1f3e7')}}
  function drawCloud(x,y,s=1){c.save();c.globalAlpha=.27+s*.15;rect(x-19,y-5,36,6,'#d0edec');rect(x-11,y-11,24,7,'#e2ffff');rect(x+5,y+1,22,5,'#c4e4f8');c.restore()}
  function drawCrack(x,y){line(x-6,y-2,x-1,y+2,'#37484a',1);line(x-1,y+2,x+3,y+1,'#37484a');line(x+3,y+1,x+6,y+6,'#37484a')}
  function drawFlower(x,y,color){rect(x-1,y-1,3,3,color);rect(x+1,y-4,1,2,'#eef0ba');rect(x,y+2,1,3,'#668856')}
  function drawWater(x,y){const a=x*TILE,b=y*TILE;rect(a+2,b+2,27,27,'#457b87');rect(a+4,b+5,22,7,'#5fa6ad');rect(a+7,b+17,12,2,'#9bd5be');rect(a+15,b+21,9,2,'#75bbc0')}
  function drawBrazier(o){const x=px(o.x),y=px(o.y),on=state.braziers[o.id];if(!on)glow(x,y-10,40,'#ffe7ac',.14+(reducedMotion?0:.08*Math.sin(state.viewTime*3+o.id)));rect(x-15,y+8,30,6,'#252c2d');rect(x-11,y+3,22,7,'#ac9b77');rect(x-14,y-2,28,7,'#3b3e3f');rect(x-12,y-6,24,7,on?'#e1a35a':'#717d73');if(on){glow(x,y-11,62,'#ffd17e',.48);const t=Math.sin(state.viewTime*9+o.id)*3;rect(x-7,y-20+t,15,15,'#f1a044');rect(x-4,y-26+t,8,18,'#ffe39d');rect(x-1,y-30+t,3,9,'#ffffc2')}else{rect(x-5,y-10,10,4,'#516862')}drawRuneGlyph(x,y+6,'✧','#d9ca9a',10)}
  function drawRuneGlyph(x,y,str,color='#fff2d1',size=18){c.font=`bold ${size}px Georgia, serif`;c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.fillText(str,x,y)}
  function drawRune(o){const x=px(o.x),y=px(o.y),order=o.id,on=state.runesSolved||order<state.runesIndex;rect(x-16,y+7,33,7,'#28313f');rect(x-15,y,30,8,'#8f8c96');rect(x-12,y-13,25,15,'#565c70');rect(x-11,y-15,23,3,'#b0aab7');glow(x,y-10,on?44:24,on?'#f5d8a7':'#aab7ff',on?.47:.2);drawRuneGlyph(x,y-9,['☼','☾','✦'][o.id],on?'#ffe2a0':'#d4cae9',24)}
  function drawTablet(o){
    const x=px(o.x),y=px(o.y),t=state.viewTime;
    const read=state.notesRead.includes(state.room),pulse=reducedMotion?.65:.5+.5*Math.sin(t*2.7+o.x);
    // A warm, pixel-art parchment on a dark lectern, not a grey block blending into the floor.
    glow(x,y-5,read?43:64,'#ffe6a1',read?.24:.31+pulse*.22);
    rect(x-18,y+9,36,9,'#25373b');rect(x-15,y+4,30,8,'#455653');
    rect(x-14,y-16,28,26,'#917852');rect(x-12,y-18,24,25,'#ffecbd');
    rect(x-10,y-16,21,2,'#fff8d9');rect(x-10,y-12,18,2,'#d6aa68');
    rect(x-9,y-7,16,2,'#a57649');rect(x-9,y-3,19,2,'#be8f51');rect(x-9,y+1,12,2,'#a57649');
    rect(x+6,y-18,6,6,'#e1c38c');rect(x+8,y-16,4,4,'#b69158');
    // The glyph and glints move slowly, including when this note has been read.
    const b=reducedMotion?0:Math.sin(t*2.4)*3;
    glow(x,y-29+b,read?18:28,'#fff0b4',read?.35:.65);
    c.save();c.shadowColor='#fff0b8';c.shadowBlur=read?6:12;
    drawRuneGlyph(x,y-33+b,read?'✓':'!',read?'#d5eecb':'#fff4bb',read?13:17);
    c.restore();
    if(!read){rect(x-23,y-6+b,3,3,'#fff0ae');rect(x+21,y-13-b,3,3,'#ffe3a6')}
  }
  function drawChest(o){const x=px(o.x),y=px(o.y),used=state.usedPotions.includes(`${state.room}-${o.x}-${o.y}`);if(!used)glow(x,y,39,'#ffe3a0',.1+(reducedMotion?0:.065*Math.sin(state.viewTime*3)));rect(x-14,y-5,29,20,used?'#424542':'#6c4d30');rect(x-14,y-10,29,9,used?'#777868':'#bb8247');rect(x-16,y-7,3,20,'#d7b76e');rect(x+12,y-7,4,20,'#d7b76e');rect(x-2,y-8,5,17,used?'#8b9280':'#f4d18c');rect(x-12,y-3,25,3,'#342c2c')}
  function drawGate(o){const x=px(o.x),y=px(o.y);const open=state.room===0?state.braziers.every(Boolean):state.room===1?state.runesSolved:state.room===2?state.bridgeCollapsed:state.room===3?state.rookSwitch:state.room===4?state.pipPlate:state.room===5?state.ch2BossDefeated:state.room===6?state.ch3Fires.every(Boolean):state.room===7?state.rookRescued&&state.crystalAwake:state.room===8?state.ch3BossDefeated:state.room===9?state.mazeEchoes.every(Boolean)&&state.mazePhase===2:state.room===10?state.mirrorSteps===2:state.room===11?state.ch4BossDefeated:state.room===12?state.hasTorch&&state.waystones.every(Boolean):state.room===13?state.labPhase===2&&state.engineStar&&state.engineRelays.every(Boolean):state.ch5BossDefeated;glow(x,y,open?76:46,open?'#f3d78d':'#ad7e9f',open?.45:.21);rect(x-20,y-32,40,68,'#243338');rect(x-21,y-31,7,62,'#838984');rect(x+14,y-31,7,62,'#838984');rect(x-21,y-33,42,8,'#9da496');rect(x-15,y-26,30,54,open?'#538e8a':'#342f40');rect(x-11,y-23,22,47,open?'#87d5b5':'#5f5661');if(open){for(let i=0;i<6;i++){const t=state.viewTime*1.4+i;rect(x-9+Math.sin(t)*7,y-17+i*7,3,3,'#ddfff0')}}else{drawRuneGlyph(x,y,'⊗','#cca77e',24)}}
  function drawPillarTop(x,y){rect(x-15,y-13,30,7,'#959990');rect(x-12,y-20,24,7,'#c0b8a7');rect(x-10,y-24,20,4,'#777e7e')}
  function drawCompanionProp(o){const x=px(o.x),y=px(o.y),t=state.viewTime;
    if(o.type==='torch'){if(!state.hasTorch){glow(x,y,61,'#ffcf73',.57);rect(x-3,y-9,6,28,'#b27649');rect(x-7,y-14,14,8,'#ffc576');rect(x-3,y-25+Math.sin(t*7)*3,7,13,'#ffea9a');drawRuneGlyph(x,y-35,'!', '#fff2c2',14)}else{rect(x-7,y+7,14,5,'#7d6647')}}
    if(o.type==='beacon'){const on=state.mazeBeacons[o.id];glow(x,y,on?92:28,on?'#ffd48c':'#8ba5d9',on?.62:.19);rect(x-15,y+8,30,9,'#6c7384');rect(x-9,y-10,18,19,on?'#a5aaba':'#697186');if(on){rect(x-5,y-24+Math.sin(t*6)*2,11,19,'#ffd48a');rect(x-2,y-30+Math.sin(t*6)*2,5,13,'#fff2b1')}else drawRuneGlyph(x,y-9,'✧','#aec9d9',16)}
    if(['indicator','acid','base','lens'].includes(o.type)){
      const on=o.type==='indicator'?state.labAnalyzed:o.type==='acid'?state.labPhase>=1:o.type==='base'?state.labPhase>=2:state.engineStar;
      const hue=o.type==='acid'?'#ee90be':o.type==='base'?'#96c9f4':o.type==='lens'?'#d8c9ff':'#d0e9b4';
      glow(x,y,on?52:40,hue,on?.4:.26);rect(x-18,y+9,36,10,'#3b475b');rect(x-14,y-5,28,14,'#8899ab');
      if(o.type==='lens'){rect(x-9,y-25,18,24,on?'#e4d0ff':'#7385b4');drawRuneGlyph(x,y-12,'◇',on?'#fff3c2':'#c7dbff',23)}
      else{rect(x-8,y-22,16,20,o.type==='acid'?'#e98faf':o.type==='base'?'#8cbfe4':'#96bb9b');rect(x-6,y-26,12,5,'#c5d5dc');drawRuneGlyph(x,y-11,o.type==='indicator'?'◌':o.type==='acid'?'−':'+', '#fff5dc',17)}
    }
    if(['waystone','starwheel','relay','ward'].includes(o.type)){
      const lit=o.type==='waystone'?state.waystones[o.id]:o.type==='starwheel'?state.engineStar:o.type==='relay'?state.engineRelays[o.id]:state.finalWards[o.id];
      const color=o.type==='ward'?'#e3b4ff':o.type==='waystone'?'#e3c880':'#b9edff';
      glow(x,y,lit?74:58,lit?'#ffe8bd':color,lit?.58:.43);
      rect(x-17,y+10,34,8,'#28314d');rect(x-13,y-12,26,23,lit?'#a9c5d0':'#6879a2');rect(x-9,y-22,18,12,'#b8b9dc');
      drawRuneGlyph(x,y-5,o.type==='waystone'?['✦','☼','✧'][o.id]:o.type==='starwheel'?'✶':o.type==='relay'?'◈':'✥',lit?'#fff1c2':'#e5f0ff',22);
      if(lit)for(let i=0;i<4;i++)rect(x+Math.sin(t*1.7+i*2)*28,y-32+i*12,3,3,'#fff1cc');
    }
    if(o.type==='switch'){glow(x,y,43,state.rookSwitch?'#9ff3e2':'#a5bdff',.4);rect(x-18,y+7,36,9,'#28384d');rect(x-13,y-1,26,12,state.rookSwitch?'#60b7ae':'#688395');rect(x-7,y-8,14,9,'#c8c1a9');drawRuneGlyph(x,y+1,'✧','#e2fcef',17)}
    if(o.type==='plate'){glow(x,y,43,state.pipPlate?'#d4b8ff':'#9ed9ff',.33);rect(x-18,y+8,36,8,'#364a69');rect(x-17,y-2,34,12,'#6684ae');rect(x-12,y+1,24,6,state.pipPlate?'#c3a3df':'#a1c3dc');drawRuneGlyph(x,y+3,'✦','#ebf9ff',18)}
    if(o.type==='fire'||o.type==='heart'){const on=o.type==='fire'?state.ch3Fires[o.id]:state.ch3Hearts[o.id];glow(x,y, on?69:39,on?'#ffd49e':'#b1d9ff',on?.5:.23);rect(x-17,y+10,34,8,'#425970');rect(x-12,y-4,24,15,'#9abed0');rect(x-8,y-9,16,10,on?'#ffbc75':'#7ac3e2');if(on){rect(x-4,y-23+Math.sin(t*7)*3,9,20,'#ffc276');rect(x-2,y-28+Math.sin(t*7)*3,5,17,'#fff4b7')}else drawRuneGlyph(x,y-4,'✦','#d4f2ff',17)}
    if(o.type==='crystal'){glow(x,y,60,state.crystalAwake?'#f4d4ff':'#b5e7ff',state.crystalAwake?.6:.35);rect(x-17,y+15,34,8,'#375477');rect(x-10,y-19,20,36,state.crystalAwake?'#d1b9ff':'#7bb8d9');rect(x-5,y-28,10,11,'#d3eeff');rect(x-4,y-10,8,23,'#d9faff');if(state.crystalAwake){for(let i=0;i<5;i++)rect(x+Math.sin(t+i*2)*26,y-31+i*15,3,3,'#e9d8ff')}}
    if(o.type==='shelter'){glow(x,y,59,'#ffe6a4',.28);rect(x-18,y+8,36,9,'#4e6274');rect(x-12,y+1,24,10,'#9ca8b0');rect(x-11,y-7,22,8,'#e1c89c');glow(x,y-9,27,'#ffdeaa',.36);rect(x-3,y-14,6,13,'#fff2ad')}
    if(o.type==='rescue'&&!state.rookRescued){glow(x,y,43,'#d8efff',.28);rect(x-24,y+2,48,18,'#c8eaf5');rect(x-16,y-2,32,10,'#e5f7fc');rect(x-8,y-8,17,7,'#748b56');drawRuneGlyph(x,y-22,'!', '#ffedc4',18)}
    if(o.type==='turnwheel'){const pulse=.27+.1*Math.sin(t*2);glow(x,y,54,'#d6b6ff',pulse);rect(x-17,y+8,34,8,'#272641');rect(x-13,y-10,26,20,'#715d88');rect(x-10,y-16,20,10,'#c9b0e5');drawRuneGlyph(x,y-1,['Ⅰ','Ⅱ','Ⅲ'][state.mazePhase],'#f6d9ff',19);for(let i=0;i<4;i++){const a=i*Math.PI/2+t*.6;rect(x+Math.cos(a)*19-2,y-2+Math.sin(a)*13,5,5,'#dac2f7')}}
    if(o.type==='echo'){const found=state.mazeEchoes[o.id];glow(x,y,found?38:68,found?'#aa91c2':'#a4f8fd',found?.12:.48);rect(x-15,y+10,30,7,'#3b3459');rect(x-11,y-13,22,25,found?'#5b526d':'#8fd2dc');rect(x-7,y-21,14,10,found?'#68627e':'#c4faff');drawRuneGlyph(x,y-2,o.id===0?'⌃':'⌄',found?'#b6a6ce':'#fff1c3',21)}
    if(o.type==='mirror'){const lit=state.mirrorSteps>o.id&&o.id!==2;glow(x,y,53,o.id===2?'#ec96d4':lit?'#f6cf92':'#d8c6ff',o.id===2?.3:lit?.45:.22);rect(x-15,y+11,30,7,'#333047');rect(x-13,y-25,26,37,o.id===2?'#7b4c81':'#78689e');rect(x-9,y-21,18,27,o.id===2?'#ca83ba':lit?'#f4d39c':'#b7d9e6');drawRuneGlyph(x,y-8,['☼','✦','◉'][o.id],o.id===2?'#6b2d65':'#fff3db',20)}
    if(o.type==='findrook'&&!state.rookFound){
      // Only a green hat and small sleeve peek out from behind a fallen slab.
      rect(x-12,y-24,23,7,'#667c52');rect(x-7,y-32,13,10,'#7d9061');rect(x+8,y-10,6,7,'#cca078');
      rect(x-22,y-11,42,28,'#47445d');rect(x-20,y-14,39,8,'#817698');rect(x-20,y+11,38,5,'#302b43');
    }
    if(o.type==='findpip'&&!state.pipFound){
      // A tiny lavender tail protrudes from the far side of a stone column.
      rect(x+13,y-3,14,5,'#d5c0f7');rect(x+23,y-8,6,8,'#a7a1d9');
      rect(x-17,y-30,34,44,'#45415f');rect(x-20,y-34,40,9,'#8883a8');rect(x-20,y+7,40,11,'#2c2948');
    }
    if(o.type==='anchor'){const on=state.regentAnchors[o.id];glow(x,y,on?70:44,on?'#f6d6ff':'#b5acd9',on?.48:.29);rect(x-17,y+9,34,9,'#302f51');rect(x-14,y-3,28,15,on?'#ad9ad3':'#726a91');rect(x-9,y-17,18,16,on?'#e5c7ff':'#9a83ab');drawRuneGlyph(x,y-4,o.id===0?'✥':'◆',on?'#ffffff':'#efe0ff',20);if(on)for(let i=0;i<3;i++)rect(x+Math.sin(t*2+i*2)*20,y-30+i*12,3,3,'#faf0ff')}
    if(o.type==='snack'){rect(x-12,y+2,25,11,'#806342');rect(x-10,y-4,21,8,state.foundSandwich?'#6a6252':'#cfa46a');if(!state.foundSandwich){rect(x-7,y-1,15,2,'#f3e6a3');glow(x,y,27,'#f8de8a',.2)}}
  }
  function drawProps(){const room=state.room;for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(state.roomArr.has(`${x},${y}`)&&!state.roomArr.has(`${x},${y-1}`))drawPillarTop(px(x),y*TILE+5);for(const o of worldObjects[room]){if(o.type==='gate')drawGate(o);else if(o.type==='brazier')drawBrazier(o);else if(o.type==='rune')drawRune(o);else if(o.type==='tablet')drawTablet(o);else if(o.type==='chest')drawChest(o);else if(['switch','plate','snack','fire','heart','crystal','shelter','rescue','turnwheel','echo','mirror','findrook','findpip','anchor','waystone','starwheel','relay','ward','torch','beacon','indicator','acid','base','lens'].includes(o.type))drawCompanionProp(o)}
    if(room===2){for(let i=0;i<8;i++){const x=px(3+i*2.3),y=35+Math.sin(i*3)*6;glow(x,y,19,'#b4aafa',.18)}if(state.bridgeCollapsed){
      // The ruined span visibly drops when the Wanderer reaches it, rather than vanishing in narration.
      for(let y=3;y<=11;y++){rect(720,y*32,38,32,'#161b2a');rect(720,y*32,2,32,'#cdb68e');if(y%2===0)glow(731,y*32+13,19,'#b99ec7',.28)}
      if(state.bridgeFallTime<1.5){
        const f=state.bridgeFallTime/1.5,fall=f*f*215;
        for(let i=0;i<6;i++){
          const x=px(20)+i*24+Math.sin(i*2)*9+f*17, y=px(4)+i*51+fall*(.7+i*.055);
          rect(x-17,y-5,34,12,i%2?'#ad9c7c':'#c5ab82');rect(x-14,y-2,28,3,'#dfc9a1');
          rect(x-19,y+5,5,5,'#766c65');
        }
      }
    }}
  }
  function drawShadow(x,y,r=15){c.fillStyle='#101b246b';c.beginPath();c.ellipse(x,y+10,r,6,0,0,Math.PI*2);c.fill()}
  function drawPlayer(){const p=state.player,t=state.viewTime;const bob=Math.sin(t*13)*(keys.size?1.5:.6);c.save();if(p.invuln>0&&Math.floor(t*13)%2===0)c.globalAlpha=.55;const x=Math.round(p.x),y=Math.round(p.y+bob);drawShadow(x,y,15);rect(x-11,y+1,22,11,'#35475b');rect(x-10,y-8,20,16,'#4c7086');rect(x-7,y-12,14,12,'#e8b690');rect(x-8,y-17,16,9,'#323441');rect(x-9,y-14,5,6,'#323441');rect(x+6,y-14,5,5,'#323441');rect(x-9,y+9,7,9,'#322e39');rect(x+3,y+9,7,9,'#322e39');rect(x-11,y-4,4,12,'#d0b180');rect(x+7,y-4,4,12,'#d0b180');rect(x-3,y-4,6,3,'#e5d9a6');if(p.facing==='left'){rect(x-6,y-8,2,2,'#262d3e')}else if(p.facing==='right'){rect(x+4,y-8,2,2,'#262d3e')}else{rect(x-4,y-8,2,2,'#262d3e');rect(x+3,y-8,2,2,'#262d3e')}
    if(p.swing>0){c.save();c.globalAlpha=Math.min(1,p.swing/.12);const a=({right:0,down:Math.PI/2,left:Math.PI,up:-Math.PI/2})[p.facing];c.beginPath();c.arc(x,y,36,a-.58,a+.58);c.strokeStyle='#fff1b0';c.lineWidth=8;c.stroke();c.beginPath();c.arc(x,y,43,a-.38,a+.38);c.strokeStyle='#c8ecdd';c.lineWidth=3;c.stroke();c.restore()}c.restore()}
  function drawSlime(e){if(!e.alive)return;const x=e.x,y=e.y,hop=Math.abs(Math.sin(state.viewTime*5+e.phase))*4;drawShadow(x,y+4,12);rect(x-13,y-4-hop,26,15,'#2c6c68');rect(x-9,y-12-hop,18,11,e.flash>0?'#ffe1b9':'#82b4a1');rect(x-13,y-4-hop,5,10,'#65a290');rect(x+7,y-4-hop,6,10,'#65a290');rect(x-6,y-6-hop,3,4,'#1e2d40');rect(x+4,y-6-hop,3,4,'#1e2d40');rect(x-2,y+2-hop,5,2,'#f3dba1')}
  function drawBoss(){const b=state.boss;if(!b||!b.alive)return;const x=Math.round(b.x),y=Math.round(b.y),t=state.viewTime;drawShadow(x,y+6,30);glow(x,y-5,b.windup>0?95:54,b.windup>0?(b.kind==='mirror'?'#efa9ff':b.kind==='frost'?'#a7f1ff':b.kind==='rift'?'#cabaff':'#ff9078'):(b.kind==='mirror'?'#e4afff':b.kind==='frost'?'#b5eaff':b.kind==='rift'?'#b2b3ff':'#ffce94'),b.windup>0?.5:.22);if(b.windup>0){c.strokeStyle=b.kind==='mirror'?'#efc3ff':b.kind==='frost'?'#b8f0ff':b.kind==='rift'?'#c5b6ff':'#ff9e7a';c.lineWidth=4;c.setLineDash([9,5]);c.beginPath();c.arc(x,y,49+Math.sin(t*21)*3,0,Math.PI*2);c.stroke();c.setLineDash([]);const a=b.lockedAngle;line(x,y,x+Math.cos(a)*155,y+Math.sin(a)*155,b.kind==='mirror'?'#ebb2ffbb':b.kind==='frost'?'#c5f4ffaa':b.kind==='rift'?'#cfc4ffaa':'#ff997eaa',5)}
    const flash=b.flash>0,stone=flash?'#f7dbb9':b.kind==='mirror'?'#bd9ed0':b.kind==='frost'?'#a9dbe9':b.kind==='rift'?'#9292c8':'#858d9a';rect(x-26,y-7,53,44,'#39455b');rect(x-22,y-14,45,41,stone);if(b.kind==='sovereign'){glow(x,y,83,'#dacaff',.34);rect(x-20,y-64,12,36,'#c5b0ff');rect(x+8,y-64,12,36,'#c5b0ff');rect(x-11,y-70,22,18,'#f4dfff');if(!state.finalWards.every(Boolean)){c.strokeStyle='#e4bbffdd';c.lineWidth=5;c.beginPath();c.arc(x,y,59,0,Math.PI*2);c.stroke()}}if(b.kind==='mirror'){glow(x,y,68,'#e6afff',.29);rect(x-26,y-45,17,16,'#cda9f0');rect(x+12,y-45,17,16,'#cda9f0');rect(x-6,y-51,13,23,'#f4d1ff');if(!state.regentAnchors.every(Boolean)){c.strokeStyle='#e5bdffcc';c.lineWidth=4;c.beginPath();c.arc(x,y,53,0,Math.PI*2);c.stroke()}}if(b.kind==='frost'){glow(x,y,63,'#b8ecff',.22);rect(x-13,y-40,11,13,'#8ccfe8');rect(x+5,y-40,11,13,'#8ccfe8');rect(x-23,y+2,5,15,'#d5f5ff');rect(x+19,y+2,5,15,'#d5f5ff')}rect(x-34,y-7,12,31,'#566477');rect(x+22,y-7,13,31,'#566477');rect(x-30,y+15,8,18,'#44516a');rect(x+23,y+15,7,18,'#44516a');rect(x-18,y+25,14,17,'#39465c');rect(x+5,y+25,14,17,'#39465c');rect(x-19,y-30,38,25,stone);rect(x-23,y-32,13,12,'#637389');rect(x+12,y-32,13,12,'#637389');rect(x-12,y-20,8,6,'#ffba88');rect(x+5,y-20,8,6,'#ffba88');glow(x,y+6,21,'#efab87',.35);rect(x-11,y-1,22,15,'#4d6270');drawRuneGlyph(x,y+7,'◆','#ffdfa0',19)}
  function drawRook(){const x=state.room<3?px(20):state.rook.x,y=state.room<3?px(7):state.rook.y;drawShadow(x,y);if((state.room===5||state.room===8||state.room===11||(state.room===7&&state.rookRescued))&&state.rookShieldCooldown<=0){glow(x,y,26,'#b9efff',.18);rect(x-6,y-40,12,12,'#d7f3ff');drawRuneGlyph(x,y-34,'✦','#a9edff',13)}rect(x-11,y,22,12,'#7e6642');rect(x-10,y-8,20,14,'#b08055');rect(x-7,y-14,14,12,'#e3b388');rect(x-12,y-19,24,6,'#65784b');rect(x-8,y-26,16,8,'#748b56');rect(x-8,y+9,7,9,'#383b3c');rect(x+3,y+9,7,9,'#383b3c');rect(x-9,y-2,4,12,'#f0c098');rect(x+7,y-2,4,12,'#f0c098');rect(x-4,y-8,2,2,'#232b2a');rect(x+3,y-8,2,2,'#232b2a');rect(x-3,y-4,7,1,'#48352f');rect(x-11,y-1,21,4,'#d9be65')}
  function drawPip(){const x=state.room<3?px(19.2):state.pip.x,y=state.room<3?px(8.3):state.pip.y,t=state.viewTime;drawShadow(x,y,11);const n=Math.sin(t*2)*1.1;glow(x,y,21,'#b8aaff',.28);rect(x-16,y-10+n,7,8,'#9fc8d8');rect(x+10,y-11+n,7,8,'#9fc8d8');rect(x+10,y-1+n,10,4,'#d8c6f1');rect(x-10,y-4+n,21,12,'#a9a0d9');rect(x-11,y-12+n,8,12,'#a9a0d9');rect(x+5,y-13+n,7,11,'#a9a0d9');rect(x-8,y+5+n,15,4,'#928fc8');rect(x-2,y-5+n,2,2,'#3c365a');rect(x+5,y-5+n,2,2,'#3c365a');rect(x-7,y+9,4,3,'#d8ccf5');rect(x+5,y+9,4,3,'#d8ccf5');drawRuneGlyph(x+18,y-18+(reducedMotion?0:Math.sin(t*2)*3),'z','#eae9ff',11);if(state.room===4&&state.pipPlate){glow(x,y,39,'#d8caff',.19);drawRuneGlyph(x+26,y-29+(reducedMotion?0:Math.sin(t*1.5)*4),'z','#f7eaff',13)}}
  function drawWisp(e){if(!e.alive)return;const x=e.x,y=e.y+Math.sin(state.viewTime*5+e.phase)*5;drawShadow(x,y,10);glow(x,y,37,e.flash>0?'#fff2c9':'#8defff',.47);rect(x-9,y-8,19,17,e.flash>0?'#fff2c9':'#75afdc');rect(x-4,y-13,9,8,'#b4f3f2');rect(x-11,y+4,6,8,'#478bab');rect(x+6,y+4,6,8,'#478bab');rect(x-4,y-4,3,3,'#242d54');rect(x+4,y-4,3,3,'#242d54')}
  function drawFrost(e){if(!e.alive)return;const x=e.x,y=e.y,hop=Math.sin(state.viewTime*6+e.phase)*3;drawShadow(x,y+4,13);glow(x,y,37,e.flash>0?'#ffedc2':'#9ae6ff',.36);rect(x-14,y-6+hop,28,21,e.flash>0?'#ffedc2':'#79bed3');rect(x-9,y-13+hop,18,10,'#b9e6ec');rect(x-16,y+2+hop,7,10,'#4b9fbe');rect(x+9,y+2+hop,7,10,'#4b9fbe');rect(x-6,y-3+hop,3,3,'#294e65');rect(x+4,y-3+hop,3,3,'#294e65');rect(x-2,y+5+hop,5,2,'#e9faff')}
  function drawShade(e){if(!e.alive)return;const x=e.x,y=e.y+Math.sin(state.viewTime*4+e.phase)*3;drawShadow(x,y,12);glow(x,y,35,e.flash>0?'#ffebbb':'#c79aff',.40);rect(x-13,y-7,27,21,e.flash>0?'#f5e7c4':'#786caa');rect(x-8,y-17,17,12,'#a99ed1');rect(x-15,y+6,7,11,'#4b4976');rect(x+9,y+6,7,11,'#4b4976');rect(x-5,y-3,4,4,'#f6d3ff');rect(x+3,y-3,4,4,'#f6d3ff');}
  function drawProjectiles(){for(const q of state.projectiles){glow(q.x,q.y,23,q.kind==='wisp'||q.kind==='rift'||q.kind==='frost'||q.kind==='shade'||q.kind==='mirror'?'#99caff':'#ff937d',.65);rect(q.x-7,q.y-7,14,14,q.kind==='wisp'||q.kind==='rift'||q.kind==='frost'||q.kind==='shade'||q.kind==='mirror'?'#7fbde4':'#e99c79');rect(q.x-3,q.y-3,6,6,'#fff3c1')}}
  function drawParticles(){for(const p of state.particles){c.globalAlpha=clamp(p.life/p.max,0,1);rect(p.x,p.y,p.size,p.size,p.color)}c.globalAlpha=1}
  function drawFloatingMotes(){const n=state.room===2?23:12;for(let i=0;i<n;i++){let x=(hash(i,3,state.room)%WIDTH+Math.sin(state.viewTime*.45+i)*19+WIDTH)%WIDTH;let y=(hash(4,i,state.room)%HEIGHT-state.viewTime*(4+i%4)+HEIGHT*7)%HEIGHT;rect(x,y,i%3===0?3:2,i%3===0?3:2,state.room===2?'#c5b9d2a0':'#f1e6c772')}}
  function drawGloamAtmosphere(){
    if(state.room!==12)return;
    // This compositing pass hides the world, then cuts soft light pools through the darkness.
    fog.clearRect(0,0,WIDTH,HEIGHT);fog.globalCompositeOperation='source-over';fog.fillStyle='rgba(2,5,15,0.965)';fog.fillRect(0,0,WIDTH,HEIGHT);
    fog.globalCompositeOperation='destination-out';
    const hole=(x,y,r,strength=1)=>{
      const grad=c.createRadialGradient(x,y,0,x,y,r);
      grad.addColorStop(0,`rgba(0,0,0,${strength})`);
      grad.addColorStop(.58,`rgba(0,0,0,${strength*.91})`);
      grad.addColorStop(1,'rgba(0,0,0,0)');
      fog.fillStyle=grad;fog.fillRect(x-r,y-r,r*2,r*2);
    };
    hole(state.player.x,state.player.y,state.hasTorch?163:90,1);
    for(const b of worldObjects[12].filter(o=>o.type==='beacon'&&state.mazeBeacons[o.id]))hole(px(b.x),px(b.y),110,.96);
    if(state.pipSenseTime>0)hole(state.pip.x,state.pip.y,115,.9);
    fog.globalCompositeOperation='source-over';c.drawImage(fogCanvas,0,0);
    // Foreground torch and Pip's directional flare remain visible even at the edge of light.
    if(state.hasTorch){const p=state.player;
      glow(p.x,p.y-29,35,'#ffda78',.4);rect(p.x+12,p.y-38,4,18,'#c48a4f');
      rect(p.x+9,p.y-47+Math.sin(state.viewTime*9)*2,10,14,'#ffbd64');
      rect(p.x+12,p.y-53+Math.sin(state.viewTime*9)*3,5,12,'#fff0b0');
    }
    if(state.pipSenseTime>0&&state.pipSenseTarget){
      const route=mazeRoute(state.pipSenseTarget);
      for(let i=1;i<Math.min(6,route.length);i++){
        const [tx,ty]=route[i],x=px(tx),y=px(ty);
        if(dist(x,y,state.player.x,state.player.y)>192)break;
        glow(x,y,20,'#d8b7ff',.46);
        rect(x-3,y-3,6,6,'#efd2ff');
        if(i===1)drawRuneGlyph(x,y-20,'✦','#f4dbff',15);
      }
    }
  }
  function drawChalkMarks(){
    if(state.room!==12||!state.hasTorch)return;
    for(let i=0;i<state.mazeMarks.length;i++){
      const [tx,ty]=state.mazeMarks[i].split(',').map(Number),x=px(tx),y=px(ty);
      if(dist(x,y,state.player.x,state.player.y)>177&&!worldObjects[12].some(o=>o.type==='beacon'&&state.mazeBeacons[o.id]&&dist(x,y,px(o.x),px(o.y))<105))continue;
      // Big, high-contrast chalk chevrons on the floor; remain visible after the fog pass.
      rect(x-9,y+9,5,4,'#ffecb8');rect(x-4,y+13,5,4,'#ffecb8');rect(x+1,y+9,5,4,'#ffecb8');
      rect(x-4,y+6,5,4,'#fff6df');
    }
  }
  function drawCanvas(){c.clearRect(0,0,WIDTH,HEIGHT);c.save();if(!reducedMotion&&state.screenShake>0){const magnitude=state.screenShake;c.translate(Math.sin(state.viewTime*83)*magnitude,Math.cos(state.viewTime*66)*magnitude)}drawGround();drawSceneAtmosphere();drawFloatingMotes();drawProps();drawFocusHints();for(const e of state.enemies){if(e.kind==='wisp')drawWisp(e);else if(e.kind==='frost')drawFrost(e);else if(e.kind==='shade')drawShade(e);else drawSlime(e)}if(state.boss&&state.boss.alive)drawBoss();if(state.rookVisible){if(!(state.room===7&&!state.rookRescued)&&!(state.room===10&&!state.rookFound))drawRook();if(!(state.room===10&&!state.pipFound))drawPip();if(state.room===2){rect(px(20)+7,px(7)-24,13,43,'#505669');rect(px(20)+7,px(7)-25,17,7,'#8c8b83')}}drawPlayer();drawProjectiles();drawParticles();drawFloatingText();drawGloamAtmosphere();drawChalkMarks();c.restore();if(state.mode==='end'){glow(px(20),px(7),100,'#f4d6b7',.25)}if([2,5,8,11,14].includes(state.room)&&state.boss&&state.boss.alive){el('boss-fill').style.width=`${state.boss.hp/state.boss.maxHp*100}%`;el('boss-hud').classList.remove('hidden')}}
  let last=0;function frame(now){const dt=Math.min((now-last)/1000||.016,.043);last=now;update(dt);soundtrack.select(state.room,state.mode,!!(state.boss&&state.boss.alive));drawCanvas();requestAnimationFrame(frame)}
  const stage=document.querySelector('.game-frame');
  const drawer=el('journal-drawer');
  let previousFocus=null, previousMode='play';
  function journalOpen(){
    if(document.body.classList.contains('journal-open'))return;
    previousMode=state.mode;
    previousFocus=document.activeElement;
    keys.clear();
    document.body.classList.add('journal-open');
    drawer.setAttribute('aria-hidden','false');
    el('journal-button').setAttribute('aria-expanded','true');
    if(state.mode==='play')state.mode='journal';
    el('journal-close').focus({preventScroll:true});
  }
  function journalClose(){
    if(!document.body.classList.contains('journal-open'))return;
    document.body.classList.remove('journal-open');
    drawer.setAttribute('aria-hidden','true');
    el('journal-button').setAttribute('aria-expanded','false');
    if(state.mode==='journal')state.mode=previousMode==='play'?'play':previousMode;
    (state.mode==='play'?canvas:previousFocus||el('journal-button')).focus({preventScroll:true});
  }
  function toggleJournal(){if(document.body.classList.contains('journal-open'))journalClose();else journalOpen()}
  let pauseReturnMode='play';
  function setPauseButton(){
    const active=state.mode==='paused';
    el('pause-button').innerHTML=active?'▶ <span>Resume</span>':'Ⅱ <span>Pause</span>';
    el('pause-button').setAttribute('aria-label',active?'Resume game (Escape)':'Pause game (Escape)');
    el('pause-button').setAttribute('aria-pressed',String(active));
  }
  function pauseGame(){
    if(!['play','dialogue'].includes(state.mode))return;
    if(document.body.classList.contains('journal-open'))journalClose();
    pauseReturnMode=state.mode;
    keys.clear();state.mode='paused';
    el('pause').classList.remove('hidden');
    el('pause-music-title').textContent=soundtrack.getTitle(state.room,!!(state.boss&&state.boss.alive));
    setPauseButton();
    el('pause-resume').focus({preventScroll:true});
  }
  function resumeGame(){
    if(state.mode!=='paused')return;
    state.mode=pauseReturnMode;
    el('pause').classList.add('hidden');
    keys.clear();setPauseButton();
    if(state.audioOn)soundtrack.unlock();
    canvas.focus({preventScroll:true});
  }
  function togglePause(){if(state.mode==='paused')resumeGame();else pauseGame()}
  function updateSoundButton(){
    el('sound-toggle').innerHTML=state.audioOn?'♫ <span>Music on</span>':'♫ <span>Music off</span>';
    el('sound-toggle').setAttribute('aria-pressed',String(state.audioOn));
    el('pause-sound-toggle').textContent=state.audioOn?'♫ Mute music & effects':'♫ Enable music & effects';
  }
  function toggleSound(){
    state.audioOn=!state.audioOn;
    soundtrack.setEnabled(state.audioOn);
    if(state.audioOn)soundtrack.unlock();
    try{localStorage.setItem('awa-audio-muted',state.audioOn?'0':'1')}catch{}
    updateSoundButton();
  }
  function updateFullscreenButton(){
    const active=!!document.fullscreenElement||document.body.classList.contains('theater-mode');
    el('fullscreen-toggle').innerHTML=active?'⤡ <span>Exit fullscreen</span>':'⛶ <span>Fullscreen</span>';
    el('fullscreen-toggle').setAttribute('aria-label',active?'Exit fullscreen':'Enter fullscreen');
    el('fullscreen-toggle').setAttribute('aria-pressed',String(active));
    el('fullscreen-toggle').title=active?'Exit fullscreen (Esc)':'Make the game fullscreen';
    const titleFullscreen=el('title-fullscreen');
    if(titleFullscreen){
      titleFullscreen.textContent=active?'⤡  EXIT FULLSCREEN':'⛶  FULLSCREEN';
      titleFullscreen.setAttribute('aria-label',active?'Exit fullscreen':'Enter fullscreen');
      titleFullscreen.setAttribute('aria-pressed',String(active));
      titleFullscreen.title=active?'Return to windowed mode':'Expand A World Away to fullscreen';
    }
  }
  async function toggleFullscreen(){
    journalClose();
    try{
      if(document.fullscreenElement){await document.exitFullscreen()}
      else if(document.body.classList.contains('theater-mode')){document.body.classList.remove('theater-mode')}
      else if(stage.requestFullscreen){await stage.requestFullscreen()}
      else{document.body.classList.add('theater-mode')}
    }catch{document.body.classList.toggle('theater-mode')}
    updateFullscreenButton();
    if(state.mode==='play')canvas.focus({preventScroll:true});
  }
  document.addEventListener('fullscreenchange',updateFullscreenButton);
  el('ingame-chapters').addEventListener('click',showChapterMenu);
  el('corner-pause').addEventListener('click',togglePause);
  el('pause-journal').addEventListener('click',()=>{resumeGame();journalOpen()});
  el('pause-restart').addEventListener('click',()=>{if(window.confirm('Restart this chapter from the beginning?'))beginChapter(Math.floor(state.room/3))});
  el('pause-fullscreen').addEventListener('click',toggleFullscreen);
  el('title-fullscreen').addEventListener('click',toggleFullscreen);
  el('finale-next').addEventListener('click',advanceFinale);
  el('preview-ending').addEventListener('click',()=>{
    if(!canReplay())return;
    if(creatorMode&&!journeyCleared&&!window.confirm('Creator preview: this reveals the full ending. Open it?'))return;
    startFinalePreview();
  });
  el('chapter-replay-toggle').addEventListener('click',()=>{
    if(!canReplay())return;
    const panel=el('chapter-replay-panel');const open=panel.classList.toggle('hidden')===false;
    el('chapter-replay-toggle').setAttribute('aria-expanded',String(open));
  });
  el('new-journey').addEventListener('click',startNewJourney);
  el('finale-preview-prev').addEventListener('click',previousFinalePreview);
  el('finale-preview-exit').addEventListener('click',showChapterMenu);

  el('pause-button').addEventListener('click',togglePause);
  el('pause-resume').addEventListener('click',resumeGame);
  el('pause-chapters').addEventListener('click',showChapterMenu);
  el('pause-sound-toggle').addEventListener('click',toggleSound);
  el('music-volume').addEventListener('input',e=>{soundtrack.setVolume(Number(e.target.value)/100);el('music-volume-value').textContent=`${e.target.value}%`});
  el('journal-button').addEventListener('click',toggleJournal);
  el('journal-close').addEventListener('click',journalClose);
  el('journal-backdrop').addEventListener('click',journalClose);
  el('fullscreen-toggle').addEventListener('click',toggleFullscreen);
  function down(e){
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Shift'].includes(e.key))e.preventDefault();
    const k=e.key.length===1?e.key.toLowerCase():e.key;
    if(k==='Escape'){
      if(document.body.classList.contains('journal-open')){e.preventDefault();journalClose();return}
      if(state.mode==='paused'||state.mode==='play'||state.mode==='dialogue'){
        e.preventDefault();togglePause();return;
      }
      if(document.body.classList.contains('theater-mode')){document.body.classList.remove('theater-mode');updateFullscreenButton();return}
    }
    if(k==='q'&&!e.repeat&&state.room===12&&state.mode==='play'){e.preventDefault();senseWithPip();return}
    if(k==='j'&&!e.repeat&&state.mode!=='paused'){e.preventDefault();toggleJournal();return}
    if(state.mode==='journal'||state.mode==='paused')return;
    if(state.mode==='cinematic'){if(['e',' ','Enter'].includes(k)&&!e.repeat){e.preventDefault();advanceFinale()}return;}
    if(state.mode==='dialogue'){if(['e','E',' ','Enter'].includes(e.key)&&!e.repeat){e.preventDefault();nextLine()}return}
    if(state.mode!=='play')return;
    keys.add(k);if(e.repeat)return;
    if(k===' '||k==='k')attack();else if(k==='e'||k==='f')doInteract();else if(k==='Shift')dash();
  }
  function up(e){keys.delete(e.key.length===1?e.key.toLowerCase():e.key)}
  document.addEventListener('keydown',down);document.addEventListener('keyup',up);window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden&&['play','dialogue'].includes(state.mode))pauseGame()});
  document.querySelectorAll('[data-direction]').forEach(button=>{const key={up:'w',left:'a',down:'s',right:'d'}[button.dataset.direction];const stop=e=>{e.preventDefault();keys.delete(key)};button.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(key);button.setPointerCapture(e.pointerId)});button.addEventListener('pointerup',stop);button.addEventListener('pointercancel',stop);button.addEventListener('lostpointercapture',stop)});
  el('touch-sense').addEventListener('click',senseWithPip);el('touch-attack').addEventListener('click',attack);el('touch-dash').addEventListener('click',dash);el('touch-interact').addEventListener('click',()=>state.mode==='dialogue'?nextLine():doInteract());el('dialogue-next').addEventListener('click',nextLine);el('start').addEventListener('click',playFromTitle);el('retry').addEventListener('click',respawn);el('restart').addEventListener('click',()=>{if(window.confirm('Erase all chapter progress? This cannot be undone.')){reset();showChapterMenu()}});document.querySelectorAll('[data-chapter-start]').forEach(button=>button.addEventListener('click',()=>{if(canReplay())beginChapter(Number(button.dataset.chapterStart))}));el('replay').addEventListener('click',()=>beginChapter(0));
  el('continue-ch2').addEventListener('click',()=>beginChapter(1,true));
  el('continue-ch3').addEventListener('click',()=>beginChapter(2,true));el('continue-ch4').addEventListener('click',()=>beginChapter(3,true));el('continue-ch5').addEventListener('click',()=>beginChapter(4,true));el('chapter-menu-victory4').addEventListener('click',showChapterMenu);el('chapter-menu-victory3').addEventListener('click',showChapterMenu);el('chapter-menu-victory2').addEventListener('click',showChapterMenu);
  el('return-ch2').addEventListener('click',()=>{el('victory2').classList.add('hidden');state.ch2Complete=false;state.player.hp=6;state.rookShieldCooldown=0;state.mode='play';roomLoad(3);notice('THE SHATTERED ISLES — EXPLORE AGAIN')});el('sound-toggle').addEventListener('click',toggleSound);
  document.querySelectorAll('[data-note]').forEach(button=>button.addEventListener('click',()=>{const n=Number(button.dataset.note);if(!state.notesRead.includes(n))return;state.selectedNote=n;updateClueJournal()}));
  // Expose read-only test hooks only when ?dev=1 is explicitly supplied.
  if(window.AWA_TEST_MODE===true)window.AWA_DEV={state,canReplay,markAdventureComplete,awardFragment,senseWithPip,refreshFragments,roomLoad,refreshUI,attack,doInteract,reset,notice,px,hurt,save,speak,beginChapter2:()=>beginChapter(1),beginChapter3:()=>beginChapter(2),beginChapter4:()=>beginChapter(3),beginChapter5:()=>beginChapter(4),startFinale,startFinalePreview,advanceFinale,previousFinalePreview,beginChapter,showChapterMenu,respawn,journalOpen,journalClose,toggleFullscreen,pauseGame,resumeGame,toggleSound,soundtrack,interactAt:(room,x,y)=>{if(state.room!==room)roomLoad(room);state.mode='play';state.player.x=px(x);state.player.y=px(y);doInteract()},endChapter2:()=>{state.ch2BossDefeated=true;state.mode='play';roomLoad(5)},endChapter3:()=>{state.ch3BossDefeated=true;state.mode='play';roomLoad(8)}};
  updateSoundButton();setPauseButton();restore();initializing=false;showChapterMenu();requestAnimationFrame(frame);
})();
