export enum AppView {
  Dashboard,
  Chatbot,
  PestDetector,
  WeatherAdvisor,
  MarketPrices,
  SoilHealth,
  LiveAdvisor,
}

export enum Language {
  EN = 'en',
  HI = 'hi',
  TA = 'ta', // Tamil
  TE = 'te', // Telugu
  KN = 'kn', // Kannada
  ML = 'ml', // Malayalam
  BN = 'bn', // Bengali
  MR = 'mr', // Marathi
  GU = 'gu', // Gujarati
  PA = 'pa', // Punjabi
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export interface WeatherForecast {
  day: string;
  temp: string;
  condition: 'Sunny' | 'Cloudy' | 'Partly Cloudy' | 'Rainy' | 'Stormy' | string;
  advice: string;
}