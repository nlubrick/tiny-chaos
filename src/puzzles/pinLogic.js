/**
 * "The Sluice Gate" rules (no drawing).
 *   water sits above pin A, hot coals between A and B, the winch rope below B.
 *   pin D opens the channel from the bottom chamber to the float; pin C holds a stone above the float.
 * Water must reach the float to lift the gate. Coals that fall while still hot burn the rope. The stone jams the float.
 * pull() returns { events: [...], status: "ok" | "fail" | "win", why }.
 */
export const PINS = ["A", "B", "C", "D"];
export const fresh = () => ({ pulled: {}, water: "top", coals: "hot", status: "ok" });
export function pull(s, pin) {
  if (s.status !== "ok" || s.pulled[pin]) return { events: [], status: s.status };
  s.pulled[pin] = true; const ev = [];
  const done = (status, why) => { s.status = status; return { events: ev, status, why }; };
  if (pin === "C") { ev.push("stone"); return done("fail", "The stone drops into the float chamber and jams it solid."); }
  if (pin === "B" && s.coals === "hot") { ev.push("burn"); return done("fail", "The coals are still hot. They land on the winch rope and it burns through."); }
  if (pin === "A") { ev.push("quench"); s.coals = "out"; s.water = "mid"; }
  if (s.water === "mid" && s.pulled.B) { ev.push("toLow"); s.water = "low"; }
  if (s.water === "low" && s.pulled.D) { ev.push("toFloat"); s.water = "float"; return done("win"); }
  if (pin === "D" && s.water !== "low") ev.push("channel");
  return done("ok");
}
