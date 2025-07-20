const Navigation: React.FC = () => {
  return (
    <nav
      style={{
        width: '200px',
        height: '100vh',
        backgroundColor: '#34495e',
        padding: '1rem',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <a href="#" style={{ color: 'white', margin: '0.5rem 0', textDecoration: 'none' }}>Trang chủ</a>
      <a href="#" style={{ color: 'white', margin: '0.5rem 0', textDecoration: 'none' }}>Tra cứu</a>
      <a href="#" style={{ color: 'white', margin: '0.5rem 0', textDecoration: 'none' }}>Từ vựng</a>
    </nav>
  );
};

export default Navigation;