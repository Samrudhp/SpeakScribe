import { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import WaveSurfer from 'wavesurfer.js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Upload, Download, FileAudio, 
  Activity, MessageSquare, CheckCircle, TrendingUp,
  Sparkles, Zap, BarChart3, Clock, Play, Pause
} from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentStep, setCurrentStep] = useState(0);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setResults(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.m4a', '.flac'] },
    maxFiles: 1,
  });

  useEffect(() => {
    if (file && waveformRef.current) {
      if (wavesurfer.current) wavesurfer.current.destroy();

      const objectUrl = URL.createObjectURL(file);
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'rgba(99, 102, 241, 0.3)',
        progressColor: 'rgb(99, 102, 241)',
        height: 80,
        barWidth: 2,
        barRadius: 2,
        cursorColor: '#6366F1',
        responsive: true,
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
    setCurrentStep(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setTimeout(() => setCurrentStep(1), 1000);
      
      const res = await fetch('http://localhost:8000/process', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      setCurrentStep(2);
      setResults(data);
    } catch (err) {
      console.error('Error:', err);
      alert('Processing failed. Check backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    if (!results) return;

    try {
      const response = await fetch(`http://localhost:8000/export/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const togglePlay = () => {
    if (wavesurfer.current) wavesurfer.current.playPause();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'transcript', label: 'Transcript', icon: MessageSquare },
    { id: 'insights', label: 'Insights', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black mb-3">
                <span className="gradient-text">SpeakScribe</span>
              </h1>
              <p className="text-slate-600 text-lg font-medium">
                AI-Powered Meeting Intelligence
              </p>
            </div>

            {results && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex gap-3"
              >
                <button onClick={() => handleExport('pdf')} className="btn-secondary flex items-center gap-2">
                  <Download size={18} />
                  PDF
                </button>
                <button onClick={() => handleExport('docx')} className="btn-primary flex items-center gap-2">
                  <Download size={18} />
                  DOCX
                </button>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Progress */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 glass-card p-6"
          >
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {['Transcribing', 'Analyzing', 'Complete'].map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className={`flex flex-col items-center ${i <= currentStep ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i < currentStep ? 'bg-success-500' : i === currentStep ? 'bg-primary-500 animate-pulse' : 'bg-slate-300'
                    }`}>
                      {i < currentStep ? <CheckCircle size={20} className="text-white" /> : <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                    <span className="text-sm font-medium mt-2">{step}</span>
                  </div>
                  {i < 2 && <div className={`h-1 w-24 mx-2 ${i < currentStep ? 'bg-success-500' : 'bg-slate-300'}`} />}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Upload */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600">
                  <Upload className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Upload Audio</h2>
                  <p className="text-sm text-slate-500">Drop your file here</p>
                </div>
              </div>

              <motion.div
                {...getRootProps()}
                whileHover={{ scale: 1.02 }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <FileAudio className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <p className="text-slate-700 font-medium">
                      {isDragActive ? 'Drop here...' : 'Drag & drop audio'}
                    </p>
                    <p className="text-slate-400 text-sm">or click to browse</p>
                  </div>
                </div>
              </motion.div>

              {file && (
                <button
                  onClick={handleProcess}
                  disabled={loading}
                  className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Analyze Audio
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Player */}
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary-100">
                    <FileAudio className="text-primary-600" size={20} />
                  </div>
                  <div className="flex-1 truncate">
                    <h3 className="font-semibold text-slate-800 truncate">{file.name}</h3>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                <div ref={waveformRef} className="mb-4" />

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 mx-auto block rounded-full bg-gradient-to-r from-primary-600 to-purple-600 flex items-center justify-center text-white hover:shadow-glow transition-all"
                >
                  {playing ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </button>
              </motion.div>
            )}

            {/* Stats */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 space-y-4"
              >
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 size={20} className="text-primary-600" />
                  Quick Stats
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-100">
                    <div className="text-2xl font-bold text-gradient-primary">
                      {results.speakers?.length || 0}
                    </div>
                    <div className="text-xs font-medium text-slate-600 mt-1">Speakers</div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-success-50 to-emerald-50 border border-success-100">
                    <div className="text-2xl font-bold text-gradient-success">
                      {results.action_items?.length || 0}
                    </div>
                    <div className="text-xs font-medium text-slate-600 mt-1">Actions</div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-accent-50 to-pink-50 border border-accent-100">
                    <div className="text-2xl font-bold text-gradient-accent">
                      {results.topics?.length || 0}
                    </div>
                    <div className="text-xs font-medium text-slate-600 mt-1">Topics</div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {results.sentiment?.overall || 'N/A'}
                    </div>
                    <div className="text-xs font-medium text-slate-600 mt-1">Sentiment</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {results ? (
              <div className="glass-card p-8 min-h-[600px]">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 p-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg'
                            : 'text-slate-600 hover:bg-white/50'
                        }`}
                      >
                        <Icon size={18} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Summary</h2>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
                          <p className="text-slate-700 leading-relaxed">{results.summary}</p>
                        </div>
                      </div>

                      {results.sentiment && (
                        <div className="p-6 rounded-2xl bg-white/60 border border-white/80">
                          <h3 className="font-bold text-slate-800 mb-4">Sentiment</h3>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-2">
                                <span>Overall</span>
                                <span className="font-semibold">{results.sentiment.overall}</span>
                              </div>
                              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    results.sentiment.overall === 'positive' ? 'bg-success-500' :
                                    results.sentiment.overall === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                                  }`}
                                  style={{ width: `${(results.sentiment.score || 0.5) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {results.action_items?.length > 0 && (
                        <div className="p-6 rounded-2xl bg-white/60 border border-white/80">
                          <h3 className="font-bold text-slate-800 mb-4">Action Items</h3>
                          <div className="space-y-3">
                            {results.action_items.map((item, i) => (
                              <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/50">
                                <CheckCircle size={20} className="text-success-500 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.topics?.length > 0 && (
                        <div className="p-6 rounded-2xl bg-white/60 border border-white/80">
                          <h3 className="font-bold text-slate-800 mb-4">Topics</h3>
                          <div className="flex flex-wrap gap-2">
                            {results.topics.map((topic, i) => (
                              <span key={i} className="px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'transcript' && (
                    <motion.div
                      key="transcript"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-slate-800 mb-4">Transcript</h2>
                      <div className="p-6 rounded-2xl bg-white/60 border border-white/80 max-h-[500px] overflow-y-auto custom-scrollbar">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {results.transcription?.text || results.transcript}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'insights' && (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {results.speakers?.length > 0 && (
                        <div className="p-6 rounded-2xl bg-white/60 border border-white/80">
                          <h3 className="font-bold text-slate-800 mb-4">Speakers</h3>
                          <div className="space-y-3">
                            {results.speakers.map((speaker, i) => (
                              <div key={i} className="p-4 rounded-lg bg-white/50">
                                <div className="font-semibold text-slate-800 mb-1">
                                  {speaker.name || `Speaker ${i + 1}`}
                                </div>
                                <div className="text-sm text-slate-600">{speaker.text || speaker.content}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-100">
                          <div className="flex items-center gap-3 mb-3">
                            <Clock className="text-primary-600" size={20} />
                            <h3 className="font-bold text-slate-800">Duration</h3>
                          </div>
                          <div className="text-3xl font-bold text-gradient-primary">
                            {results.transcription?.duration || 'N/A'}
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-success-50 to-emerald-50 border border-success-100">
                          <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="text-success-600" size={20} />
                            <h3 className="font-bold text-slate-800">Confidence</h3>
                          </div>
                          <div className="text-3xl font-bold text-gradient-success">
                            {results.sentiment?.score ? `${(results.sentiment.score * 100).toFixed(0)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="glass-card p-12 min-h-[600px] flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                    <Mic className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">No Analysis Yet</h3>
                  <p className="text-slate-600 mb-6">
                    Upload an audio file and click "Analyze Audio" for AI-powered insights.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-primary-500" />
                      <span>Fast Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-success-500" />
                      <span>Accurate Results</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
