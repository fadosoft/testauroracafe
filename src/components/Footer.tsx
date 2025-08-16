import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 text-center md:text-left mb-4 md:mb-0">
            
            <p className="mt-2 text-sm">&copy; {new Date().getFullYear()} Aurora Caffè. Tutti i diritti riservati.</p>
          </div>
          
          <div className="w-full md:w-1/3 text-center md:text-right">
            <h3 className="text-lg font-semibold mb-2">Seguici</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="https://www.facebook.com/auroracafetaranto" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#4267b2', fontFamily: 'Segoe UI', padding: '5px 10px', borderRadius: '5px', display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'white' }}>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.79.157 1.79.157v1.953H10.5c-.988 0-1.293.62-1.293 1.247V8.05h2.16l-.356 2.362H9.207V16c3.823-.604 6.75-3.934 6.75-7.951z"/>
  </svg>
  Facebook
</a>
              
              <a href="https://www.instagram.com/auroracafetaranto" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#FFA500', padding: '5px 10px', borderRadius: '5px', display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'white', marginLeft: '10px', fontFamily: 'Segoe UI' }}>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.916 3.916 0 0 0 .42 2.76C.222 3.269.087 3.85.048 4.703.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.95.923 1.417.444.47.867.743 1.417.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.297-.048c.852-.04 1.433-.174 1.942-.372a3.916 3.916 0 0 0 1.417-.923 3.916 3.916 0 0 0 .923-1.417c.198-.51.333-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.444-.048-3.297c-.04-.852-.174-1.433-.372-1.942a3.917 3.917 0 0 0-.923-1.417A3.916 3.916 0 0 0 13.24 0.42c-.51-.198-1.09-.333-1.942-.372C10.445.01 10.173 0 8 0zm0 1.5c2.165 0 2.44.008 3.29.046.78.035 1.28.166 1.63.308.37.148.68.344.92.58.24.237.436.54.58.92.142.35.273.85.308 1.63.038.85.046 1.125.046 3.29 0 2.165-.008 2.44-.046 3.29-.035.78-.166 1.28-.308 1.63-.148.37-.344.68-.58.92-.237.24-.54.436-.92.58-.35.142-.85.273-1.63.308-.85.038-1.125.046-3.29.046-2.165 0-2.44-.008-3.29-.046-.78-.035-1.28-.166-1.63-.308-.37-.148-.68-.344-.92-.58-.24-.237-.436-.54-.58-.92-.142-.35-.273-.85-.308-1.63-.038-.85-.046-1.125-.046-3.29 0-2.165.008-2.44.046-3.29.035-.78.166-1.28.308-1.63.148-.37.344-.68.92-.58.237-.24.54-.436.92-.58.35-.142-.85.273-1.63.308.85-.038 1.125-.046 3.29-.046zm0 3.787a4.213 4.213 0 1 0 0 8.426 4.213 4.213 0 0 0 0-8.426zM8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm5.25-7.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"/>
  </svg>
  Instagram
</a>
              <a href="https://twitter.com/auroracafetaranto" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#38A1F3', fontFamily: 'Helvetica', padding: '5px 10px', borderRadius: '5px', display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'white', marginLeft: '10px' }}>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.025 4.354A3.283 3.283 0 0 1 0 7.5v.04a3.294 3.294 0 0 0 2.625 3.221 3.292 3.292 0 0 1-.465.045 3.302 3.302 0 0 1-.354-.035 3.298 3.298 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
  </svg>
  Twitter
</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
