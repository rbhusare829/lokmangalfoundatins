import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

const DEVANAGARI_DIGITS = "०१२३४५६७८९";

function toArabicDigits(str) {
  return str.replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)));
}

function formatValue(current, original) {
  const isDevanagari = /[०-९]/.test(original);
  const prefix = original.match(/^[^0-9०-९]*/)[0];
  const suffix = original.match(/[^0-9०-९]*$/)[0];
  const locale = isDevanagari ? "en-IN-u-nu-deva" : "en-IN";
  return prefix + Math.round(current).toLocaleString(locale) + suffix;
}

// Animates "3,221" / "5,000+" / "३,२२१" style stat strings by counting up from
// 0 to the parsed target once the element scrolls into view, preserving the
// original digit script (Arabic/Devanagari), grouping and +/prefix suffix.
export default function CountUp({ value, duration = 1.8 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(() => formatValue(0, value));

  useEffect(() => {
    if (!isInView) return;
    const target = Number(toArabicDigits(value).replace(/[^0-9]/g, "")) || 0;
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(formatValue(latest, value)),
    });
    return () => controls.stop();
  }, [isInView, value, duration]);

  return <span ref={ref}>{display}</span>;
}
