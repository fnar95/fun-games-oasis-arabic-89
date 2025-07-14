
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const TicTacToe = () => {
  const { language } = useLanguage();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const isBoardFull = board.every(cell => cell !== null);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        {winner ? (
          <h2 className="text-2xl font-bold text-green-600">
            {language === 'en' ? `Player ${winner} Wins!` : `اللاعب ${winner} يفوز!`}
          </h2>
        ) : isBoardFull ? (
          <h2 className="text-2xl font-bold text-yellow-600">
            {language === 'en' ? "It's a tie!" : 'تعادل!'}
          </h2>
        ) : (
          <h2 className="text-xl">
            {language === 'en' ? `Player ${isXNext ? 'X' : 'O'}'s turn` : `دور اللاعب ${isXNext ? 'X' : 'O'}`}
          </h2>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 w-64 h-64">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="w-20 h-20 bg-white border-2 border-gray-300 rounded-lg text-3xl font-bold hover:bg-gray-50 transition-colors"
          >
            {cell}
          </button>
        ))}
      </div>

      <Button onClick={resetGame} className="px-8">
        {language === 'en' ? 'New Game' : 'لعبة جديدة'}
      </Button>
    </div>
  );
};

export default TicTacToe;
