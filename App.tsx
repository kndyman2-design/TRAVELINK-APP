
import React, { useState } from 'react';
import { extractTravelInfo } from './services/geminiService.ts';
import { AppStatus, ExtractionResult } from './types';
import FlightTable from './components/FlightTable';

const App: React.FC = () => {
  const [quoteText, setQuoteText] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tableRefId = "itinerary-table-container";

  const handleAnalyze = async () => {
    if (!quoteText.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);
    
    try {
      const data = await extractTravelInfo(quoteText);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setError('Error al procesar el itinerario. Asegúrate de copiar el texto completo.');
      setStatus(AppStatus.ERROR);
    }
  };

  const clearApp = () => {
    setQuoteText('');
    setResult(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-6 shadow-sm mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-slate-900 p-4 rounded-2xl shadow-xl shadow-slate-200 rotate-2 transition-transform hover:rotate-0">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">TravelQuotes HD</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Analizador Profesional de Itinerarios</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {status !== AppStatus.IDLE && (
               <button 
                onClick={clearApp}
                className="px-6 py-3 text-xs font-black text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all border border-blue-100 shadow-sm"
               >
                 NUEVO ANÁLISIS
               </button>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12">
          
          <section className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-8 bg-blue-600 rounded-full shadow-lg"></div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Pegar Cotización</h2>
            </div>
            <textarea
              className="w-full h-64 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder-slate-400 text-lg leading-relaxed shadow-inner font-medium"
              placeholder="Pega aquí el itinerario completo..."
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              disabled={status === AppStatus.LOADING}
            />
            
            <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex-1">
                {status === AppStatus.ERROR && (
                  <div className="flex items-center gap-4 text-red-600 bg-red-50 px-6 py-4 rounded-2xl border border-red-100 shadow-lg">
                    <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    <span className="text-sm font-black">{error}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-4 text-slate-400 px-2">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                   <p className="text-xs font-bold uppercase tracking-widest">Texto ampliado y diseño ultra profesional</p>
                </div>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={status === AppStatus.LOADING || !quoteText.trim()}
                className={`px-12 py-6 rounded-3xl font-black text-white transition-all transform active:scale-95 flex items-center gap-5 shadow-2xl tracking-[0.2em]
                  ${status === AppStatus.LOADING || !quoteText.trim() 
                    ? 'bg-slate-200 cursor-not-allowed shadow-none' 
                    : 'bg-slate-900 hover:bg-black shadow-slate-300 hover:-translate-y-1'
                  }`}
              >
                {status === AppStatus.LOADING ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    PROCESANDO...
                  </>
                ) : (
                  <>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    GENERAR ITINERARIO
                  </>
                )}
              </button>
            </div>
          </section>

          {status === AppStatus.SUCCESS && result && (
            <section className="animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <div className="flex flex-col md:flex-row items-center justify-between mb-10 px-6 gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-4 h-12 bg-emerald-500 rounded-full shadow-xl shadow-emerald-100"></div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Itinerario Extraído</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">{result.segments.length} VUELOS DETECTADOS</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-1.5 rounded-[2.5rem] mb-12 shadow-2xl">
                <div className="bg-white px-10 py-8 rounded-[2rem]">
                    <div className="flex items-start gap-6">
                        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shadow-inner">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0v4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>
                        </div>
                        <div>
                           <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] block mb-2">Resumen Ejecutivo</span>
                           <p className="text-slate-800 text-2xl leading-tight font-black italic tracking-tight">
                              "{result.summary}"
                           </p>
                        </div>
                    </div>
                </div>
              </div>

              <div className="flex flex-col items-center w-full mb-12">
                 <div className="w-full overflow-x-auto pb-8 flex justify-center scrollbar-hide">
                    <FlightTable segments={result.segments} tableId={tableRefId} />
                 </div>
              </div>
              
              <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Itinerario listo para visualizar</p>
            </section>
          )}

          {status === AppStatus.IDLE && (
            <div className="flex flex-col items-center justify-center py-32 text-slate-300">
              <div className="mb-10 relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl border border-slate-50 relative">
                  <svg className="w-20 h-20 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-400 tracking-tighter uppercase mb-3 text-center px-4">Generador de Itinerarios Pro</h3>
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase opacity-60">Pegue su cotización para comenzar</p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-24 text-center px-4">
        <div className="inline-flex flex-col md:flex-row items-center gap-6 px-10 py-4 bg-white rounded-[2rem] border border-slate-200 shadow-xl">
          <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"></span>
            POWERED BY GEMINI 3 FLASH
          </p>
          <div className="hidden md:block w-px h-5 bg-slate-200"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            LARGE TEXT MODE &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
