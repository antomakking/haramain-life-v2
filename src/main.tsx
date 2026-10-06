import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import WeatherTrendChart from './components/WeatherTrendChart.tsx';
import './index.css';
import './pwa.ts';

// 1. Weekly Crowd Trend & Umrah Manasik Estimator
const weeklyTrendRoot = document.getElementById('weekly-trend-chart-root') || document.getElementById('root');
if (weeklyTrendRoot) {
  createRoot(weeklyTrendRoot).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

// 2. Comprehensive 5-Day Daily Weather Trend Visualization (Recharts) in Forecast Section
const weatherTrendRoot = document.getElementById('weather-trend-chart-root');
if (weatherTrendRoot) {
  createRoot(weatherTrendRoot).render(
    <StrictMode>
      <WeatherTrendChart mode="master" />
    </StrictMode>,
  );
}

// 3. Compact Inline Makkah Weather Trend in Forecast Card
const makkahTrendRoot = document.getElementById('makkah-weather-trend-root');
if (makkahTrendRoot) {
  createRoot(makkahTrendRoot).render(
    <StrictMode>
      <WeatherTrendChart city="makkah" mode="compact" />
    </StrictMode>,
  );
}

// 4. Compact Inline Madinah Weather Trend in Forecast Card
const madinahTrendRoot = document.getElementById('madinah-weather-trend-root');
if (madinahTrendRoot) {
  createRoot(madinahTrendRoot).render(
    <StrictMode>
      <WeatherTrendChart city="madinah" mode="compact" />
    </StrictMode>,
  );
}
