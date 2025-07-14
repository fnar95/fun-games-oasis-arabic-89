
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const GRID_SIZE = 9;
const MINE_COUNT = 10;

const Minesweeper = () => {
  const { language } = useLanguage();
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [flagCount, setFlagCount] = useState(MINE_COUNT);
  const [firstClick, setFirstClick] = useState(true);

  const initializeBoard = useCallback((excludeRow?: number, excludeCol?: number) => {
    const newBoard: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines randomly, excluding the first clicked cell
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      
      if (!newBoard[row][col].isMine && !(row === excludeRow && col === excludeCol)) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mine counts
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 && newRow < GRID_SIZE &&
                newCol >= 0 && newCol < GRID_SIZE &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    return newBoard;
  }, []);

  const resetGame = () => {
    setBoard(initializeBoard());
    setGameStatus('playing');
    setFlagCount(MINE_COUNT);
    setFirstClick(true);
  };

  useEffect(() => {
    resetGame();
  }, [initializeBoard]);

  const revealCell = useCallback((row: number, col: number) => {
    if (gameStatus !== 'playing') return;

    setBoard(prevBoard => {
      let newBoard = prevBoard.map(r => r.map(c => ({ ...c })));

      // Handle first click - ensure it's not a mine
      if (firstClick) {
        if (newBoard[row][col].isMine) {
          newBoard = initializeBoard(row, col);
        }
        setFirstClick(false);
      }

      const cell = newBoard[row][col];
      if (cell.isRevealed || cell.isFlagged) return newBoard;

      cell.isRevealed = true;

      if (cell.isMine) {
        // Game over - reveal all mines
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (newBoard[r][c].isMine) {
              newBoard[r][c].isRevealed = true;
            }
          }
        }
        setGameStatus('lost');
        return newBoard;
      }

      // If cell has no neighboring mines, reveal adjacent cells
      if (cell.neighborMines === 0) {
        const queue: [number, number][] = [[row, col]];
        const visited = new Set<string>();

        while (queue.length > 0) {
          const [currentRow, currentCol] = queue.shift()!;
          const key = `${currentRow}-${currentCol}`;
          
          if (visited.has(key)) continue;
          visited.add(key);

          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = currentRow + i;
              const newCol = currentCol + j;
              
              if (
                newRow >= 0 && newRow < GRID_SIZE &&
                newCol >= 0 && newCol < GRID_SIZE &&
                !newBoard[newRow][newCol].isRevealed &&
                !newBoard[newRow][newCol].isFlagged &&
                !newBoard[newRow][newCol].isMine
              ) {
                newBoard[newRow][newCol].isRevealed = true;
                if (newBoard[newRow][newCol].neighborMines === 0) {
                  queue.push([newRow, newCol]);
                }
              }
            }
          }
        }
      }

      // Check for win condition
      let revealedCells = 0;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (newBoard[r][c].isRevealed && !newBoard[r][c].isMine) {
            revealedCells++;
          }
        }
      }

      if (revealedCells === GRID_SIZE * GRID_SIZE - MINE_COUNT) {
        setGameStatus('won');
      }

      return newBoard;
    });
  }, [gameStatus, firstClick, initializeBoard]);

  const toggleFlag = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing') return;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => r.map(c => ({ ...c })));
      const cell = newBoard[row][col];
      
      if (cell.isRevealed) return newBoard;

      if (cell.isFlagged) {
        cell.isFlagged = false;
        setFlagCount(prev => prev + 1);
      } else if (flagCount > 0) {
        cell.isFlagged = true;
        setFlagCount(prev => prev - 1);
      }

      return newBoard;
    });
  };

  const getCellDisplay = (cell: Cell) => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborMines === 0) return '';
    return cell.neighborMines.toString();
  };

  const getCellClass = (cell: Cell) => {
    const baseClass = 'w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold cursor-pointer';
    
    if (!cell.isRevealed) {
      return `${baseClass} bg-gray-300 hover:bg-gray-200`;
    }
    
    if (cell.isMine) {
      return `${baseClass} bg-red-500 text-white`;
    }
    
    const numberColors = {
      1: 'text-blue-600',
      2: 'text-green-600',
      3: 'text-red-600',
      4: 'text-purple-600',
      5: 'text-yellow-600',
      6: 'text-pink-600',
      7: 'text-black',
      8: 'text-gray-600'
    };
    
    return `${baseClass} bg-gray-100 ${numberColors[cell.neighborMines as keyof typeof numberColors] || ''}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex justify-center gap-8 text-xl font-bold">
        <div>{language === 'en' ? 'Flags:' : 'الأعلام:'} {flagCount}</div>
        <div>
          {gameStatus === 'won' && (
            <span className="text-green-600">
              {language === 'en' ? 'You Win!' : 'أنت تفوز!'}
            </span>
          )}
          {gameStatus === 'lost' && (
            <span className="text-red-600">
              {language === 'en' ? 'Game Over!' : 'انتهت اللعبة!'}
            </span>
          )}
          {gameStatus === 'playing' && (
            <span className="text-blue-600">
              {language === 'en' ? 'Playing...' : 'جاري اللعب...'}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-9 gap-0 border-2 border-gray-600 inline-block">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(cell)}
              onClick={() => revealCell(rowIndex, colIndex)}
              onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
              disabled={gameStatus !== 'playing'}
            >
              {getCellDisplay(cell)}
            </button>
          ))
        )}
      </div>

      <Button onClick={resetGame} className="px-8">
        {language === 'en' ? 'New Game' : 'لعبة جديدة'}
      </Button>

      <div className="text-sm text-muted-foreground text-center max-w-md">
        {language === 'en' 
          ? 'Left-click to reveal cells. Right-click to flag suspected mines. Find all mines without clicking on them!'
          : 'انقر بالزر الأيسر لكشف الخلايا. انقر بالزر الأيمن لوضع علامة على الألغام المشتبهة. ابحث عن جميع الألغام دون النقر عليها!'
        }
      </div>
    </div>
  );
};

export default Minesweeper;
