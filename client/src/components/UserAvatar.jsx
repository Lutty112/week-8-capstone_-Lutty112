export default function UserAvatar({ src, alt, size = "md" }) {
  const avatarSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-10 h-10";

  return (
    <div className={`rounded-full overflow-hidden ${avatarSize} bg-gray-200 flex items-center justify-center text-white font-bold`}>
      {src ? (
        <img src={src} alt={alt} className="object-cover w-full h-full" />
      ) : (
        <span>{alt?.[0]?.toUpperCase() || "?"}</span>
      )}
    </div>
  );
}
