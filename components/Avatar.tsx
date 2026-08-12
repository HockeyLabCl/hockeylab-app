const SIZES = { sm: 40, md: 64, lg: 96 };

export default function Avatar({
  src,
  size = "md",
}: {
  src?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const px = SIZES[size];

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        style={{ width: px, height: px }}
        className="rounded-full object-cover border-2 border-rink-100 shrink-0"
      />
    );
  }

  return (
    <div
      style={{ width: px, height: px }}
      className="rounded-full bg-rink-100 border-2 border-rink-100 shrink-0 flex items-center justify-center overflow-hidden"
    >
      <svg viewBox="0 0 24 24" width={px * 0.62} height={px * 0.62} fill="none">
        <circle cx="12" cy="8" r="4" fill="#B9C4BE" />
        <path
          d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7"
          fill="#B9C4BE"
        />
      </svg>
    </div>
  );
}
