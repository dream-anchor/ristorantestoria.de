import { useEffect } from "react";

const ElfsightReviews = () => {
  useEffect(() => {
    // Load Elfsight script only once
    if (!document.querySelector('script[src*="elfsight"]')) {
      const script = document.createElement('script');
      script.src = 'https://static.elfsight.com/platform/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <div 
        className="elfsight-app-e58a6302-8498-4ada-9e27-e0a0ee5288ad" 
        data-elfsight-app-lazy 
      />
    </section>
  );
};

export default ElfsightReviews;
