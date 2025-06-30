// Declare a client component
'use client'

import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    name: string;
}

/**
 * InputField to handle input box
 * @param param0  id,name ,type = 'text', required, ...props 
 * @returns input box wrap in div
 */
const InputField = ({ id,name ,type = 'text', required, ...props }: InputFieldProps) => {
    return (
        <div className="relative">
            <input
                id={id} name={name} type={type} required={required}
                {...props}
                className="w-full p-3 pl-4 pr-6 bg-[#d9d9d9] text-[#848484] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {required && (
                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-red-500 font-bold pointer-events-none">
                *
                </span>
            )}
        </div>
    )
}

export default InputField;