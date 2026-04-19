import { Quote } from "lucide-react";
import { TestimonialCard, type TestimonialItem } from "@/features/home/testimonial-card";

const testimonials: TestimonialItem[] = [
  {
    quote:
      "Marcus (Nay Myo Khant) has been a highly reliable and disciplined developer. He’s the kind of person who responds fast and gets the work done without excuses. On top of that, he’s always learning—especially when it comes to AI prototyping and keeps improving his skills. Great to work with overall.",
    author: "James Win",
    role: "CEO@TalentOs",
    avatar: "/profiles/JamesWin.webp",
    profileUrl: "https://www.jameswin.capital",
    profileLabel: "Website",
  },
  {
    quote:
      "Ko Nay Myo Khant is a reliable and responsive developer. He takes strong ownership of his work, especially when the team is busy, and consistently helps move tasks forward.He is always willing to learn and improve, and he actively explores new ideas while also learning from others.He has a positive attitude, making him easy to work with. He also makes an effort to acknowledge and support his teammates, which contributes to a healthy and collaborative team environment.",
    author: "Htet Aung Lin",
    role: "Frontend Developer",
    avatar: "/profiles/HtetAungLin.webp",
    profileUrl: "https://htetaunglin-coder.dev",
    profileLabel: "Website",
  },
  {
    quote:
      "Marcus (Nay Myo Khant) is a proactive and reliable developer with strong backend skills and a wide range of technical knowledge. He consistently takes ownership of his work and delivers with professionalism. He’s always eager to learn and continuously improves himself, especially by exploring new technologies. His positive attitude makes collaboration easy and productive. Overall, he’s a dependable teammate and a valuable asset to any team.",
    author: "Sai Myo Myat",
    role: "Mobile Developer",
    avatar: "/profiles/SaiMyoMyat.webp",
    profileUrl: "https://saimyomyat.dev",
    profileLabel: "Website",
  },
  {
    quote:
      "I worked with Ko NMK while serving as Technical Department Lead at TalentOS, where he contributed as a Backend Developer. He demonstrated strong proficiency in backend development, particularly in designing and maintaining scalable APIs, optimizing database performance, AI integration and ensuring system reliability. He wrote maintainable code and showed a solid understanding of system architecture and best practices, including security and performance considerations.And, beyond technical skills, Ko NMK stood out for his problem-solving mindset and ownership of tasks. He was proactive in identifying issues, proposing effective solutions, and collaborating with cross-functional teams, including frontend developers and product stakeholders, to deliver high-quality results, collaborate effectively with cross-functional teams. I particularly appreciate the ability to take ownership of complex tasks and deliver efficient, scalable solutions, especially can-do mindset. He would be a valuable addition to any team looking for a reliable, skilled, and driven backend developer.",
    author: "Moe Pwint Phyu",
    role: "Technical Department Lead",
    avatar: "/profiles/MoePwintPhyu.webp",
    profileUrl: "https://moepwintphyu.base44.app",
    profileLabel: "Website",
  },
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
          <TestimonialCard
            key={item.author + item.role}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}
