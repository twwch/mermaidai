import { useAuth } from './hooks/useAuth';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { DiagramEditor } from './components/DiagramEditor';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <DiagramEditor />
      </main>
    </div>
  );
}

export default App;
