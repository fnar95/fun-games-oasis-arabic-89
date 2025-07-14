
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const colors = ['red', 'blue', 'green', 'yellow'] as const;
type Color = typeof colors[number];

const colorClasses = {
  red: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
  blue: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
  green: 'bg-green-500 hover:bg-green-600 active:bg-green-700',
  yellow: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700'
};

const SimonSays = () => {
  const { language } = useLanguage();
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Color[]>([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(0);

  const generateRandomColor = (): Color => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addToSequence = useCallback(() => {
    const newColor = generateRandomColor();
    setSequence(prev => [...prev, newColor]);
  }, []);

  const playSequence = useCallback(async (seq: Color[]) => {
    setIsDisplaying(true);
    setPlayerSequence([]);
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveColor(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColor(null);
    }
    
    setIsDisplaying(false);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setLevel(1);
    setSequence([generateRandomColor()]);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setLevel(0);
    setSequence([]);
    setPlayerSequence([]);
    setActiveColor(null);
    setIsDisplaying(false);
  };

  const handleColorClick = (color: Color) => {
    if (isDisplaying || gameOver || !gameStarted) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    // Check if the player's input is correct
    const isCorrect = newPlayerSequence.every((c, i) => c === sequence[i]);
    
    if (!isCorrect) {
      setGameOver(true);
      return;
    }

    // Check if player completed the sequence
    if (newPlayerSequence.length === sequence.length) {
      setLevel(prev => prev + 1);
      setTimeout(() => {
        addToSequence();
      }, 1000);
    }
  };

  useEffect(() => {
    if (sequence.length > 0 && gameStarted) {
      playSequence(sequence);
    }
  }, [sequence, gameStarted, playSequence]);

  const getButtonClass = (color: Color) => {
    const baseClass = `w-24 h-24 rounded-lg border-4 border-gray-300 transition-all duration-150 ${colorClasses[color]}`;
    const glowClass = activeColor === color ? 'brightness-150 scale-105' : '';
    const disabledClass = isDisplaying ? 'cursor-not-allowed' : 'cursor-pointer';
    
    return `${baseClass} ${glowClass} ${disabledClass}`;
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center">
        <div className="text-2xl font-bold mb-2">
          {language === 'en' ? 'Level:' : 'المستوى:'} {level}
        </div>
        {gameOver && (
          <div className="text-xl text-red-600 font-semibold">
            {language === 'en' ? 'Game Over!' : 'انتهت اللعبة!'} 
            <br />
            {language === 'en' ? `You reached level ${level}` : `وصلت إلى المستوى ${level}`}
          </div>
        )}
        {isDisplaying && (
          <div className="text-lg text-blue-600">
            {language === 'en' ? 'Watch the sequence...' : 'شاهد التسلسل...'}
          </div>
        )}
        {gameStarted && !isDisplaying && !gameOver && (
          <div className="text-lg text-green-600">
            {language === 'en' ? 'Your turn!' : 'دورك!'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <button
            key={color}
            className={getButtonClass(color)}
            onClick={() => handleColorClick(color)}
            disabled={isDisplaying || gameOver || !gameStarted}
          />
        ))}
      </div>

      <div className="flex gap-4">
        {!gameStarted && (
          <Button onClick={startGame} className="px-8">
            {language === 'en' ? 'Start Game' : 'ابدأ اللعبة'}
          </Button>
        )}
        
        {(gameOver || gameStarted) && (
          <Button onClick={resetGame} variant="outline" className="px-8">
            {language === 'en' ? 'Reset Game' : 'إعادة تشغيل'}
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground text-center max-w-md">
        {language === 'en' 
          ? 'Watch the sequence of colors, then click them in the same order. Each level adds one more color to remember!'
          : 'شاهد تسلسل الألوان، ثم انقر عليها بنفس الترتيب. كل مستوى يضيف لونا آخر للتذكر!'
        }
      </div>
    </div>
  );
};

export default SimonSays;
