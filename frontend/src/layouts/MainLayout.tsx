// src/layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
