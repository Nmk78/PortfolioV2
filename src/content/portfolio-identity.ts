/**
 * Portfolio copy derived from bio — single source for hero, story, and timeline.
 */

export interface StoryChapter {
  title: string
  /** Short line shown large — editorial hook */
  pull: string
  body: string
}

/** Plain string or linked org — use in hero segments */
export type HeroSegment = string | { readonly href: string; readonly label: string }

/** Official sites for names that appear in the hero — swap URLs if your org uses another domain */
export const organizationLinks = {
  talentOS: "https://www.talentosapp.com/",
  polytechnicMyeik: "https://www.pumyeik.edu.mm/",
} as const

/** Recruiter view — name + one line (links + stack). No extra headlines or grids. */
export const heroEmployer = {
  badge: "Full-stack Dev",
  /** Single scannable line under the name */
  lead: "Hi. I'm",
  metaLine: [
    " Full-stack Dev @ ",
    { href: organizationLinks.talentOS, label: "TalentOS" },
    " • ",
    " Semester 7 @ ",
    { href: organizationLinks.polytechnicMyeik, label: "PU (Myeik)" },
    ".",
  ] as const satisfies readonly HeroSegment[],
}

/** Default view — one tight line + story below */
export const heroNormal = {
  badge: "",
  lead: "Hi. I'm",
  summaryLead: [
    " I build Scalable Backend Systems and Management Dashboards @ ",
    { href: organizationLinks.talentOS, label: "TalentOS" },
    " . ",
  ] as const satisfies readonly HeroSegment[],
}

export const identityTagline =
  "Ride the fast tools. Stay bold enough to pop the hood."

// export const storyChapters: StoryChapter[] = [
//   {
//     title: "Break it on purpose",
//     pull: "“Does it work?” was never enough.",
//     body: "Kid-me wasn’t subtle: poke it, stress it, see what breaks. I almost went mechanical like my dad—gears and torque still hit different. Same itch, different century: I want the mechanism, not the brochure.",
//   },
//   {
//     title: "The magnet that hooked me",
//     pull: "Textbook said “wire + current = magnet.” Cool. Why?",
//     body: "Thirteen, junk drawer full of motors and dead batteries. The book skipped the why, so I built an electromagnet anyway. When it actually pulled metal, the high wasn’t the party trick—it was finally seeing the bit the paragraph left out.",
//   },
//   {
//     title: "Paper phase",
//     pull: "Lived a hundred lives before I picked a lane.",
//     body: "Grade seven I inhaled books—arguments, fiction, weird ideas. I argued with authors in my head. Thought I might write for real. Didn’t stick, but it left me allergic to lazy takes and “we’ve always done it this way” in any job.",
//   },
//   {
//     title: "Security, then software",
//     pull: "Less “how do I get in,” more “who built this door.”",
//     body: "Cybersecurity grabbed me around fifteen—not for the movie-hacker cosplay, but because systems had rules worth mapping. The obsession slid from breaking paths to building them. Code became the obvious next playground.",
//   },
//   {
//     title: "Right now",
//     pull: "Still asking the magnet question—just on bigger toys.",
//     body: "Semester 7 at Polytechnic (Myeik), full-stack Dev at TalentOS: React, Next.js, RN + Expo, Firebase, whatever’s honest for the job. I mess with RAG chatbots, automation, side experiments. Mentoring is basically: use the framework, then go read what it’s hiding. Syntax is cheap; pattern recognition isn’t.",
//   },
// ]

export const storyChapters = [
  {
    title: "I liked breaking things",
    pull: "“Does it work?” wasn’t enough for me.",
    body: "When I was a kid, I’d mess with anything I could touch. Not just to use it—but to see what happens if I push it a bit too far. I thought I’d become a mechanical engineer like my dad, but honestly… I just liked understanding how things worked.",
  },
  {
    title: "That one moment",
    pull: "Wait… why does this even work?",
    body: "Around 13, I was playing with motors, wires, batteries—random stuff. I made a simple electromagnet and it actually worked. That moment stuck. Not because it was cool, but because I finally *got* something the textbook didn’t explain properly.",
  },
  {
    title: "I read a lot too",
    pull: "At one point, I thought I’d be a writer.",
    body: "There was a phase where I read a ton—stories, ideas, random topics. I liked thinking deeply about things and questioning stuff. I didn’t become a writer, but that habit stayed with me.",
  },
  {
    title: "Then came security",
    pull: "Not hacking… understanding.",
    body: "Around 15, I got into cybersecurity. Not the flashy kind—but more like: how do systems actually work, and where do they break? That curiosity slowly pushed me toward building instead of just testing.",
  },
  {
    title: "Now I just build things",
    pull: "Same curiosity, just bigger tools.",
    body: "Now I’m a full-stack developer. I build apps, experiment with ideas, and sometimes help others figure things out too. I still have that same question in my head all the time: “okay… but how does this really work?”",
  },
]

export const timelineItems = [
  {
    title: "Full-Stack Developer",
    company: "TalentOS",
    timeFrame: "2024 - Present",
    description:
      "Ship web and mobile features end-to-end, wire backend flows, and help juniors break through architecture and debugging roadblocks.",
  },
  {
    title: "Computer Engineering Student (Semester 7)",
    company: "Polytechnic University (Myeik)",
    timeFrame: "2023",
    description:
      "Run coursework in parallel with production delivery, turning classroom theory into real systems and maintainable product decisions.",
  },
  {
    title: "Security to Builder Pivot",
    company: "Self-Directed Track",
    timeFrame: "2022 - 2024",
    description:
      "Moved from exploring how systems fail into designing how they should be built: cleaner boundaries, safer defaults, better developer ergonomics.",
  },
  {
    title: "Hands-On Foundations",
    company: "Curiosity Lab",
    timeFrame: "2020",
    description:
      "Started with physical tinkering and experimentation. Built a habit of learning by touching the mechanism first, then studying the theory.",
  },
] as const

export const techStacks = [
  "Next.js",
  // "React",
  // "React Native",
  "Expo",
  "TypeScript",
  "Tailwind",
  "Node.js",
  "Firebase",
  "Convex",
  // "Supabase",
  "MongoDB",
  "Nest.js",
  // "PostgreSQL",
  // "Framer Motion",
  // "GSAP",
]

export const valueProps = [
  {
    title: "Startup Mode",
    desc: "UI, APIs, data, deploy—you get one person who won’t vanish when the edge case shows up on mobile.",
  },
  {
    title: "Fast where it shows",
    desc: "Snappy interfaces, sane bundles, no mystery lag. When something’s slow, I chase it past “it’s React’s fault.”",
  },
  {
    title: "Talk like a human",
    desc: "Plain updates for PMs, real feedback for juniors. No gatekeeping, no pretending the stack is magic.",
  },
] as const
