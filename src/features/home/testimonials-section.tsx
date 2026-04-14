import { ExternalLink, Quote } from "lucide-react";
import Image from "next/image";
import { HashFrameLines } from "@/components/ui/Icons";

const testimonials = [
  {
    quote:
      "Marcus (Nay Myo Khant) has been a highly reliable and disciplined developer. He’s the kind of person who responds fast and gets the work done without excuses. On top of that, he’s always learning—especially when it comes to AI prototyping and keeps improving his skills. Great to work with overall.",
    author: "James Win",
    role: "CEO@TalentOs",
    avatar:
      "/profiles/JamesWin.webp",
    profileUrl: "https://www.jameswin.capital/",
    profileLabel: "Website",
  },  {
    quote:"Ko Nay Myo Khant is a reliable and responsive developer. He takes strong ownership of his work, especially when the team is busy, and consistently helps move tasks forward.He is always willing to learn and improve, and he actively explores new ideas while also learning from others.He has a positive attitude, making him easy to work with. He also makes an effort to acknowledge and support his teammates, which contributes to a healthy and collaborative team environment.",
    author: "Htet Aung Lin",
    role: "Frontend Developer",
    avatar:
      "/profiles/HtetAungLin.webp",
    profileUrl: "https://htetaunglin-coder.dev/",
    profileLabel: "Website",
  },
  
  // {
  //   quote:
  //     "Strong balance between code quality and UI detail. Communication was clear and implementation was reliable.",
  //   author: "Engineering Manager",
  //   role: "Startup Team",
  //   avatar:
  //     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
  //   profileUrl: "https://www.linkedin.com/",
  //   profileLabel: "Portfolio",
  // },
  // {
  //   quote:
  //     "Great execution on responsive behavior and performance. The UX got cleaner and much easier to use.",
  //   author: "Client",
  //   role: "Portfolio Project",
  //   avatar:
  //     "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&h=160&q=80",
  //   profileUrl: "https://www.linkedin.com/",
  //   profileLabel: "Profile",
  // },
];

export function TestimonialsSection() {
  return (
    <section className="scroll-shrink-section rounded-3xl border-0 border-foreground/10 p-5 md:p-7 lg:p-8">
      <div className="mb-6 flex items-center gap-2.5 md:mb-7">
        <Quote
          className="h-4 w-4 shrink-0 text-primary md:h-5 md:w-5"
          aria-hidden="true"
        />
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
          Testimonials
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {testimonials.map((item) => (
          <article
            key={item.author + item.role}
            className="scroll-shrink-item relative z-0 overflow-visible rounded-none border-0 bg-background/70 p-5 transition-ui md:z-auto md:overflow-hidden md:rounded-2xl md:border md:border-foreground/10 md:p-6 md:hover:border-foreground/18"
          >
            <div
              className="pointer-events-none absolute inset-0 overflow-visible md:hidden"
              aria-hidden
            >
              <HashFrameLines />
            </div>
            <div className="relative z-1">
              <p className="text-theme-muted text-sm leading-relaxed md:text-base">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-4 flex gap-3 flex-row sm:items-center sm:justify-between sm:gap-4 md:mt-5">
                <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
                  <Image
                    src={item.avatar}
                    alt={`${item.author} profile`}
                    width={40}
                    height={40}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-foreground/15 md:h-10 md:w-10"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-foreground md:text-sm">
                      {item.author}
                    </p>
                    <p className="text-theme-subtle truncate text-xs md:text-sm">
                      {item.role}
                    </p>
                  </div>
                </div>
                <a
                  href={item.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-fit min-h-10 shrink-0 items-center gap-1.5 rounded-sm py-1.5 font-sans text-xs font-semibold text-primary underline decoration-primary/40 underline-offset-[5px] transition-ui hover:decoration-primary hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [-webkit-tap-highlight-color:transparent] sm:min-h-0 sm:py-0"
                >
                  {item.profileLabel}
                  <ExternalLink
                    className="h-3 w-3 shrink-0 opacity-65 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
