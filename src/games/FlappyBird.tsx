
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface Pipe {
  x: number;
  gap: number;
  height: number;
}

const BIRD_SIZE = 20;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const GAME_HEIGHT = 400;
const GAME_WIDTH = 600;

const FlappyBird = () => {
  const { language } = useLanguage();
  const [birdY, setBirdY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const jump = useCallback(() => {
    if (!gameRunning && !gameOver) {
      setGameRunning(true);
    }
    if (gameRunning) {
      setVelocity(-8);
    }
  }, [gameRunning, gameOver]);

  const resetGame = () => {
    setBirdY(200);
    setVelocity(0);
    setPipes([]);
    setGameRunning(false);
    setScore(0);
    setGameOver(false);
  };

  // Game physics
  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = setInterval(() => {
      // Update bird position
      setBirdY(prevY => {
        const newY = prevY + velocity;
        if (newY < 0 || newY > GAME_HEIGHT - BIRD_SIZE) {
          setGameOver(true);
          setGameRunning(false);
          return prevY;
        }
        return newY;
      });

      // Update velocity (gravity)
      setVelocity(prev => prev + 0.5);

      // Update pipes
      setPipes(prevPipes => {
        let newPipes = prevPipes.map(pipe => ({
          ...pipe,
          x: pipe.x - 3
        })).filter(pipe => pipe.x > -PIPE_WIDTH);

        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 200) {
          newPipes.push({
            x: GAME_WIDTH,
            gap: Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50,
            height: GAME_HEIGHT
          });
        }

        // Check collisions
        newPipes.forEach(pipe => {
          const birdLeft = 50;
          const birdRight = birdLeft + BIRD_SIZE;
          const birdTop = birdY;
          const birdBottom = birdY + BIRD_SIZE;

          if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
            if (birdTop < pipe.gap || birdBottom > pipe.gap + PIPE_GAP) {
              setGameOver(true);
              setGameRunning(false);
            }
          }

          // Score
          if (pipe.x + PIPE_WIDTH < birdLeft && pipe.x + PIPE_WIDTH > birdLeft - 3) {
            setScore(prev => prev + 1);
          }
        });

        return newPipes;
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameRunning, velocity, birdY]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="text-2xl font-bold mb-2">
          {language === 'en' ? 'Score:' : 'النقاط:'} {score}
        </div>
        {gameOver && (
          <div className="text-xl text-red-600 font-semibold">
            {language === 'en' ? 'Game Over!' : 'انتهت اللعبة!'}
          </div>
        )}
      </div>

      <div 
        className="relative bg-sky-200 border-4 border-blue-600 rounded-lg cursor-pointer overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={jump}
      >
        {/* Bird */}
        <div
          className="absolute w-5 h-5 bg-yellow-400 rounded-full border-2 border-orange-400 transition-all duration-75"
          style={{
            left: '50px',
            top: `${birdY}px`,
          }}
        />

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <div key={index}>
            {/* Top pipe */}
            <div
              className="absolute bg-green-600 border-2 border-green-800"
              style={{
                left: `${pipe.x}px`,
                top: '0px',
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.gap}px`,
              }}
            />
            {/* Bottom pipe */}
            <div
              className="absolute bg-green-600 border-2 border-green-800"
              style={{
                left: `${pipe.x}px`,
                top: `${pipe.gap + PIPE_GAP}px`,
                width: `${PIPE_WIDTH}px`,
                height: `${GAME_HEIGHT - pipe.gap - PIPE_GAP}px`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {!gameRunning && !gameOver && (
          <Button onClick={jump} className="px-8">
            {language === 'en' ? 'Start Game' : 'ابدأ اللعبة'}
          </Button>
        )}
        
        {gameOver && (
          <Button onClick={resetGame} className="px-8">
            {language === 'en' ? 'Play Again' : 'العب مرة أخرى'}
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {language === 'en' 
          ? 'Click or press spacebar to flap' 
          : 'انقر أو اضغط مسطحة المسافة للرفرفة'
        }
      </div>
    </div>
  );
};

export default FlappyBird;
