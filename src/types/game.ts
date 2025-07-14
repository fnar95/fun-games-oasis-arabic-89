
export interface Game {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  instructions: {
    en: string[];
    ar: string[];
  };
  icon: string;
  color: string;
  gradient: string;
}
