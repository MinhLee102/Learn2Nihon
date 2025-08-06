import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-100">
      {children}
    </div>
  );
}