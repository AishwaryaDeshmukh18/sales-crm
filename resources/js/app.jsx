import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./Components/Layout/AppShell";
import Dashboard from "./Pages/Dashboard";

import Contact from "./Pages/ContactListPage";
//import Opportunity from "./Pages/Opportunity";
import CsvImportPage from "./Pages/CsvImportPage";
import Companies from "./Pages/CompanyListPage";
//import NotFound from "./Pages/NotFound";

function App() {
    return (
        <BrowserRouter>
            <AppShell>
                <Routes>
                    <Route path="/"               element={<Dashboard />}       />
                    <Route path="/contacts"       element={<Contact />}   />
                    <Route path="/companies"  element={<Companies />} />
                    <Route path="/csv-import" element={<CsvImportPage />} />
                    {/* <Route path="*" element={<NotFound />} /> */}
                </Routes>
            </AppShell>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("app")).render(<App />);

