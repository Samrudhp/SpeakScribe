import { motion } from 'framer-motion';

const SentimentMeter = ({ sentiment }) => {
  if (!sentiment) return null;

  const getSentimentColor = () => {
    switch (sentiment.overall_sentiment) {
      case 'positive':
        return 'from-green-400 to-emerald-500';
      case 'negative':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-gray-400 to-slate-500';
    }
  };

  const getSentimentBg = () => {
    switch (sentiment.overall_sentiment) {
      case 'positive':
        return 'bg-green-50/50 border-green-200';
      case 'negative':
        return 'bg-red-50/50 border-red-200';
      default:
        return 'bg-gray-50/50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/40 border border-white/50 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">{sentiment.overall_emoji}</span>
        Sentiment Analysis
      </h3>
      
      {/* Overall sentiment badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${getSentimentBg()} mb-4`}>
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getSentimentColor()}`} />
        <span className="font-semibold text-gray-700 capitalize">
          {sentiment.emotional_tone}
        </span>
      </div>
      
      {/* Sentiment distribution */}
      <div className="space-y-3 mt-4">
        {/* Positive */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <span className="text-green-500">😊</span> Positive
            </span>
            <span className="text-sm font-bold text-gray-700">
              {sentiment.percentages?.positive || 0}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${sentiment.percentages?.positive || 0}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>
        
        {/* Neutral */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <span className="text-gray-500">😐</span> Neutral
            </span>
            <span className="text-sm font-bold text-gray-700">
              {sentiment.percentages?.neutral || 0}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gray-400 to-slate-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${sentiment.percentages?.neutral || 0}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </div>
        
        {/* Negative */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <span className="text-red-500">😟</span> Negative
            </span>
            <span className="text-sm font-bold text-gray-700">
              {sentiment.percentages?.negative || 0}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-400 to-rose-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${sentiment.percentages?.negative || 0}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
      
      {/* Score indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200/50">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Compound Score</span>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {(sentiment.compound_score || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SentimentMeter;
