export function HeroImage({ image, alt }: { image: string; alt: string }) {
  return (
    <div data-testid="hero-image" className="mt-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt}
        className="w-full rounded-[4px] object-cover"
        style={{ aspectRatio: "16 / 8.1" }}
      />
    </div>
  );
}