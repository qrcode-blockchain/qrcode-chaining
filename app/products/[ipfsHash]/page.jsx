// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { Shield, CheckCircle, XCircle, AlertTriangle, Package, Calendar, MapPin, Tag, Weight, Factory, Hash, Clock } from 'lucide-react';
// import { motion } from 'framer-motion';
// import FetchLocation from "./fetch_location";
// import YouTube from 'react-youtube';

// export default function ProductPage() {
//   const params = useParams();
//   const hash = params?.ipfsHash;
//   const [isValid, setIsValid] = useState(null);
//   const [ipfsData, setIpfsData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [locationData, setLocationData] = useState({});

//   const options= {
//         height: '390',
//         width: '640',
//         playerVars: {
//           autoplay: 1,
//           controls: 1,
//         },
//   };

//   useEffect(() => {
//     const verifyAndFetch = async (blockchainFlag) => {
//       try {
//         setLoading(true);

//         if (blockchainFlag) {
//             const newHash = hash.slice(0, -3);
//             const res = await fetch('/api/verify_hash', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ ipfsHash: newHash }),
//             });

//             if (!res.ok) throw new Error('Verification failed');
//             const { exists } = await res.json();
//             setIsValid(exists);

//             if (exists) {
//                 const ipfsResponse = await fetch(`/api/ipfs-url/${newHash}`);
//                 const result = await ipfsResponse.json();
//                 if (!result.success) throw new Error('Failed to fetch data from IPFS');
//                 setIpfsData(result.data);
//             }
//         } else {
//             const ipfsResponse = await fetch(`/api/ipfs-url/${hash}`);
//             const result = await ipfsResponse.json();
//             if (!result.success) throw new Error('Failed to fetch data from IPFS');
//             setIpfsData(result.data);
//             console.log(result.data);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (hash.length > 46) {
//         verifyAndFetch(true);
//     } else {
//         verifyAndFetch(false);
//     };
//   }, [hash]);

//   useEffect(() => {
//     const fetchAndStoreLocation = async () => {
//       try {
//         const response = await fetch('/api/store-location', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             ...locationData,
//             productId: ipfsData._id,
//           }),
//         });

//         const locationResult = await response.json();
//         if (!locationResult.success) {
//           console.log('Location not stored');
//         } else {
//           console.log('Location Stored!!');
//         }
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     if (ipfsData && locationData) {
//       fetchAndStoreLocation();
//     }
//   }, [ipfsData, locationData]);


//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         duration: 0.5,
//         when: "beforeChildren",
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//       y: 0, 
//       opacity: 1,
//       transition: { duration: 0.5 }
//     }
//   };

//   // Helper function for displaying product details
//   const renderDetail = (icon, label, value) => {
//     if (!value) return null;
    
//     return (
//       <motion.div 
//         className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
//         variants={itemVariants}
//       >
//         <div className="text-indigo-600 mt-1">{icon}</div>
//         <div>
//           <p className="text-sm text-gray-500">{label}</p>
//           <p className="font-medium">{value}</p>
//         </div>
//       </motion.div>
//     );
//   };

//   return (
//     <motion.div 
//       className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-lg my-8 border border-black "
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//     >
//       {/* Header */}
//       <motion.div 
//         className="flex items-center mb-6"
//         variants={itemVariants}
//       >
//         <Shield className="text-indigo-600 mr-3" size={28} />
//         <h1 className="text-2xl font-bold text-gray-800">Product Verification</h1>
//       </motion.div>

//       {/* Hash Display */}
//       <motion.div 
//         className="p-4 bg-gray-50 rounded-lg mb-6 flex items-center gap-2"
//         variants={itemVariants}
//       >
//         <Hash size={16} className="text-gray-600" />
//         <div className="flex-1">
//           <p className="text-xs text-gray-500 mb-1">Product Identifier</p>
//           <p className="font-mono text-sm break-all">{hash}</p>
//         </div>
//       </motion.div>

//       {/* Verification Status */}
//       {loading ? (
//         <motion.div 
//           className="flex justify-center my-8"
//           variants={itemVariants}
//         >
//           <div className="animate-pulse flex items-center">
//             <div className="h-8 w-8 bg-indigo-200 rounded-full mr-3"></div>
//             <div className="h-4 w-32 bg-indigo-100 rounded"></div>
//           </div>
//         </motion.div>
//       ) : (
//         <motion.div 
//           className={`p-4 rounded-lg mb-6 flex items-center ${
//             isValid ? 'bg-green-50' : isValid === false ? 'bg-red-50' : 'bg-gray-50'
//           }`}
//           variants={itemVariants}
//         >
//           {isValid === true && (
//             <>
//               <CheckCircle className="text-green-600 mr-3" size={24} />
//               <div>
//                 <p className="font-semibold text-green-800">Blockchain Verified</p>
//                 <p className="text-sm text-green-600">This product is authentic and data is verified</p>
//               </div>
//             </>
//           )}
//           {isValid === false && (
//             <>
//               <XCircle className="text-red-600 mr-3" size={24} />
//               <div>
//                 <p className="font-semibold text-red-800">Verification Failed</p>
//                 <p className="text-sm text-red-600">This product could not be verified on the blockchain</p>
//               </div>
//             </>
//           )}
//           {error && (
//             <>
//               <AlertTriangle className="text-amber-600 mr-3" size={24} />
//               <div>
//                 <p className="font-semibold text-amber-800">Error Occurred</p>
//                 <p className="text-sm text-amber-600">{error}</p>
//               </div>
//             </>
//           )}
//         </motion.div>
//       )}

//       {/* Product Details */}
//       {ipfsData && (
//         <motion.div
//           className="mt-6"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <motion.h2 
//             className="text-xl font-semibold mb-4 text-black flex items-center"
//             variants={itemVariants}
//           >
//             <Package className="mr-2 text-indigo-600" size={20} />
//             Product Details
//           </motion.h2>
          
//           <motion.div 
//             className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black"
//             variants={containerVariants}
//           >
//             {renderDetail(<Package size={18} />, "Product Name", ipfsData.product_name)}
//             {renderDetail(<Tag size={18} />, "Serial Number",ipfsData?.serial_number)}
//             {renderDetail(<Hash size={18} />, "Batch Number", ipfsData?.batch_number)}
//             {renderDetail(<MapPin size={18} />, "Location", ipfsData.location)}
//             {renderDetail(<Calendar size={18} />, "Date", `${ipfsData.date.slice(6, 8)}/${ipfsData.date.slice(4, 6)}/${ipfsData.date.slice(0, 4)}`)}
//             {renderDetail(<Tag size={18} />, "Price", ipfsData.price ? `$${ipfsData.price}` : null)}
//             {renderDetail(<Weight size={18} />, "Weight", ipfsData.weight ? `${ipfsData.weight} kg` : null)}
//             {renderDetail(<Factory size={18} />, "Manufacturer", ipfsData.man_name)}
//           </motion.div>
          
//           <motion.div 
//             className="mt-8 text-center text-sm text-black"
//             variants={itemVariants}
//           >
//             <p>Secured by blockchain technology</p>
//           </motion.div>
//           {ipfsData?.videoUrl && (
//             <motion.div className='flex justify-center align-center text-center'>
//               <YouTube videoId={ipfsData.videoUrl} onReady={(event) => event.target.pauseVideo()} opts={options}></YouTube>
//             </motion.div>
//           )}
//         </motion.div>
//       )}
//       <FetchLocation setLocationData={setLocationData}/>
//     </motion.div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Shield, CheckCircle, XCircle, AlertTriangle, Package, Calendar, MapPin, Tag, Weight, Factory, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import FetchLocation from "./fetch_location";
import YouTube from 'react-youtube';

export default function ProductPage() {
  const params = useParams();
  const hash = params?.ipfsHash;
  const [isValid, setIsValid] = useState(null);
  const [ipfsData, setIpfsData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState({});
  const [videoReady, setVideoReady] = useState(false);

  // Responsive YouTube options
  const options = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0, // Changed to 0 to prevent autoplay issues
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  useEffect(() => {
    const verifyAndFetch = async (blockchainFlag) => {
      try {
        setLoading(true);

        if (blockchainFlag) {
            const newHash = hash.slice(0, -3);
            const res = await fetch('/api/verify_hash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ipfsHash: newHash }),
            });

            if (!res.ok) throw new Error('Verification failed');
            const { exists } = await res.json();
            setIsValid(exists);

            if (exists) {
                const ipfsResponse = await fetch(`/api/ipfs-url/${newHash}`);
                const result = await ipfsResponse.json();
                if (!result.success) throw new Error('Failed to fetch data from IPFS');
                setIpfsData(result.data);
            }
        } else {
            const ipfsResponse = await fetch(`/api/ipfs-url/${hash}`);
            const result = await ipfsResponse.json();
            if (!result.success) throw new Error('Failed to fetch data from IPFS');
            setIpfsData(result.data);
            console.log(result.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (hash.length > 46) {
        verifyAndFetch(true);
    } else {
        verifyAndFetch(false);
    };
  }, [hash]);

  useEffect(() => {
    const fetchAndStoreLocation = async () => {
      try {
        const response = await fetch('/api/store-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...locationData,
            productId: ipfsData._id,
          }),
        });

        const locationResult = await response.json();
        if (!locationResult.success) {
          console.log('Location not stored');
        } else {
          console.log('Location Stored!!');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (ipfsData && locationData) {
      fetchAndStoreLocation();
    }
  }, [ipfsData, locationData]);

  // Handle video ready event
  const handleVideoReady = (event) => {
    setVideoReady(true);
    // Video is ready but won't autoplay
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Helper function for displaying product details
  const renderDetail = (icon, label, value) => {
    if (!value) return null;
    
    return (
      <motion.div 
        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
        variants={itemVariants}
      >
        <div className="text-indigo-600 mt-1">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-lg my-8 border border-black"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center mb-6"
        variants={itemVariants}
      >
        <Shield className="text-indigo-600 mr-3" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">Product Verification</h1>
      </motion.div>

      {/* Hash Display */}
      <motion.div 
        className="p-4 bg-gray-50 rounded-lg mb-6 flex items-center gap-2"
        variants={itemVariants}
      >
        <Hash size={16} className="text-gray-600" />
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Product Identifier</p>
          <p className="font-mono text-sm break-all">{hash}</p>
        </div>
      </motion.div>

      {/* Verification Status */}
      {loading ? (
        <motion.div 
          className="flex justify-center my-8"
          variants={itemVariants}
        >
          <div className="animate-pulse flex items-center">
            <div className="h-8 w-8 bg-indigo-200 rounded-full mr-3"></div>
            <div className="h-4 w-32 bg-indigo-100 rounded"></div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className={`p-4 rounded-lg mb-6 flex items-center ${
            isValid ? 'bg-green-50' : isValid === false ? 'bg-red-50' : 'bg-gray-50'
          }`}
          variants={itemVariants}
        >
          {isValid === true && (
            <>
              <CheckCircle className="text-green-600 mr-3" size={24} />
              <div>
                <p className="font-semibold text-green-800">Blockchain Verified</p>
                <p className="text-sm text-green-600">This product is authentic and data is verified</p>
              </div>
            </>
          )}
          {isValid === false && (
            <>
              <XCircle className="text-red-600 mr-3" size={24} />
              <div>
                <p className="font-semibold text-red-800">Verification Failed</p>
                <p className="text-sm text-red-600">This product could not be verified on the blockchain</p>
              </div>
            </>
          )}
          {error && (
            <>
              <AlertTriangle className="text-amber-600 mr-3" size={24} />
              <div>
                <p className="font-semibold text-amber-800">Error Occurred</p>
                <p className="text-sm text-amber-600">{error}</p>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Product Details */}
      {ipfsData && (
        <motion.div
          className="mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 
            className="text-xl font-semibold mb-4 text-black flex items-center"
            variants={itemVariants}
          >
            <Package className="mr-2 text-indigo-600" size={20} />
            Product Details
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black"
            variants={containerVariants}
          >
            {renderDetail(<Package size={18} />, "Product Name", ipfsData.product_name)}
            {renderDetail(<Tag size={18} />, "Serial Number", ipfsData?.serial_number)}
            {renderDetail(<Hash size={18} />, "Batch Number", ipfsData?.batch_number)}
            {renderDetail(<MapPin size={18} />, "Location", ipfsData.location)}
            {renderDetail(<Calendar size={18} />, "Date", `${ipfsData.date.slice(6, 8)}/${ipfsData.date.slice(4, 6)}/${ipfsData.date.slice(0, 4)}`)}
            {renderDetail(<Tag size={18} />, "Price", ipfsData.price ? `$${ipfsData.price}` : null)}
            {renderDetail(<Weight size={18} />, "Weight", ipfsData.weight ? `${ipfsData.weight} kg` : null)}
            {renderDetail(<Factory size={18} />, "Manufacturer", ipfsData.man_name)}
          </motion.div>
          
          {/* YouTube Video Section - Responsive */}
          {ipfsData?.videoUrl && (
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold mb-4 text-black">Product Video</h3>
              {/* Responsive 16:9 aspect ratio container */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {!videoReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="animate-pulse text-gray-400">Loading video...</div>
                  </div>
                )}
                <div className="absolute inset-0">
                  <YouTube 
                    videoId={ipfsData.videoUrl} 
                    onReady={handleVideoReady}
                    opts={options}
                    className="w-full h-full rounded-lg overflow-hidden"
                    iframeClassName="w-full h-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          <motion.div 
            className="mt-8 text-center text-sm text-black"
            variants={itemVariants}
          >
            <p>Secured by blockchain technology</p>
          </motion.div>
        </motion.div>
      )}
      <FetchLocation setLocationData={setLocationData}/>
    </motion.div>
  );
}