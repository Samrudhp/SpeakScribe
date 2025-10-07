import { motion } from 'framer-motion';

const SpeakerTimeline = ({ segments }) => {
  if (!segments || segments.length === 0) return null;

  const speakerColors = {
    'Speaker 1': 'from-blue-500 to-blue-600',
    'Speaker 2': 'from-purple-500 to-purple-600',
    'Speaker 3': 'from-green-500 to-green-600',
    'Speaker 4': 'from-orange-500 to-orange-600',
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/40 border border-white/50 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
        <span className="text-2xl">👥</span>
        Speaker Timeline
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {segments.map((segment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3"
          >
            {/* Speaker badge */}
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                speakerColors[segment.speaker] || 'from-gray-500 to-gray-600'
              } flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                {segment.speaker?.replace('Speaker ', 'S') || 'S'}
              </div>
            </div>
            
            {/* Message bubble */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-700 text-sm">
                  {segment.speaker || 'Unknown'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(segment.start)} - {formatTime(segment.end)}
                </span>
                {segment.sentiment_emoji && (
                  <span className="text-sm">{segment.sentiment_emoji}</span>
                )}
              </div>
              <div className="bg-white/60 border border-gray-200/50 rounded-xl p-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {segment.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SpeakerTimeline;
