import { useEffect, useRef } from "react";
import videoAsset from "@/assets/pizza-burrata.mp4.asset.json";
import posterAsset from "@/assets/pizza-burrata-poster.jpg.asset.json";

const HomeVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-[1100px] mx-auto overflow-hidden rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/40">
          <video
            ref={videoRef}
            className="w-full h-auto block"
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterAsset.url}
          >
            <source src={videoAsset.url} type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
};

export default HomeVideo;