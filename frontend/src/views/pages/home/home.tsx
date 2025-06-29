import Footer from "../../components/footer";
import Header from "../../components/header";
import Navigation from "../../components/navigation";
import Main from "./main";

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <Navigation />
      <Main />
      <Footer />
    </div>
  );
};

export default HomePage;