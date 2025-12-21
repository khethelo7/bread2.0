import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-bread-black text-bread-white border-t-4 border-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-pixel text-2xl text-primary">
              BREAD
            </Link>
            <p className="font-retro text-lg text-bread-white/70 mt-4">
              Retro gaming meets streetwear. Level up your style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-pixel text-xs text-accent mb-4">NAVIGATE</h3>
            <ul className="space-y-2">
              {["Shop", "About", "Media", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="font-retro text-lg text-bread-white/80 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-pixel text-xs text-accent mb-4">CATEGORIES</h3>
            <ul className="space-y-2">
              {["T-Shirts", "Hoodies", "Pants", "Accessories"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/shop?category=${item.toLowerCase().replace(' ', '-')}`}
                    className="font-retro text-lg text-bread-white/80 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="font-pixel text-xs text-accent mb-4">CONNECT</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="text-bread-white/80 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-bread-white/80 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-bread-white/80 hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-6 w-6" />
              </a>
              <a
                href="mailto:hello@bread.style"
                className="text-bread-white/80 hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
            <p className="font-retro text-sm text-bread-white/60">
              hello@bread.style
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-bread-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-retro text-sm text-bread-white/50">
            © 2024 BREAD. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/admin"
              className="font-retro text-sm text-bread-white/30 hover:text-bread-white/60 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
