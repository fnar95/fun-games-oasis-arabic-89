
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
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <img 
                  src="/lovable-uploads/c712dd9c-9f23-4cd8-a5ad-f73b0f9c5dfd.png" 
                  alt="استاذ فاضل" 
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {language === 'en' ? 'Professor Fadel\'s Famous Popular Games' : 'العاب استاذ فاضل الشعبية الشهيرة'}
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
