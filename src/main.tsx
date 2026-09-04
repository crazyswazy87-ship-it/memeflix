import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './postkard.css'
import App from './App.tsx'
import { QueryProvider } from './lib/react-query/QueryProvider.tsx'
import AuthProvider from './constants/context/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
)
