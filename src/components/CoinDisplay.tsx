
import { Trophy } from 'lucide-react';

interface CoinDisplayProps {
  coins: number;
  animated?: boolean;
}

export const CoinDisplay = ({ coins, animated = false }: CoinDisplayProps) => {
  return (
    <div className={`flex items-center gap-2 ${animated ? 'animate-coin-drop' : ''}`}>
      <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center shadow-lg">
        <Trophy className="w-4 h-4 text-white" />
      </div>
      <span className="font-bold text-lg text-yellow-600">
        {coins.toLocaleString()}
      </span>
    </div>
  );
};
