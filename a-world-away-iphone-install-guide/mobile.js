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
  // iOS Home Screen apps do not reliably support orientation locking.
  // The CSS landscape gate covers portrait screens. Pause combat automatically
  // when the phone turns upright; resume is manual after rotating back.
  const portraitQuery=matchMedia('(orientation:portrait)');
  const touchQuery=matchMedia('(pointer:coarse)');
  let previousPortraitBlock=false;
  function syncLandscapeGate() {
    const blocked=portraitQuery.matches&&touchQuery.matches;
    if(blocked&&!previousPortraitBlock){
      document.dispatchEvent(new Event('awa:portrait-blocked'));
    }
    previousPortraitBlock=blocked;
  }
  portraitQuery.addEventListener?.('change',syncLandscapeGate);
  touchQuery.addEventListener?.('change',syncLandscapeGate);
  window.addEventListener('resize',syncLandscapeGate);
  window.addEventListener('orientationchange',syncLandscapeGate);
  syncLandscapeGate();
  // Web app installation: iPhone/iPad Safari supports Add to Home Screen, not a JS install prompt.
  const installBtn=document.getElementById('install-help-button');
  const installSheet=document.getElementById('install-sheet');
  const installed=()=>matchMedia('(display-mode:standalone)').matches || window.navigator.standalone===true;
  if(installed())installBtn?.classList.add('hidden');
  // On the FIRST iPhone Safari visit in portrait, explain Home Screen installation
  // before asking the player to rotate. After installation, only show rotation.
  // Safari cannot install a PWA programmatically; this is an on-screen guide only.
  const welcomeGate=document.getElementById('landscape-gate');
  const welcomeDismiss=document.getElementById('install-welcome-dismiss');
  const welcomeReopen=document.getElementById('install-welcome-reopen');
  const guideKey='awa-iphone-safari-install-guide-dismissed-v1';
  const ua=navigator.userAgent||'';
  const iphoneSafari=/iPhone|iPod/i.test(ua)&&/Safari/i.test(ua)&&!/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo|GSA/i.test(ua);
  const eligible=iphoneSafari&&!installed();
  let dismissed=false;
  try{dismissed=localStorage.getItem(guideKey)==='yes';}catch{}
  function updateWelcomeGate(){
    if(!welcomeGate)return;
    welcomeGate.dataset.mode=eligible&&!dismissed?'install':'rotate';
    welcomeReopen?.classList.toggle('hidden',!eligible);
    // The CSS makes the gate visible only in portrait on touchscreens.
  }
  welcomeDismiss?.addEventListener('click',()=>{
    dismissed=true;
    try{localStorage.setItem(guideKey,'yes');}catch{}
    updateWelcomeGate();
  });
  welcomeReopen?.addEventListener('click',()=>{
    dismissed=false;
    updateWelcomeGate();
  });
  updateWelcomeGate();

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
