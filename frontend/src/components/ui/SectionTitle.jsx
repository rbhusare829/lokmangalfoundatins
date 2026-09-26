export default function SectionTitle({ pre, accent, subtitle, center = true, light = false }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      <h2
        className={`relative inline-block pb-4 text-2xl font-extrabold sm:text-3xl ${
          light ? "text-white" : "text-brand-green-primary"
        }`}
      >
        {pre} <span className="text-brand-orange-accent">{accent}</span>
        <span
          className={`absolute bottom-0 h-[3px] w-[136px] ${center ? "left-1/2 -translate-x-1/2" : "left-0"}`}
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, #EA8B22 0, #EA8B22 10px, transparent 10px, transparent 16px, #14432A 16px, #14432A 26px, transparent 26px, transparent 32px)",
          }}
        />
      </h2>
      {subtitle && (
        <p className={`mx-auto mt-3 max-w-2xl text-sm ${light ? "text-white/80" : "text-secondary-text"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
