
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

type Board = (number | null)[][];

const Game2048 = () => {
  const { language } = useLanguage();
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const initializeBoard = useCallback(() => {
    const newBoard: Board = Array(4).fill(null).map(() => Array(4).fill(null));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }, []);

  const addRandomTile = (board: Board) => {
    const emptyCells: { row: number; col: number }[] = [];
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === null) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameWon(false);
    setGameOver(false);
  };

  useEffect(() => {
    resetGame();
  }, [initializeBoard]);

  const moveTiles = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || gameWon) return;

    const newBoard = board.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const slideArray = (arr: (number | null)[]) => {
      const filtered = arr.filter(val => val !== null) as number[];
      const merged: number[] = [];
      let i = 0;
      
      while (i < filtered.length) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          newScore += filtered[i] * 2;
          i += 2;
        } else {
          merged.push(filtered[i]);
          i++;
        }
      }
      
      while (merged.length < 4) {
        merged.push(0);
      }
      
      return merged.map(val => val === 0 ? null : val);
    };

    if (direction === 'left') {
      for (let row = 0; row < 4; row++) {
        const original = [...newBoard[row]];
        newBoard[row] = slideArray(newBoard[row]);
        if (JSON.stringify(original) !== JSON.stringify(newBoard[row])) {
          moved = true;
        }
      }
    } else if (direction === 'right') {
      for (let row = 0; row < 4; row++) {
        const original = [...newBoard[row]];
        newBoard[row] = slideArray([...newBoard[row]].reverse()).reverse();
        if (JSON.stringify(original) !== JSON.stringify(newBoard[row])) {
          moved = true;
        }
      }
    } else if (direction === 'up') {
      for (let col = 0; col < 4; col++) {
        const column = [newBoard[0][col], newBoard[1][col], newBoard[2][col], newBoard[3][col]];
        const original = [...column];
        const newColumn = slideArray(column);
        
        for (let row = 0; row < 4; row++) {
          newBoard[row][col] = newColumn[row];
        }
        
        if (JSON.stringify(original) !== JSON.stringify(newColumn)) {
          moved = true;
        }
      }
    } else if (direction === 'down') {
      for (let col = 0; col < 4; col++) {
        const column = [newBoard[0][col], newBoard[1][col], newBoard[2][col], newBoard[3][col]];
        const original = [...column];
        const newColumn = slideArray([...column].reverse()).reverse();
        
        for (let row = 0; row < 4; row++) {
          newBoard[row][col] = newColumn[row];
        }
        
        if (JSON.stringify(original) !== JSON.stringify(newColumn)) {
          moved = true;
        }
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);

      // Check for 2048 tile
      const has2048 = newBoard.some(row => row.some(cell => cell === 2048));
      if (has2048) {
        setGameWon(true);
      }

      // Check for game over
      const isBoardFull = newBoard.every(row => row.every(cell => cell !== null));
      if (isBoardFull) {
        // Check if any moves are possible
        let canMove = false;
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            const current = newBoard[row][col];
            if (
              (row < 3 && current === newBoard[row + 1][col]) ||
              (col < 3 && current === newBoard[row][col + 1])
            ) {
              canMove = true;
              break;
            }
          }
          if (canMove) break;
        }
        if (!canMove) {
          setGameOver(true);
        }
      }
    }
  }, [board, score, gameOver, gameWon]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          moveTiles('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveTiles('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          moveTiles('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveTiles('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveTiles]);

  const getTileColor = (value: number | null) => {
    if (!value) return 'bg-gray-200';
    const colors: { [key: number]: string } = {
      2: 'bg-gray-100 text-gray-700',
      4: 'bg-gray-200 text-gray-700',
      8: 'bg-orange-300 text-white',
      16: 'bg-orange-400 text-white',
      32: 'bg-orange-500 text-white',
      64: 'bg-red-400 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-purple-500 text-white',
      2048: 'bg-purple-600 text-white'
    };
    return colors[value] || 'bg-purple-700 text-white';
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="text-2xl font-bold mb-2">
          {language === 'en' ? 'Score:' : 'النقاط:'} {score}
        </div>
        {gameWon && (
          <div className="text-xl text-green-600 font-semibold">
            {language === 'en' ? 'You reached 2048!' : 'وصلت إلى 2048!'}
          </div>
        )}
        {gameOver && (
          <div className="text-xl text-red-600 font-semibold">
            {language === 'en' ? 'Game Over!' : 'انتهت اللعبة!'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 p-4 bg-gray-300 rounded-lg">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 rounded flex items-center justify-center font-bold text-lg ${getTileColor(cell)}`}
            >
              {cell}
            </div>
          ))
        )}
      </div>

      <Button onClick={resetGame} className="px-8">
        {language === 'en' ? 'New Game' : 'لعبة جديدة'}
      </Button>

      <div className="text-sm text-muted-foreground text-center">
        {language === 'en' 
          ? 'Use arrow keys to move tiles. Combine same numbers to reach 2048!' 
          : 'استخدم مفاتيح الأسهم لتحريك البلاط. ادمج الأرقام المتشابهة للوصول إلى 2048!'
        }
      </div>
    </div>
  );
};

export default Game2048;
