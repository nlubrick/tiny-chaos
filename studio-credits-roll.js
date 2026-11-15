/* Cinematic upward credits roll for Failure Entertainment games.
   Native scrolling keeps links and touch navigation accessible. */
(function(){
 "use strict";
 function setup(root){
  if(!root||root.dataset.feCreditsReady)return;
  const view=root.querySelector("[data-fe-credits-scroll]");
  const pause=root.querySelector("[data-fe-credits-pause]");
  const replay=root.querySelector("[data-fe-credits-replay]");
  if(!view||!pause||!replay)return;
  root.dataset.feCreditsReady="yes";
  let playing=false,raf=0,previous=0,rate=38,finished=false;
  const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function label(){pause.textContent=playing?"Pause":"Resume";pause.setAttribute("aria-pressed",String(!playing))}
  function stop(){playing=false;cancelAnimationFrame(raf);raf=0;previous=0;label()}
  function frame(time){
   if(!playing)return;
   if(root.hidden||document.hidden){stop();return}
   if(previous){
    const dt=Math.min(.06,(time-previous)/1000);
    const max=Math.max(0,view.scrollHeight-view.clientHeight);
    view.scrollTop=Math.min(max,view.scrollTop+rate*dt);
    if(max<2||view.scrollTop>=max-1){finished=true;stop();return}
   }
   previous=time;raf=requestAnimationFrame(frame);
  }
  function start(fresh){
   stop();
   if(fresh){view.scrollTop=0;finished=false}
   if(reduce){label();return}
   playing=true;label();raf=requestAnimationFrame(frame);
  }
  pause.addEventListener("click",()=>{if(playing)stop();else start(finished)});
  replay.addEventListener("click",()=>{view.scrollTop=0;finished=false;start(false)});
  for(const name of ["wheel","pointerdown","touchstart","keydown"])view.addEventListener(name,()=>{if(playing)stop()},{passive:true});
  const observer=new MutationObserver(()=>{if(root.hidden)stop();else{view.scrollTop=0;start(false)}});
  observer.observe(root,{attributes:true,attributeFilter:["hidden"]});
  if(!root.hidden){requestAnimationFrame(()=>{view.scrollTop=0;start(false)})}
  label();
 }
 function init(){for(const root of document.querySelectorAll("[data-fe-credits-root]"))setup(root)}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();