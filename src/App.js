import React from 'react';
import StudentDashboard from '../src/Components/StudentDashboard';
import StudentProvider from '../src/hooks/StudentContext'; // Adjust path if needed

function App() {
  return (
    <StudentProvider>
      <StudentDashboard />
    </StudentProvider>
  );
}

export default App;
