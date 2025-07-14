
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="fixed top-4 right-4 z-50 min-w-[60px]"
    >
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
};

export default LanguageToggle;
