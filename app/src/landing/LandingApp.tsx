import { ArrowRight, Stethoscope, BookOpen } from "lucide-react";
import { DataField } from "./DataField";
import { AboutSection } from "./AboutSection";
import { FeaturedSection } from "./FeaturedSection";
import { PhilosophySection } from "./PhilosophySection";
import { ServicesSection } from "./ServicesSection";

const REPO_URL = "https://github.com/Mmynemious/syntha";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.13-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function LandingApp() {
  return (
    <div className="bg-black">
      <div className="relative min-h-screen overflow-hidden flex flex-col">
        <DataField className="absolute inset-0 w-full h-full" density={80} accent="255,255,255" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" />

        <nav className="relative z-20 px-6 py-6">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Stethoscope className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-lg ml-2">syntha</span>
              <div className="hidden md:flex items-center gap-8 ml-8">
                <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors">About</a>
                <a href="#approach" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Approach</a>
                <a href="#generators" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Generators</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                GitHub
              </a>
              <a
                href="/generate"
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Try it
              </a>
            </div>
          </div>
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[8%]">
          <h1
            className="font-serif-display text-6xl md:text-8xl lg:text-9xl text-white tracking-tight leading-[1.02] mb-8"
            style={{ textWrap: "balance" }}
          >
            Patients who never <em className="italic">existed.</em>
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <a
              href="/generate"
              className="liquid-glass rounded-full pl-8 pr-2 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors"
            >
              <span className="text-white text-sm font-medium">Generate synthetic patients</span>
              <span className="bg-white rounded-full p-3 text-black">
                <ArrowRight className="w-5 h-5" />
              </span>
            </a>
          </div>

          <p className="max-w-xl text-white/60 text-sm leading-relaxed px-4">
            Two generators, one goal: realistic clinical data for research, testing, and demos —
            with zero real patients anywhere in the pipeline.
          </p>
        </div>

        <div className="relative z-10 flex justify-center gap-4 pb-12">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            <GithubMark className="w-5 h-5" />
          </a>
          <a
            href={`${REPO_URL}/blob/main/docs/MCP.md`}
            target="_blank"
            rel="noopener"
            aria-label="MCP documentation"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            <BookOpen className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div id="about">
        <AboutSection />
      </div>
      <div id="approach">
        <FeaturedSection />
      </div>
      <PhilosophySection />
      <div id="generators">
        <ServicesSection />
      </div>

      <footer className="bg-black px-6 py-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
          <span>Apache 2.0 · no real patient data, ever.</span>
          <div className="flex items-center gap-6">
            <a href={REPO_URL} target="_blank" rel="noopener" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="/generate" className="hover:text-white transition-colors">
              Generators
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
