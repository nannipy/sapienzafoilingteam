import { Instagram, Linkedin, Facebook } from "lucide-react";


const Footer: React.FC = () => (
  <footer className="bg-gray-200 text-black py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center">
      <div className="">
        © 2024 Sapienza Sailing Team
      </div>
      <div className="flex space-x-6">
        <Instagram className="text-black w-6 h-6 hover:text-white cursor-pointer transition-colors duration-300" />
        <Linkedin className="text-black w-6 h-6 hover:text-white cursor-pointer transition-colors duration-300" />
        <Facebook className="text-black w-6 h-6 hover:text-white cursor-pointer transition-colors duration-300" />
      </div>
    </div>
  </div>
</footer>
);

export default Footer;