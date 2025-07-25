import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import Logo from '../assets/Logo.png';
import Savings from '../assets/Savings.jpg';
import Team from '../assets/Team.jpg';
import UTT from '../assets/UTT.jpg';

export default function Dashboard() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); 

  const handleSuccess = () => {
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-purple-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6 transition">
      
      {/* Top Branding Section */}
      <div className="max-w-6xl w-full text-center mb-10">
        <img src={Logo} alt="DA-Logo" className="mx-auto h-35 mb-4" />
        <h1 className="text-4xl font-bold text-purple-700 dark:text-white">
          Welcome to <span className="text-purple-700">Dime Allies Hub</span>
        </h1>
        <p className="text-gray-700 text-left dark:text-gray-300 mt-2 text-lg">
                <strong>Dime Allies</strong> is your gateway to financial empowerment — a platform built by youth, for youth. Every shilling
                you contribute grows your financial credibility, opens doors to opportunities, and brings you closer to the
                future you deserve.
              </p>
              <p className="text-gray-700 text-left dark:text-gray-300 mt-2 text-lg">
                Through our partnership with <strong>UTT Microfinance</strong>, your savings are backed by investment
                instruments and institutional support. This means: transparency, trust, and the ability to apply for real
                benefits — education, business, health, and more.
              </p>
               <p className="text-gray-700  dark:text-gray-300 mt-2 text-lg" >
                <strong>Save small. Save smart. Save together — with Dime Allies.</strong>
              </p>
      </div>

      {/* Features Overview */}
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
          <img src={Savings} alt="Saving" className="h-36 mx-auto mb-6 rounded-xl" />
          <h3 className="text-2xl font-semibold text-center text-purple-700 mb-3">Save Smartly</h3>
          <p className="text-gray-700 dark:text-gray-300 text-base">
            Track your contributions, set financial goals, and learn how to grow your wealth together.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
          <img src={Team} alt="Collaboration" className="h-36 mx-auto mb-6 rounded-xl" />
          <h3 className="text-2xl font-semibold text-center text-purple-700 mb-3">Collaborate & Grow</h3>
          <p className="text-gray-700 dark:text-gray-300 text-base">
            Join rooms, share tips, suggest ideas, and lead meaningful projects with fellow Dime Allies.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
          <img src={UTT} alt="UTT" className="h-36 mx-auto mb-6 rounded-xl" />
          <h3 className="text-2xl font-semibold text-center text-purple-700 mb-3">UTT Benefits</h3>
          <p className="text-gray-700 dark:text-gray-300 text-base">
            Access exclusive UTT savings and investment opportunities for groups and individuals.
          </p>
        </div>
      </div>

      {/* Login/Register Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-12 w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center transition">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-purple-700 dark:text-white mb-4">
            {isLogin ? "Returning Member?" : "New Ally?"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {isLogin
              ? "Login to access your Dime Allies dashboard, chats, and savings tools."
              : "Create your account and start your journey to financial growth with us."}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="bg-purple-700 text-white px-6 py-2 rounded-full hover:bg-purple-800 transition"
          >
            {isLogin ? "New here? Register instead" : "Already have an account? Login"}
          </button>
        </div>
        <div className="flex-1 bg-purple-50 dark:bg-gray-700 p-6 rounded-2xl shadow-inner w-full">
          {isLogin ? <LoginForm onSuccess={handleSuccess} /> : <RegisterForm onSuccess={handleSuccess} />}
        </div>
      </div>

      {/* Creative Footer */}
      <footer className="mt-20 w-full bg-purple-700 text-white py-8 px-4 rounded-t-3xl">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="text-xl font-bold mb-3">Dime Allies Hub</h4>
            <p>Empowering groups and individuals through collaboration, savings, and investment opportunities.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
            <p>Email: <a href="mailto:info@dimeallieshub.com" className="underline">info@dimeallieshub.com</a></p>
            <p>Phone: +255 656 936 620</p>
            <p>Location: Dar es Salaam, Tanzania</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">More Info</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Partnerships</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 text-xs border-t border-white/30 pt-4">
          © {new Date().getFullYear()} Dime Allies Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
