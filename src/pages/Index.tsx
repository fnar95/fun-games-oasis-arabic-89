
import { useLanguage } from '@/context/LanguageContext';
import { games } from '@/data/games';
import GameCard from '@/components/GameCard';
import LanguageToggle from '@/components/LanguageToggle';

const Index = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <LanguageToggle />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {language === 'en' ? 'Game Hub' : 'العاب استاذ فاضل الشعبية الشهيرة'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Discover and play amazing mini-games! Choose from our collection of fun and challenging games.'
              : 'اكتشف والعب ألعاب مصغرة رائعة! اختر من مجموعتنا من الألعاب الممتعة والمليئة بالتحدي.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? 'More games coming soon! Have fun playing!' 
              : 'المزيد من الألعاب قريباً! استمتع باللعب!'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
