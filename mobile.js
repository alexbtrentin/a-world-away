/* A World Away — touch joystick, iOS installation guide, PWA registration. */
(() => {
  'use strict';
  const joy = document.getElementById('mobile-joystick');
  const knob = document.getElementById('joystick-knob');
  const dpadKeys = { up: 'w', down:'s', left:'a', right:'d' };
  const held = new Set();
  let pointer = null;
  const send = (key, type) => document.dispatchEvent(new KeyboardEvent(type, { key, bubbles:true, cancelable:true }));
  function updateHeld(directions) {
    for(const [direction,key] of Object.entries(dpadKeys)) {
      const needed = directions.has(direction);
      if (needed && !held.has(key)) {held.add(key);send(key, 'keydown');}
      else if (!needed && held.has(key)) {held.delete(key);send(key, 'keyup');}
    }
  }
  function stop() {pointer=null;updateHeld(new Set());joy?.classList.remove('active');if(knob)knob.style.transform='translate(0px,0px)';}
  function move(e) {
    if (pointer !== e.pointerId || !joy) return;
    const r=joy.getBoundingClientRect();
    const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
    const max=Math.max(25,r.width*0.32);
    const norm=Math.max(1,Math.hypot(dx,dy)/max);
    const nx=dx/norm,ny=dy/norm;
    knob.style.transform=`translate(${nx.toFixed(1)}px, ${ny.toFixed(1)}px)`;
    const dirs=new Set();
    if(nx>max*.26)dirs.add('right'); if(nx< -max*.26)dirs.add('left');
    if(ny>max*.26)dirs.add('down'); if(ny< -max*.26)dirs.add('up');
    updateHeld(dirs);
  }
  if(joy){
    joy.addEventListener('pointerdown',e=>{if(pointer!==null)return;e.preventDefault();pointer=e.pointerId;joy.classList.add('active');joy.setPointerCapture(e.pointerId);move(e);});
    joy.addEventListener('pointermove',e=>{if(pointer===e.pointerId){e.preventDefault();move(e);}});
    for(const event of ['pointerup','pointercancel','lostpointercapture'])joy.addEventListener(event,e=>{if(pointer===e.pointerId){e.preventDefault();stop();}});
    window.addEventListener('blur',stop); document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
  }
  // A separate finger can tap the dialogue panel while the other hand rests on the screen.
  const box=document.getElementById('dialogue-box');
  box?.addEventListener('click',e=>{
    if(e.target.closest('button'))return;
    if(!document.getElementById('dialogue').classList.contains('hidden')) document.getElementById('dialogue-next')?.click();
  });
  // Landscape is recommended, but never block the player or assume iOS allows orientation lock.
  const rotate=document.getElementById('rotate-hint');
  const rotateClose=document.getElementById('rotate-dismiss');
  let dismissed=false;
  function showRotate() {
    const portrait=matchMedia('(orientation:portrait)').matches;
    const touch=matchMedia('(pointer:coarse)').matches;
    if(rotate)rotate.classList.toggle('hidden',!portrait||!touch||dismissed);
  }
  rotateClose?.addEventListener('click',()=>{dismissed=true;showRotate()});
  window.addEventListener('resize',showRotate);window.addEventListener('orientationchange',showRotate);showRotate();
  // Web app installation: iPhone/iPad Safari supports Add to Home Screen, not a JS install prompt.
  const installBtn=document.getElementById('install-help-button');
  const installSheet=document.getElementById('install-sheet');
  const installed=()=>matchMedia('(display-mode:standalone)').matches || window.navigator.standalone===true;
  if(installed())installBtn?.classList.add('hidden');
  installBtn?.addEventListener('click',()=>{installSheet?.classList.remove('hidden');document.getElementById('install-close')?.focus();});
  document.getElementById('install-close')?.addEventListener('click',()=>{installSheet?.classList.add('hidden');installBtn?.focus();});
  installSheet?.addEventListener('click',e=>{if(e.target===installSheet) installSheet.classList.add('hidden');});
  // Do not start music until a real player gesture (game.js handles this).
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(async () => {
        try{await navigator.serviceWorker.ready;
          const status=document.getElementById('offline-status');
          if(status)status.textContent='Offline files downloaded. You can launch the game without Wi-Fi after installation.';
        }catch{}
      }).catch(()=>{const status=document.getElementById('offline-status');if(status)status.textContent='Offline download was unavailable; reconnect and reload before installing.';});
    });
  }
})();
