import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <GoogleOAuthProvider clientId="286307114394-n2milg9i9k1djd344f1r1l4mervnbcac.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
); // ✅ No extra BrowserRouter
