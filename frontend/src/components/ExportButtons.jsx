import { motion } from 'framer-motion';

const ExportButtons = ({ data, onExport }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/40 border border-white/50 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📥</span>
        Export Results
      </h3>
      
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onExport('pdf')}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl
            bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold
            shadow-lg shadow-red-300/50 hover:shadow-xl hover:shadow-red-400/50 transition-all"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <div className="text-left">
            <div className="text-sm font-bold">Export PDF</div>
            <div className="text-xs opacity-90">Professional report</div>
          </div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onExport('docx')}
          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl
            bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold
            shadow-lg shadow-blue-300/50 hover:shadow-xl hover:shadow-blue-400/50 transition-all"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
          <div className="text-left">
            <div className="text-sm font-bold">Export DOCX</div>
            <div className="text-xs opacity-90">Editable document</div>
          </div>
        </motion.button>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          const text = JSON.stringify(data, null, 2);
          const blob = new Blob([text], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'meeting-analysis.json';
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
          border-2 border-dashed border-gray-300 text-gray-600 font-medium
          hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download JSON
      </motion.button>
    </motion.div>
  );
};

export default ExportButtons;
