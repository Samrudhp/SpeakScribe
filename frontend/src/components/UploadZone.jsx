import { motion } from 'framer-motion';

const UploadZone = ({ getRootProps, getInputProps, isDragActive, file }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      {...getRootProps()}
      className={`relative overflow-hidden rounded-3xl p-12 text-center cursor-pointer transition-all duration-300
        backdrop-blur-md bg-white/40 border border-white/50 shadow-xl
        ${isDragActive 
          ? 'border-indigo-400 bg-indigo-50/50 shadow-2xl shadow-indigo-200/50' 
          : 'hover:border-indigo-300 hover:bg-white/50 hover:shadow-2xl'
        }`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 via-purple-100/20 to-pink-100/20 pointer-events-none" />
      
      <input {...getInputProps()} />
      
      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        {/* Icon container with glass effect */}
        <motion.div
          animate={{ 
            y: isDragActive ? -10 : 0,
            scale: isDragActive ? 1.1 : 1 
          }}
          transition={{ duration: 0.3 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 
            flex items-center justify-center shadow-lg shadow-indigo-300/50"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
        </motion.div>
        
        {isDragActive ? (
          <div>
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Drop your audio here! 🎵
            </p>
            <p className="text-indigo-500 mt-2">We'll process it with AI magic ✨</p>
          </div>
        ) : file ? (
          <div>
            <p className="text-xl font-semibold text-gray-700">✅ File ready to process</p>
            <p className="text-gray-500 mt-1">{file.name}</p>
          </div>
        ) : (
          <div>
            <p className="text-xl font-bold text-gray-700 mb-2">
              Drag & drop your audio file
            </p>
            <p className="text-gray-500">or click to browse</p>
            <div className="mt-4 flex gap-2 justify-center flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/60 text-xs font-medium text-gray-600 border border-gray-200">
                MP3
              </span>
              <span className="px-3 py-1 rounded-full bg-white/60 text-xs font-medium text-gray-600 border border-gray-200">
                WAV
              </span>
              <span className="px-3 py-1 rounded-full bg-white/60 text-xs font-medium text-gray-600 border border-gray-200">
                M4A
              </span>
              <span className="px-3 py-1 rounded-full bg-white/60 text-xs font-medium text-gray-600 border border-gray-200">
                FLAC
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UploadZone;
