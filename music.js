/* A WORLD AWAY — Original procedural soundtrack.
   All melodies are original, generated locally through Web Audio.
   No samples, streamed audio, external media, or third-party music.
   The sound engine starts only following a player gesture. */
(() => {
  'use strict';
  const N = null;
  // Four-bar melodies: notes at eighth-note positions (null = breathing space).
  const THEMES = {
    'temple': {
      name:'Mosslight Waltz', bpm:77, wave:'sine', root:'A2',
      chords:[['A3','C4','E4','G4'],['F3','A3','C4','E4'],['C4','E4','G4','B4'],['G3','B3','D4','A4']],
      melody:['E5',N,'C5',N,'A4','C5',N,'G4','A4',N,'C5','E5',N,'D5',N,N,
              'G4',N,'C5',N,'B4','G4',N,'E4','D5',N,'B4',N,'A4',N,N,N],
      bass:['A2','F2','C3','G2'], percussion:false
    },
    'isles': {
      name:'Skyward Daydream', bpm:94, wave:'triangle', root:'G2',
      chords:[['G3','B3','D4','A4'],['D3','F#3','A3','E4'],['E3','G3','B3','D4'],['C3','E3','G3','B3']],
      melody:['D5',N,'G5','F#5',N,'D5','B4',N,'E5',N,'F#5',N,'A5','G5',N,N,
              'B4','D5',N,'E5',N,'G5','A5',N,'G5',N,'E5','D5',N,'B4',N,N],
      bass:['G2','D2','E2','C2'], percussion:false
    },
    'frost': {
      name:'Snowglass Reverie', bpm:69, wave:'sine', root:'D2',
      chords:[['D3','F3','A3','E4'],['Bb2','D3','F3','A3'],['G3','Bb3','D4','F4'],['A2','C3','E3','G3']],
      melody:['A4',N,N,'F4',N,'E4',N,'D4','F4',N,'A4',N,'G4',N,'E4',N,
              'D5',N,'C5',N,'Bb4',N,'A4',N,'G4',N,'F4','E4',N,'D4',N,N],
      bass:['D2','Bb1','G2','A2'], percussion:false
    },
    'maze': {
      name:'Whispers Behind the Wall', bpm:80, wave:'sine',
      chords:[['E3','G3','B3','D4'],['C3','E3','G3','B3'],['A2','C3','E3','G3'],['B2','D3','F#3','A3']],
      melody:['B4',N,'G4',N,'E4',N,'G4','A4',N,'B4',N,'D5','B4',N,'A4',N,
              'G4',N,'E4','F#4',N,'G4',N,'B4','C5',N,'B4',N,'A4',N,'E4',N],
      bass:['E2','C2','A1','B1'],percussion:false
    },
    'horizon': {
      name:'Where Starlight Sleeps', bpm:86, wave:'sine',
      chords:[['C3','E3','G3','B3'],['A2','C3','E3','G3'],['F3','A3','C4','E4'],['G3','B3','D4','F4']],
      melody:['G4',N,'C5',N,'E5',N,'D5',N,'C5','B4',N,'A4','G4',N,N,N,
              'A4',N,'C5','E5',N,'G5',N,'E5','D5',N,'C5',N,'B4','G4',N,N],
      bass:['C2','A1','F2','G2'],percussion:false
    },
    'finale': {
      name:'Home Between the Stars', bpm:64, wave:'sine', root:'C3',
      chords:[['C4','E4','G4','B4'],['G3','B3','D4','G4'],['A3','C4','E4','G4'],['F3','A3','C4','E4']],
      melody:['E5',N,'G5',N,'E5','D5',N,'C5','D5',N,'E5',N,'G5',N,N,N,
              'A4',N,'C5',N,'E5','D5',N,'C5','B4',N,'C5',N,'G4',N,N,N],
      bass:['C3','G2','A2','F2'],percussion:false
    },
    'horizon-boss': {
      name:'Against the Endless Night', bpm:158, wave:'triangle',
      chords:[['C3','Eb3','G3'],['Ab2','C3','Eb3'],['F3','Ab3','C4'],['G2','B2','D3']],
      melody:['C5','Eb5',N,'G5','F5','Eb5',N,'C5','Ab4','C5','Eb5',N,'F5','Eb5',N,'C5',
              'F5','Ab5','C6',N,'Bb5','Ab5',N,'F5','G5','B5',N,'D6','C6',N,'G5',N],
      bass:['C2','Ab1','F2','G1'],percussion:true
    },
    'maze-boss': {
      name:'The Shattered Reflection', bpm:148, wave:'triangle',
      chords:[['E3','G3','B3'],['F3','A3','C4'],['D3','F#3','A3'],['B2','D#3','F#3']],
      melody:['E5','G5',N,'B5','A5','G5',N,'E5','C5',N,'F5','E5',N,'C5','B4',N,
              'D5','F#5','A5',N,'G5','F#5',N,'D5','B4','D#5','F#5',N,'E5','B4','E5',N],
      bass:['E2','F2','D2','B1'],percussion:true
    },
    'temple-boss': {
      name:'Stone Warden Awakens', bpm:140, wave:'triangle',
      chords:[['A3','C4','E4'],['G3','B3','D4'],['F3','A3','C4'],['E3','G#3','B3']],
      melody:['A4',N,'C5','E5','D5',N,'C5',N,'B4','D5','G5',N,'E5','D5',N,N,
              'A4','C5','E5','A5',N,'G5','E5',N,'F5',N,'E5','D5','B4',N,'A4',N],
      bass:['A2','G2','F2','E2'], percussion:true
    },
    'isles-boss': {
      name:'Riftstorm Rush', bpm:151, wave:'triangle',
      chords:[['E3','G3','B3'],['D3','F#3','A3'],['C3','E3','G3'],['B2','D3','F#3']],
      melody:['B4','E5','G5',N,'F#5','E5',N,'D5','A4','D5','F#5',N,'G5',N,'F#5',N,
              'E5','G5','B5',N,'A5','G5','E5',N,'D5',N,'F#5','G5',N,'E5','D5',N],
      bass:['E2','D2','C2','B1'], percussion:true
    },
    'frost-boss': {
      name:'The Winter Heart', bpm:134, wave:'triangle',
      chords:[['D3','F3','A3'],['Bb2','D3','F3'],['G3','Bb3','D4'],['A2','C#3','E3']],
      melody:['D5',N,'A4','F5','E5',N,'D5',N,'Bb4','D5','F5',N,'E5',N,'C5',N,
              'G4','Bb4','D5','G5','F5','E5',N,'D5','C#5',N,'E5','A5',N,'G5','F5',N],
      bass:['D2','Bb1','G2','A2'], percussion:true
    }
  };
  const A4 = 440;
  function frequency(note){
    const match = /^([A-G])([#b]?)(\d)$/.exec(note);
    if(!match)return 0;
    const semitones={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
    const midi=(Number(match[3])+1)*12+semitones[match[1]]+(match[2]==='#'?1:match[2]==='b'?-1:0);
    return A4*Math.pow(2,(midi-69)/12);
  }
  class Soundtrack {
    constructor(){
      this.context=null;this.musicBus=null;this.sfxBus=null;this.musicEnabled=true;
      this.volume=0.55;this.theme=null;this.step=0;this.nextTime=0;
      this.silent=true;this.targetVolume=null;this.available=!!(window.AudioContext||window.webkitAudioContext);
    }
    unlock(){
      if(!this.available)return;
      try{
        if(!this.context){
          const AudioCtor=window.AudioContext||window.webkitAudioContext;
          const ctx=new AudioCtor();this.context=ctx;
          this.musicBus=ctx.createGain();this.musicBus.gain.value=0;
          this.musicBus.connect(ctx.destination);
          this.sfxBus=ctx.createGain();this.sfxBus.gain.value=.75;
          this.sfxBus.connect(ctx.destination);
          // A very light repeating echo lends the notes a distant magical quality.
          const echo=ctx.createDelay(.7),feedback=ctx.createGain(),wet=ctx.createGain();
          echo.delayTime.value=.27;feedback.gain.value=.14;wet.gain.value=.10;
          this.musicBus.connect(echo);echo.connect(feedback);feedback.connect(echo);
          echo.connect(wet);wet.connect(ctx.destination);
        }
        if(this.context.state==='suspended')this.context.resume().catch(()=>{});
      }catch{this.available=false}
    }
    setEnabled(on){this.musicEnabled=!!on;if(!on)this.fadeOut();else this.unlock();}
    setVolume(value){this.volume=Math.max(0,Math.min(1,Number(value)||0));this.targetVolume=null;}
    fadeOut(){
      if(!this.context||!this.musicBus)return;
      const now=this.context.currentTime;
      this.musicBus.gain.cancelScheduledValues(now);
      this.musicBus.gain.setTargetAtTime(0,now,.035);
      this.silent=true;this.targetVolume=null;
      this.nextTime=0;
    }
    select(room,mode,bossAlive){
      if(!this.context)return;
      const playing=['play','dialogue','end','cinematic'].includes(mode)&&this.musicEnabled;
      if(!playing){if(!this.silent)this.fadeOut();return;}
      const chapter=Math.floor(room/3);
      const key=mode==='cinematic'?'finale':['temple','isles','frost','maze','horizon'][chapter]+(room%3===2&&bossAlive?'-boss':'');
      const now=this.context.currentTime;
      if(this.context.state!=='running')return;
      if(this.silent||this.theme!==key){
        this.theme=key;this.step=0;this.nextTime=now+.085;
        this.musicBus.gain.cancelScheduledValues(now);
        this.musicBus.gain.setTargetAtTime(0,now,.02);
        this.silent=false;this.targetVolume=null;
      }
      if(this.targetVolume!==this.volume){
        this.musicBus.gain.setTargetAtTime(.15*this.volume,now,.16);
        this.targetVolume=this.volume;
      }
      // Keep the lookahead short so pausing/muting feels immediate.
      const song=THEMES[this.theme];
      let scheduled=0;
      while(this.nextTime<now+.20&&scheduled<4){
        const index=this.step%32;
        const stepSeconds=60/song.bpm/2;
        const t=this.nextTime;
        const melody=song.melody[index];
        if(index%8===0){
          const chord=song.chords[Math.floor(index/8)];
          chord.forEach((note,i)=>this.tone(note,t,stepSeconds*7.35,'pad',song.percussion?.11:.18,i));
        }
        if(index%4===0){const bass=song.bass[Math.floor(index/8)];
          this.tone(bass,t,stepSeconds*(song.percussion?3.3:6.6),'bass',song.percussion?.20:.16);}
        if(melody)this.tone(melody,t,stepSeconds*(song.percussion?1.35:2.0),'lead',song.percussion?.26:.21);
        if(!song.percussion&&index%4===3){
          const arp=song.chords[Math.floor(index/8)][1+(Math.floor(index/4)%2)];
          this.tone(arp,t,stepSeconds*1.3,'sparkle',.055);
        }
        if(song.percussion){
          if(index%8===0||index%8===4)this.drum(t,true);
          if(index%8===4||index%8===7)this.drum(t,false);
        }
        this.step++;this.nextTime+=stepSeconds;scheduled++;
      }
    }
    tone(note,time,duration,kind,loudness=.15,voice=0){
      const ctx=this.context;if(!ctx)return;
      const hz=frequency(note);if(!hz)return;
      const osc=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
      osc.type=kind==='lead'?'triangle':kind==='bass'?'sine':kind==='sparkle'?'sine':'sine';
      osc.frequency.setValueAtTime(hz,time);
      if(kind==='pad')osc.detune.value=(voice-1.5)*2.2;
      filter.type='lowpass';filter.frequency.value=kind==='bass'?380:kind==='pad'?1100:kind==='sparkle'?1900:2000;
      const attack=kind==='pad'?.23:kind==='bass'?.03:.018;
      const release=kind==='pad'?.65:kind==='bass'?.27:.22;
      gain.gain.setValueAtTime(.00001,time);
      gain.gain.linearRampToValueAtTime(loudness,time+attack);
      gain.gain.setValueAtTime(loudness*(kind==='pad'?.72:.55),time+Math.max(attack,duration*.6));
      gain.gain.exponentialRampToValueAtTime(.00001,time+duration+release);
      osc.connect(filter);filter.connect(gain);gain.connect(this.musicBus);
      osc.start(time);osc.stop(time+duration+release+.03);
    }
    drum(time,kick){
      const ctx=this.context,osc=ctx.createOscillator(),g=ctx.createGain();
      osc.type=kick?'sine':'triangle';osc.frequency.setValueAtTime(kick?96:210,time);
      osc.frequency.exponentialRampToValueAtTime(kick?41:96,time+.105);
      g.gain.setValueAtTime(.0001,time);g.gain.linearRampToValueAtTime(kick?.11:.038,time+.008);
      g.gain.exponentialRampToValueAtTime(.0001,time+(kick?.23:.12));
      osc.connect(g);g.connect(this.musicBus);osc.start(time);osc.stop(time+.25);
    }
    effect(type){
      if(!this.musicEnabled||!this.context||this.context.state!=='running')return;
      const ac=this.context,n=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();
      o.type='square';o.frequency.setValueAtTime(({pickup:660,hurt:145,attack:290,boss:85,door:480,fail:155,step:360}[type]||420),n);
      if(type==='pickup'||type==='door')o.frequency.exponentialRampToValueAtTime(920,n+.18);
      if(type==='attack')o.frequency.exponentialRampToValueAtTime(110,n+.12);
      g.gain.setValueAtTime(.027,n);g.gain.exponentialRampToValueAtTime(.0001,n+.19);
      o.connect(g);g.connect(this.sfxBus);o.start(n);o.stop(n+.20);
    }
    getTitle(room,bossAlive){
      const chapter=Math.floor(room/3),key=['temple','isles','frost','maze','horizon'][chapter]+(room%3===2&&bossAlive?'-boss':'');
      return THEMES[key].name;
    }
  }
  window.AWA_Soundtrack=Soundtrack;
})();
