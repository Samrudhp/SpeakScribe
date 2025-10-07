import { motion } from 'framer-motion';

const steps = [
  { id: 1, name: 'Transcribing', icon: '🎤', description: 'Converting speech to text' },
  { id: 2, name: 'Analyzing', icon: '🧠', description: 'AI analysis in progress' },
  { id: 3, name: 'Complete', icon: '✨', description: 'Results ready!' }
];

const ProgressStepper = ({ currentStep, loading }) => {
  return (
    <div className="backdrop-blur-md bg-white/40 border border-white/50 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Step icon */}
              <motion.div
                animate={{
                  scale: currentStep === index ? 1.1 : 1,
                  opacity: currentStep >= index ? 1 : 0.5
                }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                  transition-all duration-300 shadow-lg
                  ${currentStep >= index
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-300/50'
                    : 'bg-gray-200'
                  }`}
              >
                {currentStep > index ? '✓' : step.icon}
              </motion.div>
              
              {/* Step name */}
              <div className="mt-3 text-center">
                <p className={`font-semibold transition-colors ${
                  currentStep >= index ? 'text-indigo-600' : 'text-gray-400'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              </div>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 -mt-8">
                <motion.div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentStep > index
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                      : 'bg-gray-200'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: currentStep > index ? 1 : 0 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Loading animation */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex items-center justify-center gap-2"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-indigo-500 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15
                }}
              />
            ))}
          </div>
          <p className="text-indigo-600 font-medium">Processing...</p>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressStepper;
