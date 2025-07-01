import Picture from "./Picture";

/**
 * Component Header to use in other pages
 * how to use:<Header ....... />
 * @returns header for all page
 */
const Header = () => {
    return (
         <header className="bg-[#7289DA] border-b border-[#000000] shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center space-x-3">
                <Picture url="/logo.png" width={40} height={40} alt="Learn2Nihon Logo" />
                <span className="text-2xl font-bold text-white"> Learn2Nihon </span>
            </div>
        </header>
    );
};

export default Header;