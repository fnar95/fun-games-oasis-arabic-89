
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;

const Pong = () => {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [winner, setWinner] = useState<'player' | 'computer' | null>(null);
  
  const [playerY, setPlayerY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [computerY, setComputerY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ball, setBall] = useState<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    dx: 4,
    dy: 4
  });

  const resetBall = useCallback(() => {
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: Math.random() > 0.5 ? 4 : -4,
      dy: (Math.random() - 0.5) * 6
    });
  }, []);

  const resetGame = () => {
    setGameRunning(false);
    setPlayerScore(0);
    setComputerScore(0);
    setGameWon(false);
    setWinner(null);
    setPlayerY(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setComputerY(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    resetBall();
  };

  const startGame = () => {
    setGameRunning(true);
    resetBall();
  };

  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = setInterval(() => {
      setBall(prevBall => {
        let newBall = { ...prevBall };
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;

        // Ball collision with top and bottom walls
        if (newBall.y <= 0 || newBall.y >= CANVAS_HEIGHT - BALL_SIZE) {
          newBall.dy = -newBall.dy;
        }

        // Ball collision with player paddle (left)
        if (
          newBall.x <= PADDLE_WIDTH &&
          newBall.y >= playerY &&
          newBall.y <= playerY + PADDLE_HEIGHT &&
          newBall.dx < 0
        ) {
          newBall.dx = -newBall.dx;
          // Add some angle based on where ball hits paddle
          const relativeIntersectY = (playerY + PADDLE_HEIGHT / 2) - newBall.y;
          const normalizedRelativeIntersectionY = relativeIntersectY / (PADDLE_HEIGHT / 2);
          newBall.dy = normalizedRelativeIntersectionY * -5;
        }

        // Ball collision with computer paddle (right)
        if (
          newBall.x >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
          newBall.y >= computerY &&
          newBall.y <= computerY + PADDLE_HEIGHT &&
          newBall.dx > 0
        ) {
          newBall.dx = -newBall.dx;
          const relativeIntersectY = (computerY + PADDLE_HEIGHT / 2) - newBall.y;
          const normalizedRelativeIntersectionY = relativeIntersectY / (PADDLE_HEIGHT / 2);
          newBall.dy = normalizedRelativeIntersectionY * -5;
        }

        // Ball goes out of bounds
        if (newBall.x < 0) {
          setComputerScore(prev => {
            const newScore = prev + 1;
            if (newScore >= 10) {
              setGameWon(true);
              setWinner('computer');
              setGameRunning(false);
            }
            return newScore;
          });
          return {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            dx: 4,
            dy: (Math.random() - 0.5) * 6
          };
        }

        if (newBall.x > CANVAS_WIDTH) {
          setPlayerScore(prev => {
            const newScore = prev + 1;
            if (newScore >= 10) {
              setGameWon(true);
              setWinner('player');
              setGameRunning(false);
            }
            return newScore;
          });
          return {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            dx: -4,
            dy: (Math.random() - 0.5) * 6
          };
        }

        return newBall;
      });

      // Computer AI - simple following behavior
      setComputerY(prevY => {
        const ballCenter = ball.y + BALL_SIZE / 2;
        const paddleCenter = prevY + PADDLE_HEIGHT / 2;
        const diff = ballCenter - paddleCenter;
        const speed = 3;
        
        if (Math.abs(diff) < speed) {
          return prevY;
        }
        
        if (diff > 0) {
          return Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prevY + speed);
        } else {
          return Math.max(0, prevY - speed);
        }
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameRunning, ball.y, playerY, computerY]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      if (e.key === 'ArrowUp') {
        setPlayerY(prev => Math.max(0, prev - 20));
      } else if (e.key === 'ArrowDown') {
        setPlayerY(prev => Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev + 20));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!gameRunning) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      setPlayerY(Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, mouseY - PADDLE_HEIGHT / 2)));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, computerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
  });

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex justify-center gap-8 text-xl font-bold">
        <div className="text-center">
          <div className="text-blue-600">{language === 'en' ? 'You' : 'أنت'}</div>
          <div className="text-3xl">{playerScore}</div>
        </div>
        <div className="text-2xl text-muted-foreground">-</div>
        <div className="text-center">
          <div className="text-red-600">{language === 'en' ? 'Computer' : 'الكمبيوتر'}</div>
          <div className="text-3xl">{computerScore}</div>
        </div>
      </div>

      {gameWon && (
        <div className={`text-2xl font-bold ${winner === 'player' ? 'text-green-600' : 'text-red-600'}`}>
          {winner === 'player' 
            ? (language === 'en' ? 'You Win!' : 'أنت تفوز!')
            : (language === 'en' ? 'Computer Wins!' : 'الكمبيوتر يفوز!')
          }
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-gray-300 rounded-lg cursor-crosshair"
      />

      <div className="flex gap-4">
        {!gameRunning && !gameWon && (
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
          ? 'Move paddle with mouse or arrow keys. First to 10 points wins!' 
          : 'حرك المضرب بالماوس أو مفاتيح الأسهم. أول من يصل إلى 10 نقاط يفوز!'
        }
      </div>
    </div>
  );
};

export default Pong;
