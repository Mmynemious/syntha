import { motion } from "framer-motion";
import { DataField } from "./DataField";

export function PhilosophySection() {
  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24"
        >
          Statistics <span className="font-serif-display italic text-white/40">x</span> Rules
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#050505]"
          >
            <DataField className="absolute inset-0 w-full h-full" density={60} accent="255,255,255" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="flex flex-col justify-center gap-8"
          >
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">syntha</p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Trained on a real, anonymized Turkish EHR cohort, the copula reproduces marginal
                distributions and cross-column correlations — age with labs, comorbidities with
                medications — the way they actually co-occur in a population, without ever
                storing a real patient's record.
              </p>
            </div>
            <div className="w-full h-px bg-white/10" />
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Synthea</p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                MITRE's official generator simulates a full birth-to-death life history through
                clinical rule modules — no underlying real data at all, just disease progression
                and care pathways encoded as state machines. We run it live, unmodified.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
