"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { FaUserCircle } from "react-icons/fa";

interface AvatarProps extends Omit<ImageProps, "onError" | "src"> {
  src?: string | null;
  fallback?: React.ReactNode;
}

export default function Avatar({ src, alt, fallback, className, ...props }: AvatarProps) {
  const [error, setError] = useState(false);

  // If src is undefined, null, or empty string, show fallback immediately
  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-white/10 text-white/50 ${className}`}>
        {fallback || <FaUserCircle className="w-full h-full p-2" />}
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
