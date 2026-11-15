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
  passageAgain: [M("Still dark. Still cold. Still smells of her. I am going down there, just as soon as someone tells me what is at the bottom.")]
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
    <p class="fine">Chapter Two: Beneath the Hearth, is not built yet.</p>
    <button class="gold" type="button" data-close>Keep exploring the manor</button>`
};
