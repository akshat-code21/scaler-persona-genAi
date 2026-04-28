import { Routes, Route, BrowserRouter } from "react-router";
import Index from "./components";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
