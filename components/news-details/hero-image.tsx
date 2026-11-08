export function HeroImage() {
  return (
    <div data-testid="hero-image" className="mt-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/details-hero.svg"
        alt="President Donald Trump seated in front of American flags"
        className="w-full rounded-[4px] object-cover"
        style={{ aspectRatio: "16 / 8.1" }}
      />
      <p className="mt-2 text-[8px] leading-tight text-[#737373]">
        President Donald Trump in the Cabinet Room at the White House, Washington,
        D.C., May 30, 2026. Photo: Andrew Harnik/Getty Images
      </p>
    </div>
  );
}