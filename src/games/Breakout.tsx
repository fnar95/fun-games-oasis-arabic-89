
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  destroyed: boolean;
  color: string;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const BALL_SIZE = 8;
const BRICK_ROWS = 6;
const BRICK_COLS = 10;

const Breakout = () => {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [paddleX, setPaddleX] = useState(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [ball, setBall] = useState<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 40,
    dx: 3,
    dy: -3
  });
  const [bricks, setBricks] = useState<Brick[]>([]);

  const initializeBricks = useCallback(() => {
    const newBricks: Brick[] = [];
    const brickWidth = CANVAS_WIDTH / BRICK_COLS;
    const brickHeight = 20;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: col * brickWidth,
          y: row * brickHeight + 50,
          width: brickWidth - 2,
          height: brickHeight - 2,
          destroyed: false,
          color: colors[row]
        });
      }
    }
    setBricks(newBricks);
  }, []);

  const resetGame = () => {
    setGameRunning(false);
    setScore(0);
    setLives(3);
    setGameWon(false);
    setGameOver(false);
    setPaddleX(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 40,
      dx: 3,
      dy: -3
    });
    initializeBricks();
  };

  const startGame = () => {
    setGameRunning(true);
  };

  useEffect(() => {
    initializeBricks();
  }, [initializeBricks]);

  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = setInterval(() => {
      setBall(prevBall => {
        let newBall = { ...prevBall };
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;

        // Ball collision with walls
        if (newBall.x <= 0 || newBall.x >= CANVAS_WIDTH - BALL_SIZE) {
          newBall.dx = -newBall.dx;
        }
        if (newBall.y <= 0) {
          newBall.dy = -newBall.dy;
        }

        // Ball collision with paddle
        if (
          newBall.y + BALL_SIZE >= CANVAS_HEIGHT - PADDLE_HEIGHT - 10 &&
          newBall.x >= paddleX &&
          newBall.x <= paddleX + PADDLE_WIDTH &&
          newBall.dy > 0
        ) {
          newBall.dy = -newBall.dy;
          // Add some angle based on where ball hits paddle
          const hitPos = (newBall.x - paddleX) / PADDLE_WIDTH;
          newBall.dx = (hitPos - 0.5) * 6;
        }

        // Ball falls below paddle
        if (newBall.y > CANVAS_HEIGHT) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameOver(true);
              setGameRunning(false);
            }
            return newLives;
          });
          // Reset ball position
          newBall = {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - 40,
            dx: 3,
            dy: -3
          };
        }

        // Ball collision with bricks
        setBricks(prevBricks => {
          const newBricks = [...prevBricks];
          let hitBrick = false;

          for (let i = 0; i < newBricks.length; i++) {
            const brick = newBricks[i];
            if (
              !brick.destroyed &&
              newBall.x < brick.x + brick.width &&
              newBall.x + BALL_SIZE > brick.x &&
              newBall.y < brick.y + brick.height &&
              newBall.y + BALL_SIZE > brick.y
            ) {
              brick.destroyed = true;
              hitBrick = true;
              setScore(prev => prev + 10);
              break;
            }
          }

          if (hitBrick) {
            newBall.dy = -newBall.dy;
          }

          // Check if all bricks are destroyed
          if (newBricks.every(brick => brick.destroyed)) {
            setGameWon(true);
            setGameRunning(false);
          }

          return newBricks;
        });

        return newBall;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameRunning, paddleX]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameRunning) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      setPaddleX(Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, mouseX - PADDLE_WIDTH / 2)));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      if (e.key === 'ArrowLeft') {
        setPaddleX(prev => Math.max(0, prev - 20));
      } else if (e.key === 'ArrowRight') {
        setPaddleX(prev => Math.min(CANVAS_WIDTH - PADDLE_WIDTH, prev + 20));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bricks
    bricks.forEach(brick => {
      if (!brick.destroyed) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      }
    });

    // Draw paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex justify-center gap-8 text-xl font-bold">
        <div>{language === 'en' ? 'Score:' : 'النقاط:'} {score}</div>
        <div>{language === 'en' ? 'Lives:' : 'الأرواح:'} {lives}</div>
      </div>

      {gameWon && (
        <div className="text-2xl font-bold text-green-600">
          {language === 'en' ? 'You Win!' : 'أنت تفوز!'}
        </div>
      )}

      {gameOver && (
        <div className="text-2xl font-bold text-red-600">
          {language === 'en' ? 'Game Over!' : 'انتهت اللعبة!'}
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-gray-300 rounded-lg cursor-crosshair"
      />

      <div className="flex gap-4">
        {!gameRunning && !gameWon && !gameOver && (
          <Button onClick={startGame} className="px-8">
            {language === 'en' ? 'Start Game' : 'ابدأ اللعبة'}
          </Button>
        )}
        
        <Button onClick={resetGame} variant="outline" className="px-8">
          {language === 'en' ? 'Reset Game' : 'إعادة تشغيل'}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {language === 'en' 
          ? 'Move paddle with mouse or arrow keys' 
          : 'حرك المضرب بالماوس أو مفاتيح الأسهم'
        }
      </div>
    </div>
  );
};

export default Breakout;
