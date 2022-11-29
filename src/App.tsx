import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthStore } from "./components/Auth/AuthStore";
import { GuardedRoute } from "./components/Auth/GuardedRoute";

import { Iag } from "./components/Iag/IagScreen";
import { Login } from "./components/Login/LoginScreen";

export const App: React.FC = () => {
  return (
    <AuthStore>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile/*" element={<GuardedRoute />}>
            <Route path="*" element={<Iag />} />
          </Route>
          <Route path="*" element={<Navigate replace to="/profile" />} />
        </Routes>
      </BrowserRouter>
    </AuthStore>
  );
};
