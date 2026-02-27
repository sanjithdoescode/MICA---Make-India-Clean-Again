import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface PointsTickerProps {
  target: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function PointsTicker({ target, duration = 1.8, className = '', style }: PointsTickerProps) {
  const springVal = useSpring(0, { duration: duration * 1000, bounce: 0.1 });
  const displayed = useTransform(springVal, (v) => Math.round(v).toLocaleString('en-IN'));
  const hasAnimated = useRef(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
      springVal.set(target);
    }
  }, [inView, target, springVal]);

  return (
    <motion.span ref={containerRef} className={className} style={style}>
      {displayed}
    </motion.span>
  );
}
