'use client';

import React from 'react';
import Link from 'next/link'; 

export type JLPTLevel = '5' | '4' | '3' | '2' | '1'; 

interface JLPTLevelCardProps {
  level: JLPTLevel;
  href: string; 
}

const JLPTLevelCard: React.FC<JLPTLevelCardProps> = ({ level, href }) => {
  return (
    <Link href={href} passHref>
      <div className="flex flex-col items-center justify-center p-6 border border-gray-300 
      rounded-full shadow-sm cursor-pointer hover:bg-gray-100 transition-colors 
      h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 text-center">

        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-black">N{level}</span>

      </div>
    </Link>
  );
};

export default JLPTLevelCard;