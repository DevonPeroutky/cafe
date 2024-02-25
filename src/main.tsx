import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import WebcamProvider from "@/provider.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";
import { RecoilRoot } from 'recoil';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <WebcamProvider>
        <Toaster />
        <App />
      </WebcamProvider>
    </RecoilRoot>
  </React.StrictMode>,
)
