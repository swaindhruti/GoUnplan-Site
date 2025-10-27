import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export const StickyBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router=useRouter()
  const session=useSession()

const isHost=session.data?.user.role==="HOST"

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down & past threshold
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div 
      className={`fixed bottom-0 z-50 bg-purple-50 w-screen flex justify-center gap-3 items-center text-sm text-black text-center py-2 px-4 shadow-lg transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <h1>Ready to travel differently?</h1>
      <button  onClick={()=>router.push("/trips")} className="text-purple-700 underline cursor-pointer hover:text-purple-900 transition-all">
        Find a Trip
      </button>
     {!isHost&& <button onClick={()=>router.push("/dashboard/host")} className="text-purple-700 underline cursor-pointer hover:text-purple-900 transition-all">
        Become a Host
      </button>}
    </div>
  );
};