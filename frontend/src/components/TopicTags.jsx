import { motion } from 'framer-motion';

const TopicTags = ({ topics }) => {
  if (!topics || topics.length === 0) return null;

  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-green-500',
    'from-rose-500 to-pink-500',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/40 border border-white/50 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🏷️</span>
        Key Topics
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {topics.map((topic, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="group relative"
          >
            <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${colors[index % colors.length]} 
              text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer`}>
              {topic}
            </div>
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${colors[index % colors.length]} 
              opacity-0 group-hover:opacity-20 blur-xl transition-opacity -z-10`} />
          </motion.div>
        ))}
      </div>
      
      {/* Topics count badge */}
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50/50 border border-indigo-200/50">
        <span className="text-indigo-600 font-bold text-sm">{topics.length}</span>
        <span className="text-indigo-600 text-sm">
          {topics.length === 1 ? 'topic' : 'topics'} identified
        </span>
      </div>
    </motion.div>
  );
};

export default TopicTags;
