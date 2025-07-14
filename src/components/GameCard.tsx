
import { Link } from 'react-router-dom';
import { Game } from '@/types/game';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const { language } = useLanguage();

  return (
    <Link to={`/game/${game.id}`} className="block group">
      <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105 overflow-hidden">
        <div className={`h-20 ${game.gradient} flex items-center justify-center text-4xl`}>
          {game.icon}
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{game.title[language]}</CardTitle>
          <CardDescription className="text-sm">
            {game.description[language]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {language === 'en' ? 'Click to play' : 'انقر للعب'}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GameCard;
