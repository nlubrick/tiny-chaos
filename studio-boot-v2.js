/* Failure Entertainment studio intro launcher; keeps both games independent. */
(function(){
  "use strict";
  // Credit previews open directly, without playing the studio animation.
  if(new URLSearchParams(location.search).has("credits"))return;
  const overlay=document.createElement("div");
  overlay.id="fe-studio-boot";
  overlay.setAttribute("role","dialog");
  overlay.setAttribute("aria-label","Failure Entertainment studio introduction");
  overlay.style.cssText="position:fixed;inset:0;z-index:2147483000;background:#050508;overflow:hidden;";
  const frame=document.createElement("iframe");
  frame.title="Failure Entertainment opening animation";
  frame.src="failure-entertainment-intro-v2.html?embedded=1";
  frame.setAttribute("allow","autoplay");
  frame.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:0;background:#050508;";
  let dismissed=false;
  let fallbackTimer=null;
  function closeIntro(){
    if(dismissed)return;dismissed=true;
    clearTimeout(fallbackTimer);
    window.removeEventListener("message",onMessage);
    frame.src="about:blank";overlay.remove();
    window.__feStudioIntroActive=false;
    window.dispatchEvent(new Event("failure-studio-intro-closed"));
  }
  function onMessage(event){
    if(event.origin!==location.origin || event.source!==frame.contentWindow)return;
    if(event.data && event.data.type==="failure-studio-intro-completed")closeIntro();
  }
  window.__feStudioIntroActive=true;
  window.addEventListener("message",onMessage);
  overlay.append(frame);document.body.append(overlay);
  // Prevent a broken connection from trapping players behind an intro screen.
  fallbackTimer=setTimeout(closeIntro,12000);
})();