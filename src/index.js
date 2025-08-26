import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LanguageProvider } from './LanguageContext';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { MDBBtn } from "mdb-react-ui-kit";
import "@fortawesome/fontawesome-free/css/all.min.css";


const CustomButton = ({ children, variant = "num1", className = "", ...props }) => {
  return (
    <MDBBtn className={`btn-${variant} ${className}`} {...props}>
      {children}
    </MDBBtn>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider> {
      <App />}
    </LanguageProvider>
  </React.StrictMode>
);
reportWebVitals();
export { CustomButton };