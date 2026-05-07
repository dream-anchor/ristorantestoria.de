import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const OpenTableWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://www.opentable.de/widget/reservation/loader?rid=115809&type=standard&theme=wide&color=36&dark=false&iframe=true&domain=de&lang=de-DE&newtab=false&ot_source=Restaurant%20website&cfe=true';
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        const existingScript = containerRef.current.querySelector('script');
        if (existingScript) {
          existingScript.remove();
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTracked.current) {
          hasTracked.current = true;
          trackEvent("reservation_widget_viewed");
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="bg-card p-6 rounded-lg border border-border shadow-lg"
    />
  );
};

export default OpenTableWidget;
