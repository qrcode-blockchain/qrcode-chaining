// 'use client'
// import React, { useState } from 'react';
// import { Factory, ShoppingCart } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// const UserTypeSelection = () => {
//   const [selectedType, setSelectedType] = useState(null);
//   const router=useRouter();
//   const handleSelection = (type) => {
//     setSelectedType(type);
//     if(type==='manufacturer'){
//         router.push('/ManufacturerSignup')
//     }else{
//         router.push('/CustomerLogin')
//     }
//     console.log(`Selected user type: ${type}`);
//   };
 
//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 overflow-hidden">
//       {/* Background Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-black/85 to-blue-900/95 z-0" />

//       {/* Content Container */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-20 pb-16 sm:pb-24 text-center">
//         <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-8">
//           <span className="block">Who Are You?</span>
//         </h1>
        
//         <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-16 px-4">
//           Choose your role to access tailored blockchain QR tracking solutions
//         </p>

//         {/* User Type Selection Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
//           {/* Manufacturer Card */}
//           <div 
//             onClick={() => handleSelection('manufacturer')}
//             className={`
//               relative group cursor-pointer p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 
//               ${selectedType === 'manufacturer' 
//                 ? 'border-blue-400 bg-blue-900/40' 
//                 : 'border-blue-400/20 hover:border-blue-400 bg-white/5 hover:bg-blue-900/20'}
//               backdrop-blur-md
//             `}
//           >
//             <div className="flex flex-col items-center">
//               <div className="mb-4 bg-blue-600/20 p-3 sm:p-4 rounded-full border border-blue-400/30 group-hover:animate-pulse">
//                 <Factory className="h-10 w-10 sm:h-16 sm:w-16 text-blue-400" />
//               </div>
              
//               <div className="text-center">
//                 <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Manufacturer</h2>
//                 <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
//                   Secure your supply chain with blockchain-backed QR tracking
//                 </p>
//                 <button 
//                   className={`
//                     px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base
//                     ${selectedType === 'manufacturer' 
//                       ? 'bg-blue-600 text-white' 
//                       : 'border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10'}
//                   `}
//                 >
//                   Manufacturer Portal
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Consumer Card */}
//           <div 
//             onClick={() => handleSelection('consumer')}
//             className={`
//               relative group cursor-pointer p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 
//               ${selectedType === 'consumer' 
//                 ? 'border-blue-400 bg-blue-900/40' 
//                 : 'border-blue-400/20 hover:border-blue-400 bg-white/5 hover:bg-blue-900/20'}
//               backdrop-blur-md
//             `}
//           >
//             <div className="flex flex-col items-center">
//               <div className="mb-4 bg-blue-600/20 p-3 sm:p-4 rounded-full border border-blue-400/30 group-hover:animate-pulse">
//                 <ShoppingCart className="h-10 w-10 sm:h-16 sm:w-16 text-blue-400" />
//               </div>
              
//               <div className="text-center">
//                 <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Consumer</h2>
//                 <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
//                   Verify product authenticity and trace your product's journey
//                 </p>
//                 <button 
//                   className={`
//                     px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base
//                     ${selectedType === 'consumer' 
//                       ? 'bg-blue-600 text-white' 
//                       : 'border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10'}
//                   `}
//                 >
//                   Consumer Portal
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Subtle Animated Lines - Hidden on very small screens */}
//       <svg className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block" style={{ zIndex: 1 }}>
//         <line 
//           x1="10%" y1="20%" 
//           x2="90%" y2="80%" 
//           className="animate-draw-slow stroke-blue-400/20" 
//           strokeWidth="1"
//           strokeDasharray="4 4"
//         />
//         <line 
//           x1="90%" y1="20%" 
//           x2="10%" y2="80%" 
//           className="animate-draw-slow stroke-blue-400/20" 
//           strokeWidth="1"
//           strokeDasharray="4 4"
//         />
//       </svg>
//     </div>
//   );
// };

// export default UserTypeSelection;
'use client';
import React, { useState } from 'react';
import { Factory, ShoppingCart, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UserTypeSelection = () => {
  const [selectedType, setSelectedType] = useState(null);
  const router = useRouter();

  const handleSelection = (type) => {
    setSelectedType(type);
    if (type === 'manufacturer') {
      router.push('/ManufacturerSignup');
    } else {
      router.push('/CustomerLogin');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-black/85 to-blue-900/95 z-0" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-4 pb-16 sm:pb-24 text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-8">
          <span className="block">Who Are You?</span>
        </h1>

        <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-16 px-4">
          Choose your role to access tailored blockchain QR tracking solutions
        </p>

        {/* User Type Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
          {/* Manufacturer Card */}
          <div
            onClick={() => handleSelection('manufacturer')}
            className={`
              relative group cursor-pointer p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 
              ${selectedType === 'manufacturer'
                ? 'border-blue-400 bg-blue-900/40'
                : 'border-blue-400/20 hover:border-blue-400 bg-white/5 hover:bg-blue-900/20'}
              backdrop-blur-md
            `}
          >
            <div className="flex flex-col items-center">
              <div className="mb-4 bg-blue-600/20 p-3 sm:p-4 rounded-full border border-blue-400/30 group-hover:animate-pulse">
                <Factory className="h-10 w-10 sm:h-16 sm:w-16 text-blue-400" />
              </div>

              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Manufacturer</h2>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                  Secure your supply chain with blockchain-backed QR tracking
                </p>
                <button
                  className={`
                    px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base
                    ${selectedType === 'manufacturer'
                      ? 'bg-blue-600 text-white'
                      : 'border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10'}
                  `}
                >
                  Manufacturer Portal
                </button>
              </div>
            </div>
          </div>

          {/* Consumer Card */}
          <div
            onClick={() => handleSelection('consumer')}
            className={`
              relative group cursor-pointer p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 
              ${selectedType === 'consumer'
                ? 'border-blue-400 bg-blue-900/40'
                : 'border-blue-400/20 hover:border-blue-400 bg-white/5 hover:bg-blue-900/20'}
              backdrop-blur-md
            `}
          >
            <div className="flex flex-col items-center">
              <div className="mb-4 bg-blue-600/20 p-3 sm:p-4 rounded-full border border-blue-400/30 group-hover:animate-pulse">
                <ShoppingCart className="h-10 w-10 sm:h-16 sm:w-16 text-blue-400" />
              </div>

              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Consumer</h2>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                  Verify product authenticity and trace your product's journey
                </p>
                <button
                  className={`
                    px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base
                    ${selectedType === 'consumer'
                      ? 'bg-blue-600 text-white'
                      : 'border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10'}
                  `}
                >
                  Consumer Portal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Line Manager Login */}
        <div className="mt-10 sm:mt-12">
          <p className="text-gray-300 text-sm sm:text-base">
            Are you a <span className="font-semibold text-blue-400">Line Manager?</span>
          </p>
          <button
            onClick={() => router.push('/lineManager/lineManagerLogin')}
            className="mt-2 px-5 py-2 text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300"
          >
            Sign in as Line Manager
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
