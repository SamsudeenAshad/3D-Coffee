'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollSequenceProps {
  totalFrames: number;
}

export default function ScrollSequence({ totalFrames }: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameStr = i.toString().padStart(3, '0');
      img.src = `/frames/frame${frameStr}.png`;
      
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
      };
      
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, [totalFrames]);

  // Handle scroll and drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container || images.length !== totalFrames) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    let animationFrameId: number;
    let currentFrameIndex = 0;

    const drawFrame = (index: number) => {
        if (images[index] && images[index].complete) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
        }
    }

    const handleScroll = () => {
      // Calculate how far we've scrolled inside the container
      const containerRect = container.getBoundingClientRect();
      const scrollProgress = -containerRect.top / (containerRect.height - window.innerHeight);
      
      // Clamp between 0 and 1
      const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
      
      // Calculate which frame to show
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(clampedProgress * totalFrames)
      );

      if (frameIndex !== currentFrameIndex) {
        currentFrameIndex = frameIndex;
        // Schedule drawing
        animationFrameId = requestAnimationFrame(() => drawFrame(currentFrameIndex));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Resize canvas
    const handleResize = () => {
      // Keep it 1000x1000 to match generated frames for best quality
      canvas.width = 1000;
      canvas.height = 1000;
      drawFrame(currentFrameIndex);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial setup
    handleResize(); 
    // Initial draw once first image is loaded (in case it wasn't when resize was called)
    if (images[0]?.complete) {
        drawFrame(0);
    } else {
        images[0].onload = () => drawFrame(0);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [images, totalFrames]);

  const loadProgress = Math.floor((imagesLoaded / totalFrames) * 100);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#0a0a0a]">
      {/* Sticky container to keep canvas in view while scrolling */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        {loadProgress < 100 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-50 text-white font-mono">
             <p className="text-xl mb-4 font-light tracking-widest text-neutral-300">BREWING</p>
             <div className="w-64 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-600 transition-all duration-300" 
                  style={{ width: `${loadProgress}%` }}
                />
             </div>
             <p className="mt-4 text-neutral-500 text-sm">{loadProgress}%</p>
          </div>
        )}
        
        {/* Canvas that holds the animation */}
        <canvas 
          ref={canvasRef} 
          className="w-full max-w-[1200px] h-auto object-contain scale-110 md:scale-100"
        />

        {/* Optional overlay gradient to blend with next/prev sections */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-[#0a0a0a]/80" />
      </div>
    </div>
  );
}
