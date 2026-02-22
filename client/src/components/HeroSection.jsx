// import { ArrowRight, Calendar1Icon, ClockIcon } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'

// const HeroSection = () => {
//     const navigate = useNavigate();
//     return (
//         <div className='flex flex-col items-start justify-center gap-8 px-10 md:px-14 lg:px-23 bg-[url("/backgroundImage.jpg")] bg-cover bg-center h-screen max-md:overflow-hidden max-md:bg-[url("/mobileback.jpg")] max-md:bg-center max-md:bg-cover'>
//             <div className="flex flex-col items-start justify-center max-md:text-sm mt-10 min-2xl:text-xl">
//                 <img src="/MarvelLogo.png" alt="Logo" className='w-60 mx-2 max-md:w-40' />
//                 <h1 className='text-6xl md: leading-18 max-w-120 font-semibold li mx-2 max-md:text-3xl max-md:leading-10'>MOON KNIGHT</h1>
//                 <div className="flex mx-3 my-2 gap-6 max-sm:flex-col max-sm:gap-2 text-gray-300 max-md:font-semibold">
//                     <span>Action | Adventure | Superhero</span>
//                     <div className="flex items-center">
//                         <Calendar1Icon className='w-4 h-4 mx-1' />2022
//                     </div>
//                     <div className="flex items-center">
//                         <ClockIcon className='w-4 h-4 mx-1' />5hr 15min
//                     </div>
//                 </div>
//                 <p className='max-w-md mx-3 max-md:font-semibold min-2xl:max-w-lg text-gray-300 max-md:max-w-sm'>Moon Knight follows Marc Spector, a former mercenary with Dissociative Identity Disorder, who becomes the avatar of the Egyptian moon god Khonshu.</p>
//                 <button className='flex items-center px-5 py-3 max-md:px-4 text-md min-2xl:my-6 font-medium bg-primary hover:bg-primary-dull transition rounded-full cursor-pointer my-4 mx-3 max-md:text-xs' onClick={() => { navigate('/movies') }}>
//                     Explore Movies
//                     <ArrowRight className='w-5 h-5 ml-1' />
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default HeroSection


// import { useState, useEffect } from 'react';
// import { PlayIcon, InfoIcon, StarIcon } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { dummyTrailers } from '../assets/assets'; // Make sure this matches your data source

// const HeroSection = () => {
//     const navigate = useNavigate();
//     // State to track which movie is currently displayed in the hero
//     const [heroMovie, setHeroMovie] = useState(dummyTrailers[0]);

//     // Optional: Preload images to prevent flickering (Simple implementation)
//     useEffect(() => {
//         dummyTrailers.forEach((movie) => {
//             const img = new Image();
//             img.src = movie.image;
//         });
//     }, []);

//     return (
//         <div className="relative w-full h-screen text-white overflow-hidden">
            
//             {/* --- 1. DYNAMIC BACKGROUND IMAGE --- */}
//             <div className="absolute inset-0 -z-10">
//                 {/* The Key helps React trigger the fade-in animation when source changes */}
//                 <img 
//                     key={heroMovie.id} 
//                     src={heroMovie.image} 
//                     alt={heroMovie.title} 
//                     className="w-full h-full object-cover animate-in fade-in duration-700"
//                 />
                
//                 {/* --- 2. GRADIENT OVERLAYS (Crucial for text readability) --- */}
//                 {/* Bottom to Top Fade */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/40 to-transparent" />
//             </div>

//             {/* --- 3. MAIN CONTENT CONTAINER --- */}
//             <div className="absolute bottom-0 w-full px-8 md:px-14 lg:px-20 pb-12 md:pb-16 flex flex-col md:flex-row items-end justify-between gap-10">
                
//                 {/* --- LEFT SIDE: Movie Info --- */}
//                 <div className="flex flex-col items-start gap-4 max-w-2xl z-10 animate-in slide-in-from-left-10 duration-500">
                    
//                     {/* Meta Badges */}
//                     <div className="flex items-center gap-3 font-medium text-sm">
//                         <span className="bg-primary px-2 py-0.5 rounded-xl text-sm text-white">
//                             Movie
//                         </span>
//                         <div className="flex items-center gap-1 text-yellow-400">
//                             <StarIcon size={14} fill="currentColor" />
//                             <span className="text-white">6.9</span>
//                         </div>
//                         <span className="text-gray-400">2026</span>
//                     </div>

//                     {/* Title */}
//                     <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight uppercase">
//                         {heroMovie.title || "Moon Knight"}
//                     </h1>

//                     {/* Description */}
//                     <p className="text-gray-300 text-sm md:text-base line-clamp-3 max-w-lg leading-relaxed">
//                         {heroMovie.description || "Simon and Trevor, two actors at opposite ends of their careers, chase life-changing roles in this gripping drama."}
//                     </p>

//                     {/* Action Buttons */}
//                     <div className="flex items-center gap-3 mt-2">
//                         <button 
//                             className="flex items-center gap-2 px-6 py-3 cursor-pointer bg-primary hover:bg-primary-dull text-white rounded-full font-semibold transition-all shadow-lg shadow-blue-900/40"
//                             onClick={() => navigate('/movies')}
//                         >
//                             <PlayIcon size={18} fill="currentColor" />
//                             Book Now
//                         </button>
//                         <button className="flex items-center gap-2 px-6 py-3 cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold transition-all"
//                         onClick={() => navigate('/movies')}>
//                             <InfoIcon size={18} />
//                             More Info
//                         </button>
//                     </div>
//                 </div>

//                 {/* --- RIGHT SIDE: Thumbnail Carousel --- */}
//                 {/* Matches the visual style of image_41d157.jpg */}
//                 <div className="hidden lg:flex gap-4 z-20">
//                     {dummyTrailers.slice(0, 5).map((movie, index) => (
//                         <div 
//                             key={index}
//                             onClick={() => setHeroMovie(movie)}
//                             className={`
//                                 relative w-28 aspect-[2/3] rounded-lg cursor-pointer overflow-hidden transition-all duration-300
//                                 ${heroMovie.id === movie.id || (heroMovie === movie) // Check match
//                                     ? 'border-2 border-primary scale-110 shadow-xl' // Active Style
//                                     : 'border-transparent opacity-60 hover:opacity-200 hover:scale-105' // Inactive Style
//                                 }
//                             `}
//                         >
//                             <img 
//                                 src={movie.image} 
//                                 alt={movie.title} 
//                                 className="w-full h-full object-cover"
//                             />
//                             {/* Dark overlay on inactive items to make active one pop */}
//                             {heroMovie !== movie && (
//                                 <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
//                             )}
//                             {/* Title overlay at bottom of thumbnail */}
//                             <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-2">
//                                 <p className="text-[10px] text-white font-medium truncate text-center">
//                                     {movie.title}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default HeroSection;

import { useState, useEffect } from 'react';
import { PlayIcon, InfoIcon, StarIcon, Calendar1Icon, ClockIcon } from 'lucide-react'; // Added missing icons
import { useNavigate } from 'react-router-dom';
import { dummyTrailers } from '../assets/assets'; 

const HeroSection = () => {
    const navigate = useNavigate();
    
    const [currentIndex, setCurrentIndex] = useState(0);

    // Safety check: Ensure dummyTrailers exists and has data
    const moviesList = dummyTrailers && dummyTrailers.length > 0 ? dummyTrailers.slice(0, 5) : [];
    const heroMovie = moviesList[currentIndex];

    useEffect(() => {
        if (moviesList.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % moviesList.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [moviesList.length]);

    const handleSelect = (index) => {
        setCurrentIndex(index);
    };

    // Prevent crash if data is missing
    if (!heroMovie) return <div className="h-screen w-full bg-black text-white flex items-center justify-center">Loading Movies...</div>;

    return (
        // FIX 1: Removed 'bg-black' to prevent covering the image
        <div className="relative w-full h-screen text-white overflow-hidden bg-gray-900">
            
            {/* --- 1. DYNAMIC BACKGROUND IMAGE --- */}
            {/* FIX 2: Removed '-z-10'. Since this div is first, it naturally sits behind the content. */}
            <div className="absolute inset-0 w-full h-full">
                <img 
                    key={currentIndex} 
                    src={heroMovie.image} // Ensure your data uses '.image'. If not, try '.primaryImage'
                    alt={heroMovie.title} 
                    className="w-full h-full brightness-150 object-cover animate-in fade-in duration-700"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014] via-black/50 to-transparent" />
            </div>

            {/* --- 3. MAIN CONTENT CONTAINER --- */}
            {/* Added 'relative z-10' to ensure this sits ON TOP of the background */}
            <div className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-16 px-8 md:px-14 lg:px-20">
                
                <div className="flex flex-col lg:flex-row items-end justify-between gap-10 w-full">
                    
                    {/* --- LEFT SIDE: Movie Info --- */}
                    <div className="flex flex-col items-start gap-4 max-w-2xl animate-in slide-in-from-left-10 duration-500">
                        
                        {/* Meta Badges */}
                        <div className="flex items-center gap-3 font-medium text-sm">
                            <span className="bg-primary px-3 py-1 rounded-full text-xs text-white uppercase tracking-wider">
                                Movie
                            </span>
                            <div className="flex items-center gap-1 text-yellow-400">
                                <StarIcon size={16} fill="currentColor" />
                                <span className="text-white font-bold">6.9</span>
                            </div>
                            <span className="text-gray-300">2026</span>
                            <span className="text-gray-400 flex items-center gap-1"><ClockIcon size={14}/> 2h 15m</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight uppercase drop-shadow-lg">
                            {heroMovie.title || "Moon Knight"}
                        </h1>

                        {/* Description */}
                        <p className="text-gray-300 text-sm md:text-base line-clamp-3 max-w-lg leading-relaxed drop-shadow-md">
                            {heroMovie.description || "Simon and Trevor, two actors at opposite ends of their careers, chase life-changing roles in this gripping drama."}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mt-4">
                            <button 
                                className="flex items-center gap-2 px-8 py-3.5 cursor-pointer bg-primary hover:bg-primary-dull text-white rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105"
                                onClick={() => navigate('/movies')}
                            >
                                <PlayIcon size={20} fill="currentColor" />
                                Book Now
                            </button>
                            <button 
                                className="flex items-center gap-2 px-8 py-3.5 cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-full transition-all hover:scale-105"
                                onClick={() => navigate('/movies')}
                            >
                                <InfoIcon size={20} />
                                More Info
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: Thumbnail Carousel --- */}
                    <div className="hidden lg:flex gap-4 pb-2">
                        {moviesList.map((movie, index) => {
                            const isActive = index === currentIndex;
                            
                            return (
                                <div 
                                    key={index}
                                    onClick={() => handleSelect(index)}
                                    className={`
                                        relative rounded-xl cursor-pointer overflow-hidden transition-all duration-500 ease-in-out
                                        ${isActive 
                                            ? 'w-40 aspect-[2/3] ring-2 ring-primary shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-110 -translate-y-4 z-10' 
                                            : 'w-28 aspect-[2/3] opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-105'
                                        }
                                    `}
                                >
                                    <img 
                                        src={movie.image} 
                                        alt={movie.title} 
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                                    {/* Title */}
                                    <div className={`absolute bottom-3 left-0 w-full px-2 text-center transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                        <p className="text-white text-[10px] font-bold uppercase tracking-wider truncate">
                                            {movie.title}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;