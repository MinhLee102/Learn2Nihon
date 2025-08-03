<<<<<<< Updated upstream
import './global.css'
=======
import '../../styles/globals.css';
>>>>>>> Stashed changes
import Header from "../../components/Header";
import Navigation from "../../components/navigation";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <div className="home-layout">
      <Header />
      <Navigation />
      <main className="main-content">
        <h1 className="text-2xl font-bold mb-4">Trang chủ</h1>
        <p>Chào mừng bạn đến với Learn2Nihon!</p>
        {/* Nội dung chính khác ở đây */}
      </main>
    </div>
  );
};

export default Home;