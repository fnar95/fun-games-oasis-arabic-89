
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from './LanguageToggle';

interface GameLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  instructions: string[];
}

const GameLayout = ({ children, title, description, instructions }: GameLayoutProps) => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <LanguageToggle />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Back to Games' : 'العودة للألعاب'}
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-4">{description}</p>
          
          <div className="bg-white rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">
              {language === 'en' ? 'How to Play:' : 'كيفية اللعب:'}
            </h3>
            <ul className="space-y-1">
              {instructions.map((instruction, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
