/* Failure Entertainment studio intro launcher; keeps both games independent. */
(function(){
  "use strict";
  const overlay=document.createElement("div");
  overlay.id="fe-studio-boot";
  overlay.setAttribute("role","dialog");
  overlay.setAttribute("aria-label","Failure Entertainment studio introduction");
  overlay.style.cssText="position:fixed;inset:0;z-index:2147483000;background:#050508;overflow:hidden;";
  const frame=document.createElement("iframe");
  frame.title="Failure Entertainment opening animation";
  frame.src="failure-entertainment-intro.html?embedded=1";
  frame.setAttribute("allow","autoplay");
  frame.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:0;background:#050508;";
  const skip=document.createElement("button");
  skip.type="button";skip.textContent="Skip intro";skip.setAttribute("aria-label","Skip studio introduction");
  skip.style.cssText="position:absolute;z-index:2;top:max(14px,env(safe-area-inset-top));right:max(14px,env(safe-area-inset-right));border:1px solid #8a7152;border-radius:9px;background:#211a1bbf;color:#f0d6a3;font:600 12px Arial,sans-serif;letter-spacing:.4px;padding:11px 15px;cursor:pointer;touch-action:manipulation;";
  let dismissed=false;
  function closeIntro(){
    if(dismissed)return;dismissed=true;
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
  skip.addEventListener("click",closeIntro);
  overlay.append(frame,skip);document.body.append(overlay);
})();