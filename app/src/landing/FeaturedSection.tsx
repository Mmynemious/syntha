import { motion } from "framer-motion";
import { DataField } from "./DataField";

// Stands in for "Featured video" in the original spec — same bottom-overlay
// liquid-glass card + CTA layout, but the visual is our own ambient data
// field instead of borrowed stock footage.
export function FeaturedSection() {
  return (
    <section className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="relative rounded-3xl overflow-hidden aspect-video bg-[#050505]"
        >
          <DataField className="absolute inset-0 w-full h-full" density={90} accent="120,200,190" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
              <p className="text-white/50 text-xs tracking-widest uppercase mb-3">Our approach</p>
              <p className="text-white text-sm md:text-base leading-relaxed">
                A Gaussian copula learns the joint shape of a real, anonymized cohort — not
                just individual columns, but how they move together — then Synthea-style
                clinical modules layer on encounters, medications, and care plans.
              </p>
            </div>
            <motion.a
              href="/generate"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium text-center"
            >
              Try the generators
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
