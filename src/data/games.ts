
import { Game } from '@/types/game';

export const games: Game[] = [
  {
    id: 'tic-tac-toe',
    title: {
      en: 'Tic-Tac-Toe',
      ar: 'إكس أو'
    },
    description: {
      en: 'Classic strategy game for two players',
      ar: 'لعبة استراتيجية كلاسيكية لاعبين'
    },
    instructions: {
      en: [
        'Players take turns placing X and O on a 3x3 grid',
        'First to get 3 in a row (horizontal, vertical, or diagonal) wins',
        'Click on any empty cell to make your move'
      ],
      ar: [
        'يتناوب اللاعبون في وضع X و O على شبكة 3x3',
        'الأول الذي يحصل على 3 في صف (أفقي أو عمودي أو قطري) يفوز',
        'انقر على أي خلية فارغة للعب'
      ]
    },
    icon: '⭕',
    color: 'from-blue-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-purple-600'
  },
  {
    id: 'snake',
    title: {
      en: 'Snake Game',
      ar: 'لعبة الثعبان'
    },
    description: {
      en: 'Guide the snake to eat food and grow longer',
      ar: 'وجه الثعبان لأكل الطعام والنمو'
    },
    instructions: {
      en: [
        'Use arrow keys or swipe to control the snake',
        'Eat food to grow longer and increase your score',
        'Avoid hitting the walls or your own tail'
      ],
      ar: [
        'استخدم مفاتيح الأسهم أو السحب للتحكم في الثعبان',
        'كل الطعام لتنمو وتزيد نقاطك',
        'تجنب ضرب الجدران أو ذيلك'
      ]
    },
    icon: '🐍',
    color: 'from-green-500 to-emerald-600',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-600'
  },
  {
    id: 'memory',
    title: {
      en: 'Memory Game',
      ar: 'لعبة الذاكرة'
    },
    description: {
      en: 'Test your memory by matching pairs of cards',
      ar: 'اختبر ذاكرتك بمطابقة أزواج الكروت'
    },
    instructions: {
      en: [
        'Click on cards to flip them and reveal symbols',
        'Find matching pairs by remembering card positions',
        'Match all pairs to win the game'
      ],
      ar: [
        'انقر على الكروت لقلبها وكشف الرموز',
        'ابحث عن الأزواج المتطابقة بتذكر مواقع الكروت',
        'اطبق جميع الأزواج للفوز'
      ]
    },
    icon: '🧠',
    color: 'from-pink-500 to-rose-600',
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-600'
  },
  {
    id: 'flappy-bird',
    title: {
      en: 'Flappy Bird',
      ar: 'الطائر المرفرف'
    },
    description: {
      en: 'Navigate through pipes by flapping your wings',
      ar: 'تنقل عبر الأنابيب برفرفة جناحيك'
    },
    instructions: {
      en: [
        'Click or press spacebar to flap and fly up',
        'Navigate through the gaps between pipes',
        'Avoid hitting pipes or the ground'
      ],
      ar: [
        'انقر أو اضغط مسطحة المسافة للرفرفة والطيران',
        'تنقل عبر الفجوات بين الأنابيب',
        'تجنب ضرب الأنابيب أو الأرض'
      ]
    },
    icon: '🐦',
    color: 'from-yellow-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600'
  },
  {
    id: 'rock-paper-scissors',
    title: {
      en: 'Rock Paper Scissors',
      ar: 'حجر ورق مقص'
    },
    description: {
      en: 'Classic hand game against the computer',
      ar: 'لعبة اليد الكلاسيكية ضد الكمبيوتر'
    },
    instructions: {
      en: [
        'Choose Rock, Paper, or Scissors',
        'Rock beats Scissors, Scissors beats Paper, Paper beats Rock',
        'First to 5 wins takes the match'
      ],
      ar: [
        'اختر حجر أو ورق أو مقص',
        'الحجر يهزم المقص، المقص يهزم الورق، الورق يهزم الحجر',
        'أول من يفوز بـ 5 يأخذ المباراة'
      ]
    },
    icon: '✂️',
    color: 'from-red-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-red-500 to-pink-600'
  },
  {
    id: 'breakout',
    title: {
      en: 'Breakout',
      ar: 'كسر الطوب'
    },
    description: {
      en: 'Break all the bricks with your ball and paddle',
      ar: 'اكسر جميع الطوب بالكرة والمضرب'
    },
    instructions: {
      en: [
        'Move the paddle left and right to bounce the ball',
        'Break all bricks by hitting them with the ball',
        'Dont let the ball fall below the paddle'
      ],
      ar: [
        'حرك المضرب يمينا ويسارا لترتد الكرة',
        'اكسر جميع الطوب بضربها بالكرة',
        'لا تدع الكرة تسقط تحت المضرب'
      ]
    },
    icon: '🧱',
    color: 'from-indigo-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-indigo-500 to-blue-600'
  },
  {
    id: '2048',
    title: {
      en: '2048',
      ar: '2048'
    },
    description: {
      en: 'Combine tiles to reach the 2048 tile',
      ar: 'ادمج البلاط للوصول إلى بلاطة 2048'
    },
    instructions: {
      en: [
        'Use arrow keys or swipe to move tiles',
        'When two tiles with the same number touch, they merge',
        'Try to create a tile with the number 2048'
      ],
      ar: [
        'استخدم مفاتيح الأسهم أو السحب لتحريك البلاط',
        'عندما يلمس بلاطان بنفس الرقم، يندمجان',
        'حاول إنشاء بلاطة برقم 2048'
      ]
    },
    icon: '🔢',
    color: 'from-purple-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-purple-500 to-indigo-600'
  },
  {
    id: 'simon-says',
    title: {
      en: 'Simon Says',
      ar: 'سايمون يقول'
    },
    description: {
      en: 'Repeat the color sequence shown by Simon',
      ar: 'كرر تسلسل الألوان الذي يظهره سايمون'
    },
    instructions: {
      en: [
        'Watch the sequence of colored buttons that light up',
        'Repeat the sequence by clicking the buttons in order',
        'Each round adds one more color to remember'
      ],
      ar: [
        'شاهد تسلسل الأزرار الملونة التي تضيء',
        'كرر التسلسل بالنقر على الأزرار بالترتيب',
        'كل جولة تضيف لونا آخر للتذكر'
      ]
    },
    icon: '🎯',
    color: 'from-cyan-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-cyan-500 to-blue-600'
  },
  {
    id: 'pong',
    title: {
      en: 'Pong',
      ar: 'بونغ'
    },
    description: {
      en: 'Classic paddle tennis game',
      ar: 'لعبة تنس المضرب الكلاسيكية'
    },
    instructions: {
      en: [
        'Use arrow keys or mouse to move your paddle',
        'Hit the ball back to your opponent',
        'First to 10 points wins the game'
      ],
      ar: [
        'استخدم مفاتيح الأسهم أو الماوس لتحريك مضربك',
        'اضرب الكرة لإرجاعها للخصم',
        'أول من يحصل على 10 نقاط يفوز'
      ]
    },
    icon: '🏓',
    color: 'from-emerald-500 to-green-600',
    gradient: 'bg-gradient-to-br from-emerald-500 to-green-600'
  },
  {
    id: 'minesweeper',
    title: {
      en: 'Minesweeper',
      ar: 'كاشف الألغام'
    },
    description: {
      en: 'Find all mines without triggering them',
      ar: 'ابحث عن جميع الألغام دون تفجيرها'
    },
    instructions: {
      en: [
        'Click on cells to reveal them',
        'Numbers show how many mines are adjacent',
        'Right-click to flag suspected mines'
      ],
      ar: [
        'انقر على الخلايا لكشفها',
        'الأرقام تظهر عدد الألغام المجاورة',
        'انقر بالزر الأيمن لوضع علامة على الألغام المشتبهة'
      ]
    },
    icon: '💣',
    color: 'from-slate-500 to-gray-600',
    gradient: 'bg-gradient-to-br from-slate-500 to-gray-600'
  }
];
