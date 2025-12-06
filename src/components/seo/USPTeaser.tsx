import { LucideIcon } from "lucide-react";

export interface USPItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface USPTeaserProps {
  items: USPItem[];
}

const USPTeaser = ({ items }: USPTeaserProps) => {
  return (
    <section className="bg-secondary/50 py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="h-7 w-7 md:h-8 md:w-8 text-primary stroke-[1.5]" />
              </div>
              <h3 className="font-serif font-semibold text-base md:text-lg text-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default USPTeaser;
