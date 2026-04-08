"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mail, Phone, Send } from "lucide-react";
import { Github } from "@/components/ui/Icons";
import { MagneticLink } from "@/components/ui/MagneticLink";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".contact-title", {
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
      });
      gsap.from(".contact-animate", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full space-y-20 pb-20 pt-10 min-h-screen">
      <header className="mb-16 text-center lg:text-left flex flex-col items-center lg:items-start relative">
        <h1 className="contact-title text-[5rem] md:text-[8rem] lg:text-[10rem] font-black leading-none tracking-tighter mb-6 text-foreground opacity-90">
          HELLO.
        </h1>
        <p className="contact-animate text-2xl md:text-4xl text-zinc-500 dark:text-zinc-400 font-light max-w-3xl lg:max-w-4xl leading-tight">
          Have an idea or a project in mind? Let&apos;s build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-medium">extraordinary</span> together.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* Contact Links */}
        <div className="lg:col-span-4 space-y-6 flex flex-col contact-animate">
          <MagneticLink className="w-full">
            <a href="mailto:naymyokhant78@gmail.com" className="w-full group hover-target block">
              <GlassCard hoverGlow={false} className="p-8 flex flex-col gap-6 hover:bg-foreground/5 transition-colors duration-700 border-foreground/10 hover:border-primary/30 shadow-xl">
                <div className="bg-primary/5 p-4 rounded-full text-primary w-fit transition-colors duration-700">
                  <Mail className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-2">Email</p>
                  <p className="font-semibold text-lg text-foreground">naymyokhant78@gmail.com</p>
                </div>
              </GlassCard>
            </a>
          </MagneticLink>

          <MagneticLink className="w-full">
            <a href="tel:+959459133418" className="w-full group hover-target block">
              <GlassCard hoverGlow={false} className="p-8 flex flex-col gap-6 hover:bg-foreground/5 transition-colors duration-700 border-foreground/10 hover:border-accent/30 shadow-xl">
                <div className="bg-accent/5 p-4 rounded-full text-accent w-fit transition-colors duration-700">
                  <Phone className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-2">Phone</p>
                  <p className="font-semibold text-lg text-foreground">+95 945 913 3418</p>
                </div>
              </GlassCard>
            </a>
          </MagneticLink>

          <MagneticLink className="w-full">
            <a href="https://github.com/Nmk78" target="_blank" rel="noreferrer" className="w-full group hover-target block">
              <GlassCard hoverGlow={false} className="p-8 flex flex-col gap-6 hover:bg-foreground/5 transition-colors duration-700 border-foreground/10 hover:border-foreground/30 shadow-xl">
                <div className="bg-foreground/5 p-4 rounded-full text-foreground w-fit transition-colors duration-700">
                  <Github className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-2">Social</p>
                  <p className="font-semibold text-lg text-foreground">github.com/Nmk78</p>
                </div>
              </GlassCard>
            </a>
          </MagneticLink>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-8 contact-animate">
          <GlassCard hoverGlow={false} className="p-8 md:p-12 relative overflow-hidden group shadow-2xl border-foreground/10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            
            <form className="space-y-10 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4 relative group/input">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-zinc-500">Your Name</label>
                  <input 
                    id="name" 
                    className="w-full bg-transparent border-b border-foreground/20 py-4 text-foreground text-xl placeholder-zinc-400 focus:outline-none transition-all rounded-none hover-target" 
                    placeholder="John Doe" 
                  />
                  <div className="h-[1px] w-0 bg-primary absolute bottom-0 left-0 transition-all duration-700 ease-out group-focus-within/input:w-full"></div>
                </div>
                <div className="space-y-4 relative group/input">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-zinc-500">Email Address</label>
                  <input 
                    id="email" 
                    type="email"
                    className="w-full bg-transparent border-b border-foreground/20 py-4 text-foreground text-xl placeholder-zinc-400 focus:outline-none transition-all rounded-none hover-target" 
                    placeholder="john@example.com" 
                  />
                  <div className="h-[1px] w-0 bg-primary absolute bottom-0 left-0 transition-all duration-700 ease-out group-focus-within/input:w-full"></div>
                </div>
              </div>
              <div className="space-y-4 relative group/input pt-4">
                <label htmlFor="message" className="text-xs uppercase tracking-widest font-bold text-zinc-500">Your Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full bg-transparent border-b border-foreground/20 py-4 text-foreground text-xl placeholder-zinc-400 focus:outline-none transition-all resize-none rounded-none hover-target leading-relaxed" 
                  placeholder="Tell me about your project..." 
                />
                <div className="h-[1px] w-0 bg-primary absolute bottom-[5px] left-0 transition-all duration-700 ease-out group-focus-within/input:w-full"></div>
              </div>
              
              <div className="pt-8">
                <MagneticLink>
                  <button 
                    type="button"
                    className="group relative inline-flex items-center justify-center gap-4 bg-foreground text-background font-semibold py-5 px-10 rounded-full overflow-hidden hover-target transition-all duration-500 hover:shadow-lg"
                  >
                    <span className="relative z-10 flex items-center gap-3 tracking-wide">
                       Send Message <Send className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 duration-700 ease-out transition-all" />
                    </span>
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-700 ease-in-out z-0"></div>
                  </button>
                </MagneticLink>
              </div>
            </form>
          </GlassCard>
        </div>
        
      </div>
    </div>
  );
}
