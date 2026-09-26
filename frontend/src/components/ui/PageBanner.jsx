import { asset } from "../../lib/assetUrl.js";

export default function PageBanner({ title }) {
  return (
    <div
      className="flex h-[180px] items-center justify-center bg-cover bg-center text-center"
      style={{ backgroundImage: `linear-gradient(rgba(20,67,42,0.75), rgba(20,67,42,0.75)), url(${asset("background/top-banner.jpg")})` }}
    >
      <h1 className="text-xl font-extrabold text-white sm:text-2xl">{title}</h1>
    </div>
  );
}
