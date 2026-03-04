import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export function LazyImage({
  src,
  alt,
  fallbackSrc,
  className = "",
  aspectRatio = "aspect-[3/4]",
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const ref = useRef(null);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "100px", threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
  };

  return (
    <div ref={ref} className={`overflow-hidden bg-gray-200 dark:bg-gray-700 ${aspectRatio} ${className}`}>
      {inView ? (
        <motion.img
          src={currentSrc}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          loading="lazy"
          className="h-full w-full object-cover"
          {...props}
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-700" />
      )}
    </div>
  );
}
