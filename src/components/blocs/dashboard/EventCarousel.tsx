"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export function EventCarousel() {
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current]);

  return (
    <div
      className="w-full cursor-grab overflow-hidden active:cursor-grabbing"
      ref={emblaRef}
    >
      <div className="flex">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="max-w-[800px] min-w-[800px] p-2 transition-all duration-500 hover:z-50 hover:scale-110 hover:bg-white"
          >
            <div className="relative h-[400px] w-full overflow-hidden rounded-xl shadow-lg">
              <Image
                src={`/images/poster-${index + 1}.jpg`}
                alt={`Event ${index + 1}`}
                width={800}
                height={400}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-lg font-semibold text-white">
                  Event {index + 1}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
