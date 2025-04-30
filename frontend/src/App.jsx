import { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import WaveSurfer from 'wavesurfer.js';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('transcript');
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': [] },
    maxFiles: 1,
  });

  useEffect(() => {
    if (file && waveformRef.current) {
      if (wavesurfer.current) wavesurfer.current.destroy();

      const objectUrl = URL.createObjectURL(file);
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'rgba(79, 70, 229, 0.3)', // Indigo with opacity
        progressColor: 'rgb(79, 70, 229)', // Indigo-600
        height: 80,
        barWidth: 2,
        barGap: 2,
        cursorWidth: 2,
        cursorColor: '#6366F1',
        responsive: true,
        barRadius: 2,
      });
      
      wavesurfer.current.load(objectUrl);
      
      wavesurfer.current.on('play', () => setPlaying(true));
      wavesurfer.current.on('pause', () => setPlaying(false));

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleProcess = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/process', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setTranscript(data.transcript || '');
      setSummary(data.summary || '');
    } catch (err) {
      console.error('Processing failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-10 px-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8 bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-4xl">🎙️</span>
          </motion.div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Meeting Summarizer
          </h1>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            {isDragActive ? (
              <p className="text-indigo-600 font-medium text-lg">Drop your audio here...</p>
            ) : (
              <div>
                <p className="text-gray-600 font-medium text-lg mb-1">Drag and drop your audio file</p>
                <p className="text-gray-400 text-sm">or click to browse files</p>
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                
                {wavesurfer.current && (
                  <button 
                    onClick={togglePlayPause}
                    className="bg-indigo-100 hover:bg-indigo-200 p-2 rounded-full transition-colors"
                  >
                    {playing ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div ref={waveformRef} className="w-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleProcess}
          disabled={!file || loading}
          className={`w-full py-4 rounded-xl text-white text-lg font-medium shadow-md transition-all ${
            !file || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing Audio...</span>
            </div>
          ) : "Summarize Audio"}
        </motion.button>

        <AnimatePresence>
          {(transcript || summary) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`px-4 py-2 font-medium relative ${
                    activeTab === 'transcript' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📝 Transcript
                  {activeTab === 'transcript' && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`px-4 py-2 font-medium relative ${
                    activeTab === 'summary' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📌 Summary
                  {activeTab === 'summary' && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    />
                  )}
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                {activeTab === 'transcript' && transcript && (
                  <motion.div
                    key="transcript"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <p className="whitespace-pre-wrap text-gray-700 font-inter leading-relaxed text-base tracking-wide">
                        {transcript.split('\n').map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'summary' && summary && (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <p className="whitespace-pre-wrap text-gray-800 font-medium font-inter leading-relaxed tracking-wide">
                        {summary.split('\n').map((paragraph, index) => (
                          <span key={index} className={index > 0 ? "mt-4 block" : ""}>
                            {paragraph}
                            {index < summary.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;

