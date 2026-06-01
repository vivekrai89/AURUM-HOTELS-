import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer id="contact" className="bg-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-serif font-bold text-white">AURUM</span>
              <span className="text-xs font-sans text-gold tracking-[0.2em] uppercase mt-1">Hotels</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-6 max-w-xs">
              Where luxury meets comfort. Experience world-class hospitality in the heart of the city, designed for the discerning traveler.
            </p>
            <div className="flex gap-4">
              {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-3">
              {[['Home', '/'], ['Rooms', '/rooms'], ['My Bookings', '/my-bookings'], ['Sign In', '/login']].map(([label, path]) => (
                <li key={label}><Link to={path} className="text-sm text-gray-400 hover:text-gold transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span>123 Luxury Lane, Connaught Place, New Delhi 110001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiPhone size={16} className="text-gold shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiMail size={16} className="text-gold shrink-0" />
                <span>reservations@aurumhotels.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2025 Aurum Hotels. All rights reserved.</p>
          <p className="text-xs text-gray-500">Built with React.js · Node.js · MySQL · MongoDB · Razorpay</p>
          <p className="text-xs text-gray-500">Made with <span style={{color: '#e25555'}}>♥</span> by Vivek</p>
        </div>
      </div>
    </footer>
  )
}