'use client';

import React from 'react';
import Image from 'next/image';

interface ImageCardProps {
  imageUrl: string;
  altText?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, altText = "Landscape image" }) => {
  return (
    <div className="relative w-full rounded-lg shadow-md overflow-hidden aspect-video"> {/* aspect-video giữ tỷ lệ ảnh */}
      <Image
        src={imageUrl}
        alt={altText}
        layout="fill" // Giúp ảnh chiếm đầy đủ không gian container
        objectFit="cover" // Cắt ảnh để vừa với container mà không làm biến dạng
        className="rounded-lg"
      />
    </div>
  );
};

export default ImageCard;