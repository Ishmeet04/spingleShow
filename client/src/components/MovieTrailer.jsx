// import { useState, useRef } from 'react';
// import BlurCircle from './BlurCircle';
// import { dummyTrailers } from '../assets/assets';
// import { PlayCircleIcon, BookmarkIcon, StarIcon, EyeIcon } from 'lucide-react';
// import axios from 'axios';
// import { useAppContext } from '../context/Appcontext';
// import { useParams } from 'react-router-dom';

// const MovieTrailer = () => {
//   // const {id} = useParams();
//   // const {shows, axios, getToken, user} = useAppContext();
//   // const {data} = axios.get(`/api/show/${id}`);
//   const [currentVideo, setCurrentVideo] = useState(dummyTrailers[0]);
//   const timeoutRef = useRef(null);
//   const handleMouseEnter = (trailer) => {
//   if (timeoutRef.current) clearTimeout(timeoutRef.current); // Safety clear

//   timeoutRef.current = setTimeout(() => {
//     setCurrentVideo(trailer); // Change video after 3 seconds
//   }, 3000);
// };

// const handleMouseLeave = () => {
//   if (timeoutRef.current) {
//     clearTimeout(timeoutRef.current); // Cancel if mouse leaves early
//   }
// };
//   return (
//     <div className='px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-10 overflow-hidden'>
//       <p className='text-gray-300 font-medium text-lg max-md:text-sm max-w-lg pl-6 sm:pl-0'>
//         Trailers
//       </p>

//       <div className="relative mt-6">
//         <BlurCircle top='0px' left='-100px' />
//       </div>


//       <div className="relative w-full max-w-6xl mx-auto mt-10">
//         <div className="relative pt-[56.25%] w-full">
//           <iframe
//             src={currentVideo.videoUrl + "?rel=0&autoplay=1"}
//             // src={`${currentVideo.videoUrl}?rel=0&autoplay=1`}
//             title="YouTube video player"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             referrerPolicy="strict-origin-when-cross-origin"
//             allowFullScreen
//             className="absolute top-0 left-0 w-full h-full rounded-lg"
//           />
//         </div>
//       </div>

//       <div className="relative">
//         <BlurCircle top='-150px' right='80px' />
//       </div>


//       <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto px-2'>
//         {dummyTrailers.map((trailer, index) => (
//           <div
//             key={index}
//             className='relative group transition-transform transform hover:-translate-y-1 hover:ring-2 ring-primary rounded-lg cursor-pointer'
//             onClick={() => setCurrentVideo(trailer)}
//             // NEW: Added hover listeners
//             onMouseEnter={() => handleMouseEnter(trailer)}
//             onMouseLeave={handleMouseLeave}
//           >
//             <img
//               src={trailer.image}
//               alt={`Trailer thumbnail ${index + 1}`}
//               className='rounded-lg w-full h-full object-cover brightness-75'
//             />
//             <PlayCircleIcon
//               strokeWidth={1.6}
//               className='absolute top-1/2 left-1/2 w-6 h-6 md:w-8 md:h-8 transform -translate-x-1/2 -translate-y-1/2 text-white'
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MovieTrailer;

import { useState, useRef } from 'react';
import BlurCircle from './BlurCircle';
import { dummyTrailers } from '../assets/assets';
import { PlayCircleIcon, BookmarkIcon, StarIcon, EyeIcon } from 'lucide-react';

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
  return `https://www.youtube.com/embed/${videoId}`;
};

const TrailerItem = ({ trailer, onPlayClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const videoSrc = `${getEmbedUrl(trailer.videoUrl)}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=1`;

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 600); 
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsHovered(false);
  };

  return (
    <div
      // HIGHLIGHT 1: Dynamic z-index. 
      // When hovered, this specific card wrapper gets z-50 to sit ABOVE all neighbor cards.
      className={`relative w-full aspect-[5/7] rounded-lg cursor-pointer transition-all duration-300 ${isHovered ? 'z-50 scale-110' : 'z-0'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. ORIGINAL POSTER */}
      <div className={`w-full h-full hover:ring-2 ring-primary rounded-lg overflow-hidden relative transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <img
          src={trailer.image}
          alt="poster"
          className="w-full h-full object-cover brightness-90 transition-all"
        />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-white/10">
           <StarIcon size={10} className="text-yellow-400 fill-yellow-400" />
           <span className="text-[10px] font-bold text-white">6.5</span>
        </div>
        <PlayCircleIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 w-10 h-10" strokeWidth={1.5} />
      </div>

      {/* 2. THE POP-UP CARD */}
      {isHovered && (
        <div
          className="absolute top-1/2 left-1/2 bg-[#0f1014] rounded-xl shadow-2xl overflow-hidden ring-1 ring-primary animate-in fade-in zoom-in-95 duration-200"
          style={{
            width: '320px', // Fixed width for pop-up
            height: 'auto',
            transform: 'translate(-50%, -50%)', // Keeps it perfectly centered on the original card
          }}
        >
          {/* Video Section */}
          <div className="relative w-full aspect-video bg-black">
            <iframe
              src={videoSrc}
              className="w-full h-full object-cover pointer-events-none"
              title="trailer-preview"
              allow="autoplay; encrypted-media"
            />
            <div className="absolute top-3 left-3 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 px-2 py-0.5 rounded text-[10px] font-bold text-yellow-400">6.1</div>
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded flex items-center gap-1 text-[10px] text-gray-300">
               <EyeIcon size={10} /> 835k
            </div>
          </div>

          {/* Info Section */}
          <div className="p-3 flex flex-col gap-2">
            <h3 className="text-white font-bold text-base leading-tight uppercase">
              {trailer.title || "The Internship"}
            </h3>
            <p className="text-gray-400 text-[10px] line-clamp-2 leading-relaxed">
              {trailer.description || "A CIA-trained assassin recruits other graduates from her secret childhood program to help her stop a global threat."}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayClick(trailer);
                }}
                className="flex-1 bg-primary hover:bg-primary-dull cursor-pointer text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
              >
                Details
              </button>
              <button className="bg-[#1a1d26] hover:bg-[#252a36] text-primary p-2 rounded-lg border border-white/5 transition-colors">
                <BookmarkIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MovieTrailer = () => {
  const [currentVideo, setCurrentVideo] = useState(dummyTrailers[0]);

  return (
    // HIGHLIGHT 2: 'overflow-visible' allows cards to pop outside the container boundaries
    <div className='px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-10 overflow-visible min-h-screen'>
      <p className='text-gray-300 font-medium text-lg max-md:text-sm max-w-lg pl-6 sm:pl-0'>
        Trailers
      </p>

      <div className="relative mt-6">
        <BlurCircle top='0px' left='-100px' />
      </div>

      <div className="relative w-full max-w-6xl mx-auto mt-10 z-10">
        <div className="relative pt-[56.25%] w-full bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
          <iframe
            src={`${getEmbedUrl(currentVideo.videoUrl)}?rel=0&autoplay=1`}
            title="Main Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg"
          />
        </div>
      </div>

      <div className="relative">
        <BlurCircle top='-150px' right='80px' />
      </div>

      {/* HIGHLIGHT 3: 'isolate' creates a new stacking context for z-index to work properly */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-12 max-w-6xl mx-auto px-2 isolate'>
        {dummyTrailers.map((trailer, index) => (
          <TrailerItem 
            key={index} 
            trailer={trailer} 
            onPlayClick={setCurrentVideo} 
          />
        ))}
      </div>
    </div>
  );
};

export default MovieTrailer;