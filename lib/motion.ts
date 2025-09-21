import { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] } },
};

export const staggerChildren: Variants = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

export const cardHover: Variants = {
  rest: { scale: 1, y: 0, transition: { duration: 0.15 } },
  hover: { scale: 1.02, y: -2, transition: { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] } },
};

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] } },
};
