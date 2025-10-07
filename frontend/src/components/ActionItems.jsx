import { motion } from 'framer-motion';
import { useState } from 'react';

const ActionItems = ({ actions }) => {
  const [checkedItems, setCheckedItems] = useState({});

  if (!actions) return null;

  const toggleCheck = (type, index) => {
    const key = `${type}-${index}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ActionSection = ({ title, items, icon, color, type }) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-6 last:mb-0">
        <h4 className={`text-sm font-bold ${color} mb-3 flex items-center gap-2`}>
          <span className="text-lg">{icon}</span>
          {title}
        </h4>
        <div className="space-y-2">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-gray-200/50 
                hover:bg-white/80 transition-all cursor-pointer group"
              onClick={() => toggleCheck(type, index)}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center
                transition-all ${checkedItems[`${type}-${index}`] 
                  ? `${color.replace('text-', 'border-')} ${color.replace('text-', 'bg-')}/10` 
                  : 'border-gray-300 group-hover:border-gray-400'
                }`}
              >
                {checkedItems[`${type}-${index}`] && (
                  <svg className={`w-3 h-3 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className={`flex-1 text-sm text-gray-700 leading-relaxed
                ${checkedItems[`${type}-${index}`] ? 'line-through opacity-60' : ''}`}>
                {item}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/40 border border-white/50 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
        <span className="text-2xl">📋</span>
        Action Items & Decisions
      </h3>
      
      <ActionSection
        title="Action Items"
        items={actions.action_items}
        icon="✅"
        color="text-blue-600"
        type="action"
      />
      
      <ActionSection
        title="Decisions Made"
        items={actions.decisions}
        icon="🎯"
        color="text-purple-600"
        type="decision"
      />
      
      <ActionSection
        title="Deadlines"
        items={actions.deadlines}
        icon="⏰"
        color="text-orange-600"
        type="deadline"
      />

      {(!actions.action_items?.length && !actions.decisions?.length && !actions.deadlines?.length) && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">🤔</p>
          <p>No action items or decisions detected</p>
        </div>
      )}
    </motion.div>
  );
};

export default ActionItems;
