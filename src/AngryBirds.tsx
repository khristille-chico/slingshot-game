// import React, { useRef, useEffect, useState } from 'react';

// // --- Types & Interfaces ---
// interface Bird {
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   radius: number;
//   isDragging: boolean;
//   isFlying: boolean;
// }

// interface Target {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   alive: boolean;
//   color: string;
// }

// interface MousePos {
//   x: number;
//   y: number;
// }

// interface GameState {
//   bird: Bird;
//   mouse: MousePos;
//   targets: Target[];
//   score: number;
// }

// // --- Game Constants ---
// const CANVAS_WIDTH = 800;
// const CANVAS_HEIGHT = 500;
// const GRAVITY = 0.25;
// const SLING_X = 150;
// const SLING_Y = 350;
// const MAX_DRAG_DIST = 100;
// const LAUNCH_FORCE_MULT = 0.15;

// export default function AngryBirdsGame() {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
//   // High-frequency physics tracking via mutable ref to prevent React re-render lag
//   const gameStateRef = useRef<GameState>({
//     bird: { x: SLING_X, y: SLING_Y, vx: 0, vy: 0, radius: 15, isDragging: false, isFlying: false },
//     mouse: { x: 0, y: 0 },
//     targets: [
//       { x: 600, y: 400, width: 40, height: 60, alive: true, color: '#4CAF50' },
//       { x: 660, y: 400, width: 40, height: 60, alive: true, color: '#4CAF50' },
//       { x: 630, y: 340, width: 40, height: 60, alive: true, color: '#4CAF50' },
//     ],
//     score: 0
//   });

//   // UI state for reactive updates
//   const [score, setScore] = useState<number>(0);
//   const [gameMessage, setGameMessage] = useState<string>('Pull back the bird to aim!');

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     let animationFrameId: number;

//     const gameLoop = () => {
//       updatePhysics();
//       render(ctx);
//       animationFrameId = requestAnimationFrame(gameLoop);
//     };

//     animationFrameId = requestAnimationFrame(gameLoop);
//     return () => cancelAnimationFrame(animationFrameId);
//   }, []);

//   const updatePhysics = () => {
//     const state = gameStateRef.current;
//     const { bird, targets } = state;

//     if (bird.isFlying) {
//       bird.vy += GRAVITY;
//       bird.x += bird.vx;
//       bird.y += bird.vy;

//       // Collision loops
//       targets.forEach((target) => {
//         if (target.alive && checkCollision(bird, target)) {
//           target.alive = false;
//           state.score += 100;
//           setScore(state.score);
//         }
//       });

//       if (targets.every(t => !t.alive)) {
//         setGameMessage('You Win! 🎯');
//       }

//       // Boundaries reset check
//       if (bird.x > CANVAS_WIDTH || bird.y > CANVAS_HEIGHT - 20 || bird.x < 0) {
//         resetBird();
//       }
//     }
//   };

//   const checkCollision = (bird: Bird, rect: Target): boolean => {
//     const closestX = Math.max(rect.x, Math.min(bird.x, rect.x + rect.width));
//     const closestY = Math.max(rect.y, Math.min(bird.y, rect.y + rect.height));

//     const distanceX = bird.x - closestX;
//     const distanceY = bird.y - closestY;
//     const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

//     return distanceSquared < (bird.radius * bird.radius);
//   };

//   const calculateLaunchVelocity = () => {
//     const state = gameStateRef.current;
//     let dx = state.mouse.x - SLING_X;
//     let dy = state.mouse.y - SLING_Y;
//     const dist = Math.sqrt(dx * dx + dy * dy);

//     if (dist > MAX_DRAG_DIST) {
//       dx = (dx / dist) * MAX_DRAG_DIST;
//       dy = (dy / dist) * MAX_DRAG_DIST;
//     }

//     return {
//       vx: -dx * LAUNCH_FORCE_MULT,
//       vy: -dy * LAUNCH_FORCE_MULT,
//       constrainedX: SLING_X + dx,
//       constrainedY: SLING_Y + dy
//     };
//   };

//   const render = (ctx: CanvasRenderingContext2D) => {
//     const state = gameStateRef.current;
//     const { bird, targets } = state;

//     ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

//     // Sky
//     ctx.fillStyle = '#E0F7FA';
//     ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

//     // Ground
//     ctx.fillStyle = '#8D6E63';
//     ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);

//     // Slingshot base
//     ctx.strokeStyle = '#5D4037';
//     ctx.lineWidth = 6;
//     ctx.beginPath();
//     ctx.moveTo(SLING_X, SLING_Y);
//     ctx.lineTo(SLING_X, CANVAS_HEIGHT - 20);
//     ctx.stroke();

//     // Trajectory mechanic (Dots projection)
//     if (bird.isDragging) {
//       const { vx, vy } = calculateLaunchVelocity();
//       ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      
//       for (let t = 2; t < 40; t += 2) {
//         const simX = SLING_X + vx * t;
//         const simY = SLING_Y + vy * t + 0.5 * GRAVITY * t * t;
        
//         ctx.beginPath();
//         ctx.arc(simX, simY, 4, 0, Math.PI * 2);
//         ctx.fill();
//       }
//     }

//     // Targets
//     targets.forEach((target) => {
//       if (target.alive) {
//         ctx.fillStyle = target.color;
//         ctx.fillRect(target.x, target.y, target.width, target.height);
//         ctx.strokeStyle = '#2E7D32';
//         ctx.lineWidth = 2;
//         ctx.strokeRect(target.x, target.y, target.width, target.height);
//       }
//     });

//     // Bird
//     ctx.fillStyle = '#E53935';
//     ctx.beginPath();
//     ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.strokeStyle = '#B71C1C';
//     ctx.stroke();
//   };

//   // --- Interaction Event Handlers ---
//   const getCanvasMousePos = (e: React.MouseEvent<HTMLCanvasElement>): MousePos => {
//     const canvas = canvasRef.current;
//     if (!canvas) return { x: 0, y: 0 };
//     const rect = canvas.getBoundingClientRect();
//     return {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top
//     };
//   };

//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const state = gameStateRef.current;
//     if (state.bird.isFlying) return;

//     const pos = getCanvasMousePos(e);
//     const dx = pos.x - state.bird.x;
//     const dy = pos.y - state.bird.y;
    
//     if (Math.sqrt(dx * dx + dy * dy) < state.bird.radius + 20) {
//       state.bird.isDragging = true;
//     }
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const state = gameStateRef.current;
//     if (!state.bird.isDragging) return;

//     state.mouse = getCanvasMousePos(e);
//     const { constrainedX, constrainedY } = calculateLaunchVelocity();
    
//     state.bird.x = constrainedX;
//     state.bird.y = constrainedY;
//   };

//   const handleMouseUp = () => {
//     const state = gameStateRef.current;
//     if (!state.bird.isDragging) return;

//     state.bird.isDragging = false;
//     const { vx, vy } = calculateLaunchVelocity();
    
//     state.bird.vx = vx;
//     state.bird.vy = vy;
//     state.bird.isFlying = true;
//     setGameMessage('Launch! 🚀');
//   };

//   const resetBird = () => {
//     const state = gameStateRef.current;
//     state.bird.x = SLING_X;
//     state.bird.y = SLING_Y;
//     state.bird.vx = 0;
//     state.bird.vy = 0;
//     state.bird.isFlying = false;
    
//     if (state.targets.some(t => t.alive)) {
//       setGameMessage('Pull back the bird to aim!');
//     }
//   };

//   const restartGame = () => {
//     const state = gameStateRef.current;
//     state.score = 0;
//     setScore(0);
//     state.targets.forEach(t => t.alive = true);
//     resetBird();
//     setGameMessage('Targets Reset! Aim true.');
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', gap: '15px' }}>
//       <h2>Angry Birds TypeScript Engine</h2>
//       <div style={{ display: 'flex', gap: '40px', fontSize: '18px', fontWeight: 'bold' }}>
//         <div>Score: <span style={{ color: '#E53935' }}>{score}</span></div>
//         <div>Status: <span style={{ color: '#1565C0' }}>{gameMessage}</span></div>
//       </div>
      
//       <canvas
//         ref={canvasRef}
//         width={CANVAS_WIDTH}
//         height={CANVAS_HEIGHT}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//         style={{ border: '4px solid #37474F', borderRadius: '8px', cursor: 'grab', backgroundColor: '#E0F7FA' }}
//       />

//       <button 
//         onClick={restartGame}
//         style={{ padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#37474F', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//       >
//         Reset Game
//       </button>
//     </div>
//   );
// }

import { useRef, useEffect, useState } from 'react';

interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isDragging: boolean;
  isFlying: boolean;
}

interface Target {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
  color: string;
}

interface MousePos {
  x: number;
  y: number;
}

interface GameState {
  bird: Bird;
  mouse: MousePos;
  targets: Target[];
  score: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const GRAVITY = 0.25;
const SLING_X = 150;
const SLING_Y = 350;
const MAX_DRAG_DIST = 100;
const LAUNCH_FORCE_MULT = 0.15;

export default function AngryBirdsGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const gameStateRef = useRef<GameState>({
    bird: { x: SLING_X, y: SLING_Y, vx: 0, vy: 0, radius: 15, isDragging: false, isFlying: false },
    mouse: { x: 0, y: 0 },
    targets: [
      { x: 600, y: 400, width: 40, height: 60, alive: true, color: '#4CAF50' },
      { x: 660, y: 400, width: 40, height: 60, alive: true, color: '#4CAF50' },
      { x: 630, y: 340, width: 40, height: 60, alive: true, color: '#4CAF50' },
    ],
    score: 0
  });

  const [score, setScore] = useState<number>(0);
  const [gameMessage, setGameMessage] = useState<string>('Drag the bird to launch!');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Mobile Touch Prevention ---
    // Standard React touch events can trigger page bouncing/scrolling.
    // Adding native listeners with passive: false allows us to lock the screen during gameplay.
    const preventDefault = (e: TouchEvent) => {
      if (gameStateRef.current.bird.isDragging) {
        e.preventDefault();
      }
    };

    canvas.addEventListener('touchstart', preventDefault, { passive: false });
    canvas.addEventListener('touchmove', preventDefault, { passive: false });

    let animationFrameId: number;
    const gameLoop = () => {
      updatePhysics();
      render(ctx);
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('touchstart', preventDefault);
      canvas.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  const updatePhysics = () => {
    const state = gameStateRef.current;
    const { bird, targets } = state;

    if (bird.isFlying) {
      bird.vy += GRAVITY;
      bird.x += bird.vx;
      bird.y += bird.vy;

      targets.forEach((target) => {
        if (target.alive && checkCollision(bird, target)) {
          target.alive = false;
          state.score += 100;
          setScore(state.score);
        }
      });

      if (targets.every(t => !t.alive)) {
        setGameMessage('You Win! 🎯');
      }

      if (bird.x > CANVAS_WIDTH || bird.y > CANVAS_HEIGHT - 20 || bird.x < 0) {
        resetBird();
      }
    }
  };

  const checkCollision = (bird: Bird, rect: Target): boolean => {
    const closestX = Math.max(rect.x, Math.min(bird.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(bird.y, rect.y + rect.height));
    const distanceX = bird.x - closestX;
    const distanceY = bird.y - closestY;
    return (distanceX * distanceX + distanceY * distanceY) < (bird.radius * bird.radius);
  };

  const calculateLaunchVelocity = () => {
    const state = gameStateRef.current;
    let dx = state.mouse.x - SLING_X;
    let dy = state.mouse.y - SLING_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > MAX_DRAG_DIST) {
      dx = (dx / dist) * MAX_DRAG_DIST;
      dy = (dy / dist) * MAX_DRAG_DIST;
    }

    return {
      vx: -dx * LAUNCH_FORCE_MULT,
      vy: -dy * LAUNCH_FORCE_MULT,
      constrainedX: SLING_X + dx,
      constrainedY: SLING_Y + dy
    };
  };

  const render = (ctx: CanvasRenderingContext2D) => {
    const state = gameStateRef.current;
    const { bird, targets } = state;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sky
    ctx.fillStyle = '#E0F7FA';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Ground
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);

    // Slingshot
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(SLING_X, SLING_Y);
    ctx.lineTo(SLING_X, CANVAS_HEIGHT - 20);
    ctx.stroke();

    // Trajectory
    if (bird.isDragging) {
      const { vx, vy } = calculateLaunchVelocity();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      for (let t = 2; t < 40; t += 2) {
        const simX = SLING_X + vx * t;
        const simY = SLING_Y + vy * t + 0.5 * GRAVITY * t * t;
        ctx.beginPath();
        ctx.arc(simX, simY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Targets
    targets.forEach((target) => {
      if (target.alive) {
        ctx.fillStyle = target.color;
        ctx.fillRect(target.x, target.y, target.width, target.height);
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        ctx.strokeRect(target.x, target.y, target.width, target.height);
      }
    });

    // Bird
    ctx.fillStyle = '#E53935';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#B71C1C';
    ctx.stroke();
  };

  // --- Mobile Responsive Coordinate Scaling ---
  // Maps viewport pixels back to fixed internal coordinates (800x500)
  const getCanvasPointerPos = (clientX: number, clientY: number): MousePos => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    return {
      x: ((clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT
    };
  };

  // --- Unified Input Handlers ---
  const handlePointerStart = (clientX: number, clientY: number) => {
    const state = gameStateRef.current;
    if (state.bird.isFlying) return;

    const pos = getCanvasPointerPos(clientX, clientY);
    const dx = pos.x - state.bird.x;
    const dy = pos.y - state.bird.y;
    
    // Generous touch target hit-box for mobile fingers (+30 instead of +20)
    if (Math.sqrt(dx * dx + dy * dy) < state.bird.radius + 30) {
      state.bird.isDragging = true;
    }
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    const state = gameStateRef.current;
    if (!state.bird.isDragging) return;

    state.mouse = getCanvasPointerPos(clientX, clientY);
    const { constrainedX, constrainedY } = calculateLaunchVelocity();
    
    state.bird.x = constrainedX;
    state.bird.y = constrainedY;
  };

  const handlePointerEnd = () => {
    const state = gameStateRef.current;
    if (!state.bird.isDragging) return;

    state.bird.isDragging = false;
    const { vx, vy } = calculateLaunchVelocity();
    
    state.bird.vx = vx;
    state.bird.vy = vy;
    state.bird.isFlying = true;
    setGameMessage('Launch! 🚀');
  };

  const resetBird = () => {
    const state = gameStateRef.current;
    state.bird.x = SLING_X;
    state.bird.y = SLING_Y;
    state.bird.vx = 0;
    state.bird.vy = 0;
    state.bird.isFlying = false;
    if (state.targets.some(t => t.alive)) {
      setGameMessage('Drag the bird to launch!');
    }
  };

  const restartGame = () => {
    const state = gameStateRef.current;
    state.score = 0;
    setScore(0);
    state.targets.forEach(t => t.alive = true);
    resetBird();
    setGameMessage('Reset successful!');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      fontFamily: 'sans-serif', 
      gap: '12px',
      width: '100%',
      maxWidth: '800px',
      padding: '10px',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem' }}>Angry Birds Mobile</h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 8px', fontSize: '15px', fontWeight: 'bold' }}>
        <div>Score: <span style={{ color: '#E53935' }}>{score}</span></div>
        <div style={{ color: '#1565C0' }}>{gameMessage}</div>
      </div>
      
      {/* The Magic CSS Layer:
        Keeps internal calculations at 800x500 resolution but dynamically 
        scales the layout container to smoothly fit fluid mobile viewports.
      */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        
        // Mouse Listeners
        onMouseDown={(e) => handlePointerStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerEnd}
        onMouseLeave={handlePointerEnd}

        // Touch Listeners
        onTouchStart={(e) => handlePointerStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handlePointerEnd}
        
        style={{ 
          width: '100%',
          height: 'auto',
          aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
          border: '3px solid #37474F', 
          borderRadius: '12px', 
          backgroundColor: '#E0F7FA',
          touchAction: 'none', // Tells the mobile browser not to interfere with pinch/zooms
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      />

      <button 
        onClick={restartGame}
        style={{ 
          width: '100%',
          padding: '12px', 
          fontSize: '16px', 
          fontWeight: 'bold', 
          backgroundColor: '#37474F', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer',
          marginTop: '4px'
        }}
      >
        Reset Level
      </button>
    </div>
  );
}
