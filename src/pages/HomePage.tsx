import React, { useState } from 'react';
import Pic1 from '../assets/pic1.svg';
import Pic2 from '../assets/pic2.png';
import Pic3 from '../assets/pic3.png';
import { useNavigate } from "react-router";
import { firestore } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import Modal from '@/components/modal';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorText, setErrorText] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const onCloseModal = () => {
    closeModal();
  }

  const mailRef = React.createRef<HTMLInputElement>();

  const handleSubscribe = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = mailRef.current?.value;

    if (!email || email.trim() === '' || !emailRegex.test(email)) {
      setErrorText('Please enter a valid email address');
      setTimeout(() => setErrorText(''), 3000);
      return;
    }

    await addDoc(collection(firestore, 'subscribers'), { email });
    closeModal();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] p-8">
      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative group transition-all duration-500 ease-in-out transform hover:scale-105">
          <img
            src={Pic1}
            alt="Left Section"
            className="h-2/3 w-2/3 object-cover rounded-xl shadow-xl transition-all duration-300"
            style={{
              filter: 'blur(2px)', // Slight blur to blend with background
            }}
          />
          {/* Image Overlay to blend */}
          <div className="absolute inset-0 bg-[#f8fafc] opacity-50 rounded-xl"></div>
          <div className="absolute inset-0 flex justify-center items-center text-center">
            <h2 className="text-3xl font-semibold text-[#065C64] opacity-90 group-hover:opacity-100 transition-opacity duration-300">
              Discover Amazing Places
            </h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-8 justify-start">
          {/* Hero Text */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-[#065C64] tracking-tight">
              Find Your Perfect Field
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto md:mx-0">
              Search and book fields near you with ease. Whether you are an athlete, a coach, or a fan, we've got you covered.
            </p>
          </div>

          {/* Search & Dropdown Cards */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Search Card */}
            <div className="flex-1 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-[#065C64]">
              <h3 className="text-xl font-medium text-[#065C64] mb-4">Search Fields</h3>
              <input
                type="text"
                id="search"
                placeholder="Enter field name"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-[#065C64] focus:ring-2 focus:ring-[#065C64] transition duration-200"
              />
            </div>

            {/* City Dropdown Card */}
            <div className="flex-1 p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-[#065C64]">
              <h3 className="text-xl font-medium text-[#065C64] mb-4">Select a City</h3>
              <select
                id="city"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-[#065C64] focus:ring-2 focus:ring-[#065C64] transition duration-200"
              >
                <option value="" disabled selected>
                  Choose a city
                </option>
                <option value="new-york">New York</option>
                <option value="los-angeles">Los Angeles</option>
                <option value="chicago">Chicago</option>
                <option value="houston">Houston</option>
                <option value="miami">Miami</option>
              </select>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/signIn')}
              className="px-8 py-3 bg-[#065C64] text-white text-lg font-medium rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
              Explore Now
            </button>
          </div>

          {/* Bottom Image Section (Resized) */}
          <div className="relative group mt-8">
            <img
              src={Pic3}
              alt="Bottom Right"
              className="w-3/4 h-auto object-cover rounded-xl shadow-xl transition-all duration-300 mx-auto"
              style={{
                filter: 'blur(2px)', // Slight blur to blend with background
              }}
            />
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-[#f8fafc] opacity-50 rounded-xl"></div>
            <div className="absolute inset-0 flex justify-center items-center text-center">
              <h3 className="text-2xl font-semibold text-[#065C64] opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                Start Your Journey Now
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section - Styled as Footer */}
      <div className="w-full bg-[#065C64] text-white py-6 mt-12 shadow-xl">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-2">Your Adventure Starts Here</h2>
          <p className="text-lg mb-4">
            Ready to embark on an exciting journey? Find and book the perfect sports field near you now!
          </p>
          <button
            onClick={openModal}
            className="px-6 py-3 bg-white text-[#065C64] font-semibold rounded-lg shadow-lg hover:bg-[#f1f1f1] transition-all duration-300">
            Join the Community
          </button>

          {/* Modal for email subscription */}
          <Modal isOpen={isModalOpen} onClose={onCloseModal}>
            <h2 className="text-2xl font-semibold mb-4 text-black">Ready to make every day a PlayDay?</h2>
            <p className="mb-4 text-lg text-black">
              Subscribe to our newsletter and be the first to get updates on the latest features, field availability, and more!
            </p>

            <input ref={mailRef} type="email" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-teal-600 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" placeholder="email@example.com" />
            <p className='text-lg text-red-500'>{errorText}</p>

            <button
              onClick={handleSubscribe}
              className="mt-4 bg-teal-700 text-white px-6 py-3 rounded hover:bg-teal-600 font-semibold"
            >
              Subscribe
            </button>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
