/** Every line of Chapter One. face: 0 Mallow, 1 Fern, "wisp" Miss Wisp, none for narration. */
const M = t => ({ who: "Mallow", face: 0, text: t });
const F = t => ({ who: "Fern", face: 1, text: t });
const W = t => ({ who: "Miss Wisp", face: "wisp", text: t });
const N = t => ({ who: "", text: t });

export const SCRIPTS = {
  intro: [
    N("Thorne House. Twelve minutes past midnight, and the storm has not let up."),
    M("She was right here. Reading by the fire, same as every night."),
    M("I blinked. Cats are allowed to blink. And when I looked again her chair was empty."),
    M("Nobody came through that door. I was watching it. I am always watching it."),
    M("So. A librarian does not simply vanish. Somebody has to find out where she went, and I appear to be the only one awake.")
  ],
  scrape: [
    N("Somewhere behind you, stone grinds against stone. Then nothing."),
    M("That came from the fireplace. Fireplaces should not make that noise."),
    M("One thing at a time. Her desk first. She kept everything that mattered in that desk.")
  ],
  hearth: [
    M("Her portrait, over the mantel. She always said it made her look stern. It does."),
    M("Warm. And there is mud on the hearthstones. She never wore her boots in here."),
    M("Someone has drawn a mark in the soot. A crescent moon and a small star."),
    M("The stone beside the fire is colder than the rest. I do not like that I noticed that.")
  ],
  hearthAfter: [M("The fire is still going. Whoever left through that wall did not stop to bank it.")],
  deskBefore: [M("Up we go. If she left me anything, it will be somewhere in this mess.")],
  deskFound: [
    M("A key I have never seen her use. And half a letter in her handwriting."),
    N("\"...not safe in the house any longer. He has asked after the star chart twice now. If the clock should strike thir—\""),
    M("The rest is torn away. Her watch has stopped as well. Twelve minutes past twelve."),
    M("The key smells of the door to the West Hall. Let us see what it thinks of me.")
  ],
  deskAfter: [M("Nothing else here but ink and biscuit crumbs. The watch still says twelve past twelve.")],
  doorLocked: [M("Locked. And the lock is humming, which locks should not do. She kept her keys in the desk.")],
  doorWard: [
    M("The key turns. The door does not care."),
    M("There is a ward on it. Her work, I know the smell. Line up the charms and it should come apart.")
  ],
  doorOpens: [
    N("The ward lets go like a held breath. The bolt slides back by itself."),
    M("She locked this from the library side. To keep something out, or to keep me in?")
  ],
  hallFirst: [
    F("Mallow? That you, cat? Thought I heard the library door."),
    M("He cannot understand a word I say. He talks to me anyway. I respect that.")
  ],
  frontDoor: [
    M("The front door. Fern seals it with wax every night at ten."),
    M("The seal is whole. Not a crack in it. Nobody left this way, and nobody came in.")
  ],
  fernMeet: [
    F("She's gone, isn't she. I felt it. Whole house went quiet, like it does before snow."),
    F("Front door's still sealed. I pressed that wax myself and it has never once been broken. Not in thirty years."),
    F("But look at the floor. Mud. Garden mud, tracked right through my hall toward the library. And these aren't my boots."),
    F("And the old clock's stopped. That clock has not stopped since before I was born. The hands are sitting somewhere they have no business being."),
    F("Mistress always said the clock keeps the house's true time. Said if ever things went wrong, I should put it right. I never did work out what she meant."),
    M("I think I might. Her watch stopped at twelve past twelve.")
  ],
  fernHint: [
    F("The clock, cat. Something's jammed in the works, and the hands are all wrong."),
    F("If you can free the gears, set it to the minute things went bad. Whenever that was.")
  ],
  fernAfter: [
    F("Thirteen. I counted. That clock has twelve numbers on it and it struck thirteen."),
    F("And that noise from the library after. You go and look, Mallow. My knees aren't built for secret anything.")
  ],
  catPortrait: [M("She had my portrait painted. I sat still for very nearly a minute. The artist asked for danger money.")],
  clockEarly: [M("The grandfather clock. Not ticking. It has ticked every second of my life, and now it is not.")],
  clockBefore: [M("The case is unlatched. Gears, a pendulum, and something stuck where it should not be.")],
  clockAfter: [M("Ticking again. It sounds pleased with itself.")],
  afterClock: [
    M("The fireplace. There is a way through the wall beside the fireplace."),
    M("Fern never broke his seal because nobody used the door. They used that.")
  ],
  galFirst: [
    N("The candles lean away from something you cannot see. Then you can see it."),
    W("Oh! A visitor. And me not even properly manifested.")
  ],
  wispMeet: [
    W("Before you say anything, I did not take her. Everyone always blames the ghost. A vase falls over in Sussex and somehow it is my fault."),
    W("I am Miss Wisp. I have haunted this gallery since before it had paintings worth looking at."),
    W("I did see someone tonight, mind. A living someone. Muddy boots, long coat, standing at the library fireplace as if it owed them money."),
    W("And then stone, sliding. And then your librarian was not where she had been."),
    M("She saw more than that. Her edges go blurry when she is leaving something out.")
  ],
  wispHint: [
    W("You want the clock, kitten. She was forever fussing with that clock."),
    W("I could tell you why. I could tell you a great many things. But it is so much more fun to watch you work it out.")
  ],
  wispAfter: [
    W("Thirteen chimes! Oh, I have not heard thirteen in sixty years. That is the sound of a door that is not a door."),
    W("Go carefully down there. She went of her own... no. No, I have said too much. Shoo.")
  ],
  slashed: [
    M("Every Thorne who ever owned the house, in a row. Except this one."),
    M("Somebody cut the face out of the canvas. The nameplate has been scratched down to bare brass."),
    M("Almost bare. I can still make out a C.")
  ],
  chart: [
    M("This is where she kept the star map. I used to sleep on it. She used to mind."),
    M("The glass is gone and so is most of the chart. One corner left, three stars and a line between them."),
    M("It was cut out neatly. Her own scissors are still on the table. She took it herself.")
  ],
  scope: [M("Pointed at the garden wall, not the sky. Someone has been watching the house from in here. Or watching for someone coming.")],
  passage: [
    M("Steps, going down. Cold air, and blue light a long way below."),
    M("Her lavender soap. She came this way. And over the top of it, boot leather and wet earth."),
    M("There is a calling card on the first step. No name. Just two words in gold."),
    N("\"THE COLLECTOR\"")
  ],
  passageAgain: [M("Still dark. Still cold. Still smells of her.")],

  // ---------------- Chapter Two: Beneath the Hearth ----------------
  down: [
    N("Forty-one steps. You counted. The fire's warmth gives out at the ninth."),
    M("Older than the house, this. The stones are a different colour and nobody has dusted since the Flood."),
    M("Two sets of prints in the grit. Her slippers, light and quick. And boots, heavier, coming after.")
  ],
  shawl: [
    M("Her shawl. The purple one she wears when the library is cold."),
    M("Hung on the hook. Not dropped, not torn. Hung up, neatly, the way she hangs everything."),
    M("People who are being dragged off do not stop to hang up their shawls.")
  ],
  gateShut: [M("An iron gate, shut tight. There is a float and a chain behind it, and no water to lift the float.")],
  sluiceBefore: [M("Pins, pipes, a tank of water and a pan of coals. Somebody built this to keep clumsy people out. I am not clumsy.")],
  sluiceDone: [
    N("Water finds the float. The chain goes taut, and the gate lifts itself into the ceiling."),
    M("She knew the trick of it. The boots did not. There are scorch marks on that rope older than tonight.")
  ],
  sluiceAfter: [M("Still dripping. The gate is staying up, for now.")],
  camp: [
    M("A bedroll. A lantern, cold. Boots with garden mud to the ankle."),
    M("Someone has been living under my house. For weeks, by the smell. Tinned fish and candle wax."),
    M("A map of the manor, pinned up with a knife. The library is circled in red. So is the attic."),
    N("In the corner of the map, in neat copperplate: \"Property of C. Thorne.\"")
  ],
  wispBelow: [
    W("Oh, don't look so startled. Floors are a suggestion."),
    W("You found his little nest, then. I had rather hoped you wouldn't have to."),
    M("His."),
    W("Cornelius Thorne. The face cut out of my gallery. The family said he drowned abroad, forty years ago, and good riddance."),
    W("He did not drown. He collected. Maps, instruments, anything that pointed at something valuable. They started calling him the Collector, and then they stopped calling him anything at all."),
    W("He came back for the star map, kitten. Your librarian has known for a month.")
  ],
  wispBelowAgain: [W("I can go through the crates. You, regrettably, cannot. Push.")],
  jamBefore: [M("Crates, floor to ceiling, shoved across the aisle from the far side. Someone did not want to be followed.")],
  jamDone: [M("There. A cat-sized gap is still a gap."), M("These were stacked from the far side. By someone small, careful, and in a hurry. Hers, not his.")],
  vaultFirst: [
    N("The blue light has a source after all."),
    M("Stars. Someone has painted the whole sky on the ceiling, and built a brass machine underneath to turn it."),
    M("There is a note on the reading stand. I know that handwriting.")
  ],
  note: [
    N("\"Mallow. If anyone finds this it will be you, because you never could leave a closed door alone.\""),
    N("\"I was not taken. I want you to know that first. I heard him on the stair and I went ahead of him.\""),
    N("\"The map cannot stay in the house, and I could not let him watch where I took it. The orrery will show you. It will show him too, if he gets this far, so I have put the stars out.\""),
    N("\"Stay with Fern. Do not follow me. I mean it this time. —E.\""),
    M("She means it every time.")
  ],
  orreryEarly: [M("A brass machine with seven dead lamps. It wants something. The note first.")],
  orreryBefore: [M("Seven stars, all tied together. She put them out. I can put them back.")],
  orreryDone: [
    N("The seven lamps catch. The rings begin to turn, slowly, and then not slowly."),
    N("A single thread of light crosses the painted sky and stops on the eastern wall, on a small square tower drawn among the garden trees."),
    M("The old observatory. At the bottom of the garden, past the wall. That is where she took it.")
  ],
  above: [
    N("Overhead, very far away, something heavy falls. Then Fern's voice, shouting a name that is not yours."),
    M("He is not down here. He never needed to come down here. He was waiting for someone to light it for him."),
    M("And I have just shown him the way.")
  ],
  orreryAgain: [M("Still pointing at the observatory. I cannot make it stop.")]
};

export const CUTSCENE_LINES = {
  passage: [N("Thirteen chimes roll through the house. In the library, something answers.")]
};

/** Full-screen story cards (HTML). */
export const CARDS = {
  ending: `<span class="kicker">End of Chapter One</span>
    <p>The librarian did not vanish. She left, by a door nobody was meant to know about.</p>
    <p>Someone else knew about it too.</p>
    <h3>Who is <em>the Collector</em>?</h3>
    <p class="fine">End of Chapter One. Chapter Two: Beneath the Hearth. The passage beside the fireplace is open.</p>
    <div class="fe-chapter-acknowledgment">A FAILURE ENTERTAINMENT PRODUCTION <span>6/10. Good enough.</span></div>
    <button class="ghost" type="button" data-credits>View chapter credits</button>
    <button class="gold" type="button" data-close>Go on</button>`,
  ending2: `<span class="kicker">End of Chapter Two</span>
    <p>She was never taken. She ran, to keep the map ahead of him.</p>
    <p>Now the Collector knows where she ran to.</p>
    <h3>Reach <em>the observatory</em> first.</h3>
    <p class="fine">End of Chapter Two. Chapter Three: The Garden Wall, is coming in a future update.</p>
    <div class="fe-chapter-acknowledgment">A FAILURE ENTERTAINMENT PRODUCTION <span>6/10. Good enough.</span></div>
    <button class="ghost" type="button" data-credits>View chapter credits</button>
    <button class="gold" type="button" data-close>Keep exploring</button>`
};
