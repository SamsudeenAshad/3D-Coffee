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
        animationFrameId = requestAnimationFrame(() => drawFrame(currentFrameIndex));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Resize canvas
    const handleResize = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      drawFrame(currentFrameIndex);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial setup
    handleResize(); 
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
    <div ref={containerRef} className="scroll-container">
      <div className="scroll-sticky">
        {loadProgress < 100 && (
          <div className="loading-overlay">
             <p className="loading-text">BREWING</p>
             <div className="loading-bar-bg">
                <div 
                  className="loading-bar-fill" 
                  style={{ width: `${loadProgress}%` }}
                />
             </div>
             <p className="loading-percent">{loadProgress}%</p>
          </div>
        )}
        
        <canvas 
          ref={canvasRef} 
          className="scroll-canvas"
        />

        <div className="scroll-overlay" />
      </div>
    </div>
  );
}
