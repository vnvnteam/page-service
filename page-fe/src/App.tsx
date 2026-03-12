import { Navigate, Route, Routes } from "react-router-dom";
import "./assets/App.css";
import PageLayoutEditor from "@/pages/builder/pageLayout";
import AdminLayout from "@/pages/admin/layoutAdmin";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/admin/page-layout/:pageId"
          element={<PageLayoutEditor />}
        />
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
}

export default App;
