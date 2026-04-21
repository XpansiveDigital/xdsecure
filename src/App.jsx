import { Routes, Route } from 'react-router-dom'
import AppShell    from './components/AppShell'
import LayerViewer from './components/viewer/LayerViewer'

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<AppShell />} />
      <Route path="/public"   element={<LayerViewer layer="public" />} />
      <Route path="/private"  element={<LayerViewer layer="private" />} />
      <Route path="/internal" element={<LayerViewer layer="internal" />} />
    </Routes>
  )
}
