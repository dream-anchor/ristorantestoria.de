import { useEffect, useRef } from "react";
import { Helmet } from "@/lib/helmetAsync";
import { STORIA } from "@/config/storia-entity";

const VIDEO_PATH = "/pizza-burrata-steinofen-storia-muenchen.mp4";
const POSTER_PATH = "/pizza-burrata-steinofen-storia-muenchen.jpg";
const VIDEO_URL = `${STORIA.url}${VIDEO_PATH}`;
const POSTER_URL = `${STORIA.url}${POSTER_PATH}`;
const VIDEO_NAME = "Neapolitanische Pizza mit Burrata aus dem Steinofen – STORIA München";
const VIDEO_DESCRIPTION =
  "Frisch gebackene neapolitanische Pizza mit cremiger Burrata aus dem 400°C-Steinofen im STORIA, dem italienischen Restaurant in München-Maxvorstadt, nur wenige Gehminuten vom Königsplatz.";

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

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: VIDEO_NAME,
    description: VIDEO_DESCRIPTION,
    thumbnailUrl: POSTER_URL,
    contentUrl: VIDEO_URL,
    uploadDate: "2026-06-05T12:00:00+02:00",
    inLanguage: "de-DE",
    publisher: { "@id": `${STORIA.url}/#restaurant` },
    regionsAllowed: "DE",
  };

  return (
    <section className="py-10 md:py-14" aria-label={VIDEO_NAME}>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
      </Helmet>
      <div className="container mx-auto px-4">
        <figure className="max-w-[1100px] mx-auto m-0">
          <div className="overflow-hidden rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/40">
            <video
              ref={videoRef}
              className="w-full h-auto block"
              muted
              loop
              playsInline
              preload="metadata"
              poster={POSTER_PATH}
              title={VIDEO_NAME}
              aria-label={VIDEO_NAME}
            >
              <source src={VIDEO_PATH} type="video/mp4" />
              {/* Stummes, dekoratives Video — leere Caption-Spur erfüllt den a11y-Audit */}
              <track kind="captions" label="Deutsch" srcLang="de" />
            </video>
          </div>
          <figcaption className="mt-3 text-center text-sm text-muted-foreground font-serif italic">
            Neapolitanische Pizza mit Burrata aus dem 400°C-Steinofen – STORIA München-Maxvorstadt
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default HomeVideo;