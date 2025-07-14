
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const MemoryGame = () => {
  const { language } = useLanguage();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const shuffleCards = () => {
    const duplicatedEmojis = [...emojis, ...emojis];
    const shuffled = duplicatedEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].emoji === cards[second].emoji) {
        setCards(prev => prev.map(card => 
          card.id === first || card.id === second 
            ? { ...card, isMatched: true }
            : card
        ));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameWon(true);
    }
  }, [cards]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <div className="text-xl font-semibold mb-2">
          {language === 'en' ? 'Moves:' : 'الحركات:'} {moves}
        </div>
        {gameWon && (
          <div className="text-2xl font-bold text-green-600">
            {language === 'en' ? 'Congratulations! You won!' : 'مبروك! لقد فزت!'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-16 h-16 rounded-lg border-2 text-2xl font-bold transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? 'bg-white border-blue-400 transform scale-105'
                : 'bg-blue-500 border-blue-600 hover:bg-blue-400'
            }`}
            disabled={card.isFlipped || card.isMatched || flippedCards.length === 2}
          >
            {card.isFlipped || card.isMatched ? card.emoji : '?'}
          </button>
        ))}
      </div>

      <Button onClick={shuffleCards} className="px-8">
        {language === 'en' ? 'New Game' : 'لعبة جديدة'}
      </Button>
    </div>
  );
};

export default MemoryGame;
