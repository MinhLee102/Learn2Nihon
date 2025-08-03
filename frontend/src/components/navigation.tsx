import { useState } from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '❌' : '☰'}
      </button>

      <nav className={`navigation ${isOpen ? 'open' : 'closed'}`}>
        <Link href="/app/home">Trang chủ</Link>
        <Link href="#">Tra cứu</Link>
        <Link href="/app/home/vocabularyPage">Từ vựng</Link>
      </nav>
    </>
  );
};

export default Navigation;
