/** Small pieces of on-screen text that sit above the game: room names and story cards. */
export class UI {
  constructor() { this.toastEl = document.getElementById("room-toast"); this.card = document.getElementById("card"); this.cardInner = document.getElementById("card-inner"); this.t = 0; }
  toast(text, ms = 2600) { this.toastEl.textContent = text; this.toastEl.classList.add("show"); clearTimeout(this.t); this.t = setTimeout(() => this.toastEl.classList.remove("show"), ms); }
  showCard(html, done) {
    this.cardInner.innerHTML = html;
    [...this.cardInner.children].forEach((el, i) => { el.style.animationDelay = (0.5 + i * 1.1) + "s"; });
    this.card.hidden = false;
    const credits = this.cardInner.querySelector("[data-credits]");
    if (credits) credits.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("mystery-manor-show-credits"));
    });
    const btn = this.cardInner.querySelector("[data-close]");
    if (btn) btn.addEventListener("click", () => { this.card.hidden = true; if (done) done(); }, { once: true });
  }
}
