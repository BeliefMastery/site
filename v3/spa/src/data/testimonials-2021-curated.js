/**
 * 2021 testimonials — curated from author-organized source (Word export was mislabeled "2022 Testimonials.htm").
 */

function toByShort(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return `${parts[0][0]}.`;
  return `${parts[0][0]}. ${parts[parts.length - 1][0]}.`;
}

function firstSentenceExcerpt(paragraphs, max = 155) {
  const flat = paragraphs.join(" ").replace(/\s+/g, " ").trim();
  const match = flat.match(/^[^.!?]+[.!?]?/);
  let sentence = (match ? match[0] : flat).trim();
  if (sentence.length > max) {
    const cut = sentence.slice(0, max);
    const sp = cut.lastIndexOf(" ");
    sentence = `${(sp > 60 ? cut.slice(0, sp) : cut).trim()}…`;
  }
  return sentence;
}

const EXCERPT_OVERRIDES = {
  "minnie-bobyk-2021":
    "Belief Mastery has been the innermost profound life's work I have ever experienced to date.",
  "kristin-nelson-2021":
    "Our whole family unit feels more bonded and harmonious.",
  "jess-stephenson-2021":
    "Clearing my beliefs has been one of the best decisions I've ever made.",
  "emma-faehrman-2021":
    "Clearing my beliefs has been one of the best decisions I've ever made.",
  "katie-manser-2021":
    "Clearing my beliefs has been one of the best decisions I've ever made.",
  "sheree-claire-2021":
    "Confidence in communicating my needs, wants, desires and truth.",
  "greta-french-kennedy-2021":
    "It is truly life changing work. You will never be the same!",
  "renate-mueller-2021": "This is definitely next level.",
  "kelly-storum-2021":
    "Every time I complete a belief I feel so much lighter with so much more freedom.",
  "jo-battersby-2021":
    "I'm finally free to be the real me, unencumbered and ready to love and be truly loved.",
  "shannon-moulds-2021":
    "You've empowered me by giving me the tools to navigate my own inner workings.",
  "jaymi-humphreys-2021": "Wow, what a visionary!",
  "aurora-august-2021":
    "Belief Mastery is an incredible synergy of psychology, kinesiology, hypnosis and Warwick's own creative genius.",
};

/** Scrolling-ticker snippets (may differ from full-page excerpt so each voice is distinct). */
const TICKER_EXCERPT_OVERRIDES = {
  "emma-faehrman-2021":
    "I am showing up stronger in my business online and starting to share what I truly value and care about.",
  "katie-manser-2021":
    "I no longer feel obligated to agree with people to \"keep the peace\" or because I think they will like and accept me if I do.",
  "aurora-august-2021":
    "Belief Mastery is an incredible synergy of psychology, kinesiology, hypnosis and Warwick's own creative genius.",
  "jo-battersby-2021":
    "Finally I have all the pieces of the jigsaw and it's coming together well.",
};

function entry(id, by, paragraphs, opts = {}) {
  const clean = paragraphs.map((p) => p.trim()).filter(Boolean);
  const body = clean.join(" ");
  const excerpt = opts.excerpt ?? EXCERPT_OVERRIDES[id] ?? firstSentenceExcerpt(clean);
  const tickerExcerpt =
    opts.tickerExcerpt ?? TICKER_EXCERPT_OVERRIDES[id] ?? excerpt;
  return {
    id,
    sourceYear: 2021,
    by,
    byShort: opts.byShort ?? toByShort(by),
    ...(opts.role ? { role: opts.role } : {}),
    ...(body.length < 80 ? { short: true } : {}),
    excerpt,
    tickerExcerpt,
    paragraphs: clean,
  };
}

/** @type {import('./testimonials.js').testimonials} */
export const testimonials2021Curated = [
  entry("minnie-bobyk-2021", "Minnie Bobyk", [
    "Belief Mastery with Warwick has been the innermost profound life's work I have ever experienced to date!!!",
    "I began at a time where I knew change was the only way moving forward for me, and to remain living within my current limits had become far too painful.",
    "I really enjoyed the approach Belief Mastery took using storybook narrative and imaginative process to return to 'home'. This together with my bodies cells being addressed directly made sure change happened instantly on the subconscious level.",
    "Since working with Warwick I have addressed ALL of my core limiting beliefs which have held me tightly in a self imposed prison for as long as I can remember.",
    "During the first few months of working with Belief Mastery, I noticed a change in my ability to speak up for myself, to consider myself, to address and identify my needs, and to see quite clearly my repeated patterns.",
    "...Then, which was next level mind blowing!!",
    "I noticed my outer reality begin to shift! I (almost by coincidence) got a job interview and I am so grateful to say I now I have been blessed with my absolute dream job! My abundance is free flowing, my confidence is through the roof, and the energy which has always been available to me is now ably pulsating throughout my spirit..",
    "Thankyou 'Warick the Wizard' I feel like I've found 'home' turns out it was me all along",
    "Belief Mastery is like no other, and I highly recommend it to anyone who is seeking to break free from crushing, repeating, painful patterns that can impact so much on daily life.",
    "forever grateful.",
  ]),
  entry("kristin-nelson-2021", "Kristin Nelson", [
    "Working with you has epically shifted my perception of & my experience of my relationship with my partner (& has a massive flow on effect into our family unit). Where before I was feeling stuck- every interaction seemed to be triggering deep suffering in me & fuelling my feelings to \"fight or flight\"…I am now feeling more lovingly connected to my partner than ever before, I feel like I have an accountability buddy, a team mate, a lover, someone who is on my side and deeply understands me. Our intimacy has deepened, our joy of just being in each other's company has grown. I feel more loving, patient and kind with our kids. Our whole family unit feels more bonded and harmonious. When old triggers trip me up, I feel aware of them- more receptive, less reactive- still uncomfortable, yes! But, I feel I have more choice, more resources, more support to choose a more beneficial response. One that guides me toward connection, rather than into defensive separation. & this is what I desire more than anything.",
    "Thanks Warwick! Your work is so important 💜",
  ]),
  entry("jess-stephenson-2021", "Jess Stephenson", [
    "Clearing my beliefs has been one of the best decisions I've ever made. I've done emotional clearing and other work in the past but nothing that has reached this level of depth and had drastic changes that can be felt in all parts of my life. My beliefs had been holding me back from experiencing life to the fullest and has held me back from meeting not only friends that get me at a deep level but also intimate relationships. I've noticed confidence in how I speak and present myself where I lacked confidence before. I am showing up stronger in my business online and starting to share what I truly value and care about. I no longer feel obligated to agree with people to \"keep the peace\" or because I think they will like and accept me if I do. I just feel like there is a huge weight lifted off me and I don't have to fight against an invisible force that was holding me back. Thank you for this invaluable work Warwick!",
  ]),
  entry("emma-faehrman-2021", "Emma Faehrman", [
    "Clearing my beliefs has been one of the best decisions I've ever made. I've done emotional clearing and other work in the past but nothing that has reached this level of depth and had drastic changes that can be felt in all parts of my life. My beliefs had been holding me back from experiencing life to the fullest and has held me back from meeting not only friends that get me at a deep level but also intimate relationships. I've noticed confidence in how I speak and present myself where I lacked confidence before. I am showing up stronger in my business online and starting to share what I truly value and care about. I no longer feel obligated to agree with people to \"keep the peace\" or because I think they will like and accept me if I do. I just feel like there is a huge weight lifted off me and I don't have to fight against an invisible force that was holding me back. Thank you for this invaluable work Warwick!",
  ]),
  entry("katie-manser-2021", "Katie Manser", [
    "Clearing my beliefs has been one of the best decisions I've ever made. I've done emotional clearing and other work in the past but nothing that has reached this level of depth and had drastic changes that can be felt in all parts of my life. My beliefs had been holding me back from experiencing life to the fullest and has held me back from meeting not only friends that get me at a deep level but also intimate relationships. I've noticed confidence in how I speak and present myself where I lacked confidence before. I am showing up stronger in my business online and starting to share what I truly value and care about. I no longer feel obligated to agree with people to \"keep the peace\" or because I think they will like and accept me if I do. I just feel like there is a huge weight lifted off me and I don't have to fight against an invisible force that was holding me back. Thank you for this invaluable work Warwick!",
  ]),
  entry("sheree-claire-2021", "Sheree Claire", [
    "1) Confidence in communicating my needs, wants, desires and truth.",
    "2) Self mastery, a deep knowing that I can shift the narrative of my life.",
    "3) A deep understanding of the patterns of my life and the situations that trigger limiting behaviours that no longer serve me and a new confidence in moving through these life situations in new ways that support the woman I desire to become.",
    "4) I'm exploring things that I've always wanted to do and be and I'm loving it!!",
    "There is so much! 😃",
  ]),
  entry("greta-french-kennedy-2021", "Greta French-Kennedy", [
    "My life has transformed in so many areas since working with Warwick. I feel like I'm finally finding my feet on a path I've always known was meant for me, but didn't feel free to choose. He so precisely found and cleared all my limiting beliefs, and is the most intuitive man I have ever met. It is truly life changing work. You will never be the same!",
  ]),
  entry("renate-mueller-2021", "Renate Mueller", [
    "Woow time has moved so fast!",
    "It has been mind blowing for me so far and really helpful to work with you! I thought I already did a lot of beliefwork, but this is definitely next level. Love the sessions ☺️",
    "Amazing how much you cover in your work, so impressed 🙏☺️",
  ]),
  entry("kelly-storum-2021", "Kelly Storum", [
    "Every time I complete a belief I feel so much lighter with so much more freedom. This time I've remained more emotional than others. Each of them were huge but were integrated quite easily.",
  ]),
  entry("jo-battersby-2021", "Jo Battersby", [
    "The belief work has been the missing piece of a jigsaw I have been putting together for quite some time. I've done a lot of work that is all complementary. The belief work helped me get to the bottom of some things that needed explaining for it all to finally make sense. I'm doing really well. I've always been resilient but I kept repeating some patterns that led me into unhealthy relationships. I was always willing to do whatever work I needed to do to change but I could never really get to the bottom of it. I have always had a good toolkit but I wasn't clear about what I needed to use it on. Now I feel I do. Finally I have all the pieces of the jigsaw and it's coming together well. The universe continues to provide and I have always trusted that. Meeting you at The Edge and knowing intuitively that I needed to do some work with you - without even really knowing what you did - was an example of that. My time is now. It's taken almost 60 years but I feel I'm finally free to be the real me, unencumbered and ready to love and be truly loved. Most of all I can love myself, acknowledge my worth and trust my judgement.",
    "I didn't really get an opportunity to explain it all to you and what I have written here is only the briefest of overviews. Hopefully it makes sense.",
    "Thank you for your part in helping me discover the missing pieces of the puzzle so that I can keep putting it together. I have the tools. I have great support. And I have always had the willingness and dedication to take action and follow through to completeness. I know it's a beautiful masterpiece. 🙏💜",
  ]),
  entry("shannon-moulds-2021", "Shannon Moulds", [
    "I've been having heaps of emotion bubbling up in the last two days. I've been sinking into it and working on understanding it from different angles. This afternoon something really shifted for me. I feel like your work and your methods of guiding people through their inner landscapes has just solidified and integrated on an entire new level in my being. I realised as I was journaling that I am now able to navigate my inner landscape (as you guide us through in the shadows workshop). As I was navigating these shadowy parts of myself, It felt less daunting then ever, I felt curious about my inner workings and empowered to alchemise them. I've realised that you've helped me to deepen the relationship I have with myself and enhanced my ability to alchemise parts of my shadow self.",
    "Your work is so powerful and I am so grateful that you're sharing this with the world. You've empowered me by giving me the tools to navigate my own inner workings. I think that might just be the best gift you can give.",
    "Thank you so much 🙏🏼❤️",
  ]),
  entry("jaymi-humphreys-2021", "Jaymi Humphreys", [
    "Wow, what a visionary!",
    "As someone who \"therapist hopped\" in their early twenties and has always been a seeker of knowledge and understanding, I felt a bit fed up with the therapeutic community. Clinical rigidity and the power imbalance between client and therapist literally made me gag, so much so that I got so fed up that I became a psychotherapist myself.",
    "My hope was that I would be able to work out a way through the lifetime of roadblocks that I made for myself in the search for safety and security. Through my studies, I found systems and theories that projected that the \"work\" on these issues would take a lifetime to uncover and heal.",
    "The experience with Belief Mastery has been entirely life-changing and unforgettable! What felt like a lifetime of searching for someone who understands and who can get to the crux of the patterns of behaviour that I felt stunted me and kept me small turned out to be four phone conversations that radically transformed my life.",
    "Warwick blew me away from the very first call and assured me repeatedly that I was in safe and highly capable hands. His storytelling, insight, and knowledge is utterly groundbreaking and genuinely beggars belief!",
    "When you uncover your beliefs, the feeling you get is difficult to put in a few words; it's almost like a veil has been lifted, and your soul and cells dance together in unison for the first time since birth.",
    "Thank you, Warwick, for being the absolute visionary and excellent guide for us all in the therapeutic community; you are incredible! Thank you for this profound work. It feels like I have been propelled light years forward in my personal growth, and I have you to thank.",
  ]),
  entry("aurora-august-2021", "Aurora August", [
    "Testimonial for Belief Mastery technique, by Aurora August on this 15th day of October 2021. This is my true and honest experience which I offer in good faith. It may be reproduced whole or in part by Warwick Marshall only, for whatever purpose they see fit.",
    "Belief Mastery is an incredible synergy of psychology, kinesiology, hypnosis and Warwick's own creative genius. He has found a key that can unlock the human mind on both conscious and unconscious levels. This work can neutralise repeated destructive patterns in life and propel us forward into empowered, conscious living.",
    "I come from a relatively unstable family, and I'm aware that this has limited my capacity for healthy relationships, as well as holding me back from pursuing my true purpose. I've attended to this in many ways over the years, through therapy and self help.",
    "When I started working with Belief Mastery, it dawned on me that everything I had done up until then had been fragmented. I'd been taking little parts of the puzzle and piecing them together, and my journey towards wholeness sure was taking a while.",
    "Warwick's contribution to my wellbeing has been phenomenal. I very quickly had all the pieces in my hands and I could see how they needed to fit together. As I put each in its place I saw the overall picture for the first time, with crystal clarity.",
    "Understanding my own subconscious drives has enabled me to reframe my experiences in such a way that I can view my own history with compassion and forgiveness. The transition I've been undergoing is profound.",
    "I feared I would be stuck in my own negative patterns for the rest of my life. But I no longer feel trapped by my past, instead I have hope for a future that is my own creation. I know I have already altered my life story for the better and that I will continue to do so. I can see my own path to liberation because Belief Mastery is the tool that maps it out.",
    "It's obvious that Warwick has spent many years observing human behaviour and thinking deeply about what it takes for people to reach their highest potential. By applying his gifts to the domain of personal growth, he has developed a professional programme that is effective and thorough.",
    "Belief Mastery is a tool for recalibration and attunement. I highly recommend it to anyone who truly seeks self resolution. The flow on effects of this work are resounding and have application in all areas of life. Be prepared to transform.",
  ], { role: "October 2021" }),
];
