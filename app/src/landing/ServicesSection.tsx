import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DataField } from "./DataField";

interface ServiceCard {
  tag: string;
  title: string;
  description: string;
  accent: string;
  href: string;
}

const CARDS: ServiceCard[] = [
  {
    tag: "Statistical model",
    title: "Turkish Cohort Generator",
    description:
      "A Gaussian copula fitted on a real anonymized Turkish EHR cohort, layered with clinical modules. Runs entirely in your browser — pick a cohort, set parameters, download a CSV.",
    accent: "220,70,70",
    href: "/generate",
  },
  {
    tag: "Official toolchain",
    title: "Real Synthea (US)",
    description:
      "The actual MITRE Synthea Java engine, run server-side on demand. Rule-based state-machine simulation, no real patient data anywhere in the pipeline.",
    accent: "90,150,255",
    href: "/generate",
  },
];

export function ServicesSection() {
  return (
    <section className="relative bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight">Two generators</h2>
          <span className="hidden md:inline text-white/40 text-sm">One goal: no real patients</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CARDS.map((card, i) => (
            <motion.a
              key={card.title}
              href={card.href}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="group liquid-glass rounded-3xl overflow-hidden block text-white no-underline"
            >
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <DataField className="w-full h-full" density={55} accent={card.accent} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="uppercase tracking-widest text-white/40 text-xs">{card.tag}</span>
                  <span className="liquid-glass rounded-full p-2">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </span>
                </div>
                <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
