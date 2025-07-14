
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };

const SnakeGame = () => {
  const { language } = useLanguage();
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection({ x: 0, y: 0 });
    setGameRunning(false);
    setScore(0);
    setGameOver(false);
  };

  const startGame = () => {
    setGameRunning(true);
    setDirection({ x: 1, y: 0 });
  };

  const moveSnake = useCallback(() => {
    if (!gameRunning) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setGameRunning(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameRunning, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

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
        className="relative bg-green-100 border-4 border-green-600 rounded-lg"
        style={{ width: `${GRID_SIZE * 20}px`, height: `${GRID_SIZE * 20}px` }}
      >
        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute w-5 h-5 rounded-sm ${
              index === 0 ? 'bg-green-800' : 'bg-green-600'
            }`}
            style={{
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
            }}
          />
        ))}
        
        {/* Food */}
        <div
          className="absolute w-5 h-5 bg-red-500 rounded-full"
          style={{
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
          }}
        />
      </div>

      <div className="flex gap-4">
        {!gameRunning && !gameOver && (
          <Button onClick={startGame} className="px-8">
            {language === 'en' ? 'Start Game' : 'ابدأ اللعبة'}
          </Button>
        )}
        
        {(gameOver || gameRunning) && (
          <Button onClick={resetGame} variant="outline" className="px-8">
            {language === 'en' ? 'Reset Game' : 'إعادة تشغيل'}
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {language === 'en' 
          ? 'Use arrow keys to control the snake' 
          : 'استخدم مفاتيح الأسهم للتحكم في الثعبان'
        }
      </div>
    </div>
  );
};

export default SnakeGame;
