import { Instagram, Linkedin, Facebook } from "lucide-react";


const Footer: React.FC = () => (
  <footer className="bg-gray-200 text-black py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center">
      <div className="">
        © 2025 Sapienza Foiling Team
      </div>
      <div className="flex space-x-6">
        <a 
          href="https://www.instagram.com/sapienzafoilingteam/" 
          className="hover:text-[#822433] transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="w-8 h-8 hover:scale-110 transition-transform" />
        </a>
        <a 
          href="https://www.linkedin.com/company/sapienza-foiling-team/about/" 
          className="hover:text-[#822433] transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-8 h-8 hover:scale-110 transition-transform" />
        </a>
        <a 
          href="https://www.facebook.com/profile.php?id=61572515878295" 
          className="hover:text-[#822433] transition-colors"
          aria-label="Facebook"
        >
          <Facebook className="w-8 h-8 hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  </div>
</footer>
);

export default Footer;