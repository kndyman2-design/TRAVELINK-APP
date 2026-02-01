
export interface FlightSegment {
  airline: string;
  iataCode: string; // 2-letter airline code for logos
  flightNumber: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  origin: string;
  originCode: string; // 3-letter airport code
  destination: string;
  destinationCode: string; // 3-letter airport code
  cabin?: string;
  type: 'ida' | 'retorno'; // Diferenciación de trayecto
}

export interface ExtractionResult {
  segments: FlightSegment[];
  summary: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
