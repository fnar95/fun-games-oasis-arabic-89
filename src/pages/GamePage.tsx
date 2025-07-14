
import { useParams } from 'react-router-dom';
import { games } from '@/data/games';
import { useLanguage } from '@/context/LanguageContext';
import GameLayout from '@/components/GameLayout';
import TicTacToe from '@/games/TicTacToe';
import SnakeGame from '@/games/SnakeGame';
import MemoryGame from '@/games/MemoryGame';
import FlappyBird from '@/games/FlappyBird';
import RockPaperScissors from '@/games/RockPaperScissors';
import Breakout from '@/games/Breakout';
import Game2048 from '@/games/Game2048';
import SimonSays from '@/games/SimonSays';
import Pong from '@/games/Pong';
import Minesweeper from '@/games/Minesweeper';

const GamePage = () => {
  const { gameId } = useParams();
  const { language } = useLanguage();
  
  const game = games.find(g => g.id === gameId);
  
  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Game not found' : 'اللعبة غير موجودة'}
          </h1>
        </div>
      </div>
    );
  }

  const renderGame = () => {
    switch (game.id) {
      case 'tic-tac-toe':
        return <TicTacToe />;
      case 'snake':
        return <SnakeGame />;
      case 'memory':
        return <MemoryGame />;
      case 'flappy-bird':
        return <FlappyBird />;
      case 'rock-paper-scissors':
        return <RockPaperScissors />;
      case 'breakout':
        return <Breakout />;
      case '2048':
        return <Game2048 />;
      case 'simon-says':
        return <SimonSays />;
      case 'pong':
        return <Pong />;
      case 'minesweeper':
        return <Minesweeper />;
      default:
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{game.icon}</div>
            <h3 className="text-xl font-semibold mb-2">
              {language === 'en' ? 'Coming Soon!' : 'قريباً!'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'This game is under development and will be available soon.'
                : 'هذه اللعبة قيد التطوير وستكون متاحة قريباً.'
              }
            </p>
          </div>
        );
    }
  };

  return (
    <GameLayout
      title={game.title[language]}
      description={game.description[language]}
      instructions={game.instructions[language]}
    >
      {renderGame()}
    </GameLayout>
  );
};

export default GamePage;
