"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const logos = [
  {
    id: "xcentrique",
    src: "/brand_logos/xcentrique%20media.webp",
    alt: "Xcentrique Media",
    width: 244,
    height: 54,
  },
  {
    id: "amra-elma",
    src: "/brand_logos/amra%20and%20elma.svg",
    alt: "Amra and Elma",
    width: 262,
    height: 62,
  },
  {
    id: "tartu",
    src: "/brand_logos/UT_logo.svg",
    alt: "University of Tartu",
    width: 298,
    height: 54,
  },
  {
    id: "loveoutsource",
    src: "/brand_logos/loveoutsource.png",
    alt: "LoveOutsource",
    width: 283,
    height: 58,
  },
  {
    id: "istarthub",
    src: "/brand_logos/istarthub.webp",
    alt: "iStartHub",
    width: 220,
    height: 60,
  },
  {
    id: "balance-core",
    src: "/brand_logos/balanceandcore.jpg",
    alt: "Balance and Core",
    width: 268,
    height: 60,
  },
];

export default function ClientLogos() {
  return (
    <section className="logo-strip" aria-label="Trusted client logos">
      <div className="logo-viewport" style={{ overflow: "hidden" }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.52 }}
          className="logo-track"
        >
          {[0, 1].map((setIndex) => (
            <div
              key={`set-${setIndex}`}
              className="logo-marquee-segment"
              aria-hidden={setIndex === 1}
            >
              {logos.map((logo, index) => (
                <div
                  key={`${logo.id}-${setIndex}-${index}`}
                  className="logo-item"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="logo-image"
                    sizes="(max-width: 620px) 140px, 180px"
                    loading={setIndex === 0 && index < 2 ? "eager" : "lazy"}
                    quality={100}
                  />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
