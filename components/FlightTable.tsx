
import React from 'react';
import { FlightSegment } from '../types';

interface FlightTableProps {
  segments: FlightSegment[];
  tableId: string;
}

const FlightTable: React.FC<FlightTableProps> = ({ segments, tableId }) => {
  if (segments.length === 0) return null;

  const idaSegments = segments.filter(s => s.type === 'ida');
  const retornoSegments = segments.filter(s => s.type === 'retorno');

  const renderRows = (segmentsToRender: FlightSegment[]) => {
    return segmentsToRender.map((segment, index) => (
      <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-slate-50/80 transition-colors duration-150`}>
        {/* Aerolínea */}
        <td className="px-3 py-3 border-r border-slate-100">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
              <img 
                src={`https://www.gstatic.com/flights/airline_logos/70px/${segment.iataCode.toUpperCase()}.png`}
                alt={segment.airline}
                className="w-full h-auto object-contain p-1.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://www.gstatic.com/flights/airline_logos/70px/default.png';
                }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-700 text-center leading-tight uppercase tracking-tight whitespace-normal max-w-[75px]">{segment.airline}</span>
          </div>
        </td>
        
        {/* Vuelo */}
        <td className="px-3 py-3 text-center border-r border-slate-100">
          <span className="inline-block text-[16px] font-mono font-black text-slate-900 px-2 py-0.5 rounded-md whitespace-nowrap">
            {segment.flightNumber}
          </span>
        </td>
        
        {/* Fecha Salida */}
        <td className="px-3 py-3 text-center text-[16px] text-slate-900 border-r border-slate-100 font-bold whitespace-nowrap capitalize">
          {segment.departureDate}
        </td>
        
        {/* Fecha Llegada */}
        <td className="px-3 py-3 text-center text-[16px] text-slate-900 border-r border-slate-100 font-bold whitespace-nowrap capitalize">
          {segment.arrivalDate}
        </td>
        
        {/* Ruta */}
        <td className="px-4 py-3 text-center border-r border-slate-100">
          <div className="flex flex-col items-center justify-center gap-0.5">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[17px] font-black text-slate-900 leading-none">{segment.origin}</span>
              <span className="text-slate-500 font-bold text-[11px]">({segment.originCode.toUpperCase()})</span>
            </div>
            <div className="text-slate-300 text-[9px] leading-none py-0.5">▼</div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[17px] font-black text-slate-900 leading-none">{segment.destination}</span>
              <span className="text-slate-500 font-bold text-[11px]">({segment.destinationCode.toUpperCase()})</span>
            </div>
          </div>
        </td>
        
        {/* Hora Salida */}
        <td className="px-3 py-3 text-center border-r border-slate-100">
          <div className="inline-block px-1.5 py-0.5 bg-white text-slate-900">
             <span className="text-[16px] font-black tracking-tighter whitespace-nowrap">{segment.departureTime}</span>
          </div>
        </td>
        
        {/* Hora Llegada */}
        <td className="px-3 py-3 text-center">
          <div className="inline-block px-1.5 py-0.5 bg-white text-slate-900">
             <span className="text-[16px] font-black tracking-tighter whitespace-nowrap">
                {segment.arrivalTime}
             </span>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div id={tableId} className="p-2 bg-white rounded-[1rem] shadow-2xl inline-block">
      <div className="overflow-hidden border border-slate-200 rounded-lg bg-white">
        <table className="min-w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-[#064e3b] via-[#0f172a] to-[#172554] text-white">
              <th className="px-3 py-3.5 text-center text-[11px] font-black uppercase tracking-wider border-r border-white/10 w-24">Aerolínea</th>
              <th className="px-3 py-3.5 text-center text-[11px] font-black uppercase tracking-wider border-r border-white/10 min-w-[85px]">Vuelo</th>
              <th className="px-3 py-3.5 text-center text-[11px] font-black uppercase tracking-wider border-r border-white/10 min-w-[125px]">Fecha de Salida</th>
              <th className="px-3 py-3.5 text-center text-[11px] font-black uppercase tracking-wider border-r border-white/10 min-w-[125px]">Fecha de Llegada</th>
              <th className="px-4 py-3.5 text-center text-[11px] font-black uppercase tracking-wider border-r border-white/10 min-w-[155px]">Ruta</th>
              <th className="px-3 py-3.5 text-center text-[11px] font-black uppercase tracking-wider border-r border-white/10 min-w-[105px]">Hora Salida</th>
              <th className="px-3 py-3.5 text-center text-[11px] font-black uppercase tracking-wider min-w-[105px]">Hora Llegada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Sección de Ida */}
            {idaSegments.length > 0 && (
              <>
                <tr className="bg-slate-100/80">
                  <td colSpan={7} className="px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 border-b border-slate-200">
                    ✈ Vuelos de Ida
                  </td>
                </tr>
                {renderRows(idaSegments)}
              </>
            )}
            
            {/* Sección de Retorno */}
            {retornoSegments.length > 0 && (
              <>
                <tr className="bg-slate-100/80">
                  <td colSpan={7} className="px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 border-b border-slate-200 border-t border-slate-200">
                    🔄 Vuelos de Retorno
                  </td>
                </tr>
                {renderRows(retornoSegments)}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightTable;
