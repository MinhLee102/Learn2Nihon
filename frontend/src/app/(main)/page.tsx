'use client';

import { useEffect } from 'react';
import { useLayout } from '@/context/LayoutContext';

const HomePage: React.FC = () => {
  const { setHeaderTitle } = useLayout();

  useEffect(() => {
    setHeaderTitle('Welcome!'); 
  }, [setHeaderTitle]);

  return (
    <div className="container mx-auto p-4">
    </div>
  );
};

export default HomePage;