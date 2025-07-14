
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

type Choice = 'rock' | 'paper' | 'scissors';

interface GameResult {
  winner: 'player' | 'computer' | 'tie';
  playerChoice: Choice;
  computerChoice: Choice;
}

const choices: Choice[] = ['rock', 'paper', 'scissors'];

const choiceEmojis = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️'
};

const choiceNames = {
  rock: { en: 'Rock', ar: 'حجر' },
  paper: { en: 'Paper', ar: 'ورق' },
  scissors: { en: 'Scissors', ar: 'مقص' }
};

const RockPaperScissors = () => {
  const { language } = useLanguage();
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getWinner = (playerChoice: Choice, computerChoice: Choice): 'player' | 'computer' | 'tie' => {
    if (playerChoice === computerChoice) return 'tie';
    
    if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
      return 'player';
    }
    
    return 'computer';
  };

  const playGame = (playerChoice: Choice) => {
    setIsPlaying(true);
    
    setTimeout(() => {
      const computerChoice = choices[Math.floor(Math.random() * choices.length)];
      const winner = getWinner(playerChoice, computerChoice);
      
      const result: GameResult = {
        winner,
        playerChoice,
        computerChoice
      };
      
      setLastResult(result);
      
      if (winner === 'player') {
        setPlayerScore(prev => prev + 1);
      } else if (winner === 'computer') {
        setComputerScore(prev => prev + 1);
      }
      
      setIsPlaying(false);
    }, 1000);
  };

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setLastResult(null);
    setIsPlaying(false);
  };

  const getResultMessage = () => {
    if (!lastResult) return '';
    
    if (lastResult.winner === 'tie') {
      return language === 'en' ? "It's a tie!" : 'تعادل!';
    } else if (lastResult.winner === 'player') {
      return language === 'en' ? 'You win!' : 'أنت تفوز!';
    } else {
      return language === 'en' ? 'Computer wins!' : 'الكمبيوتر يفوز!';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Score */}
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

      {/* Game Area */}
      <div className="flex justify-center gap-8 items-center min-h-[120px]">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">
            {language === 'en' ? 'Your Choice' : 'اختيارك'}
          </div>
          <div className="text-6xl">
            {lastResult ? choiceEmojis[lastResult.playerChoice] : '❓'}
          </div>
        </div>
        
        <div className="text-4xl text-muted-foreground">VS</div>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">
            {language === 'en' ? 'Computer Choice' : 'اختيار الكمبيوتر'}
          </div>
          <div className="text-6xl">
            {isPlaying ? '🎲' : lastResult ? choiceEmojis[lastResult.computerChoice] : '❓'}
          </div>
        </div>
      </div>

      {/* Result */}
      {lastResult && !isPlaying && (
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            lastResult.winner === 'player' ? 'text-green-600' :
            lastResult.winner === 'computer' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {getResultMessage()}
          </div>
        </div>
      )}

      {/* Choice Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        {choices.map((choice) => (
          <Button
            key={choice}
            onClick={() => playGame(choice)}
            disabled={isPlaying}
            variant="outline"
            size="lg"
            className="flex flex-col items-center p-6 h-auto min-w-[100px]"
          >
            <div className="text-3xl mb-2">{choiceEmojis[choice]}</div>
            <div className="text-sm">{choiceNames[choice][language]}</div>
          </Button>
        ))}
      </div>

      {/* Reset Button */}
      <Button onClick={resetGame} variant="secondary">
        {language === 'en' ? 'Reset Game' : 'إعادة تشغيل'}
      </Button>

      {/* Instructions */}
      <div className="text-sm text-muted-foreground text-center max-w-md">
        {language === 'en' 
          ? 'First to 5 wins! Rock beats Scissors, Scissors beats Paper, Paper beats Rock.'
          : 'أول من يصل إلى 5 انتصارات يفوز! الحجر يهزم المقص، المقص يهزم الورق، الورق يهزم الحجر.'
        }
      </div>
    </div>
  );
};

export default RockPaperScissors;
