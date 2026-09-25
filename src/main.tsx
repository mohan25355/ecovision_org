import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register Service Worker for PWA Offline Capability
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('EcoVision ServiceWorker registered: ', reg.scope);
    }).catch((err) => {
      console.log('EcoVision ServiceWorker registration failed: ', err);
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);

