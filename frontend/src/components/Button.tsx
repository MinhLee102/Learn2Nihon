// Declare a client component
'use client'

import React from "react"

/**
 * Define CustomButton extends of HTML button for customization
 */
interface CustomButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    bgColor?: string;
    textColor?: string;

    //Color when the mouse is hovering over the button
    hoverBgColor?: string;
}

const Button = ({children, className, bgColor = 'bg-blue-400', textColor = 'text-white', 
    hoverBgColor = 'hover:bg-blue-500', ...props}: CustomButton) => {

    return (
         <button
            {...props}
            className={`
                w-full py-3 px-4 font-bold rounded-full focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500 transition-colors
                ${bgColor} ${textColor} ${hoverBgColor} ${className} 
      `     }
        >
            {children}
        </button>
    );
};

export default Button;