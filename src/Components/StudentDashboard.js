import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { User, BookOpen, Mail, Edit2, Trash2, Plus, Search, CheckCircle, AlertCircle, Upload, Camera, X, Star, TrendingUp, Users, Award, Filter, Grid, List } from 'lucide-react';
import StudentList from '../Components/StudentList';
import  StudentForm from '../Components/StudentForm';
import { useStudentContext } from '../hooks/StudentContext'; // instead of defining it again




// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
    </div>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h3>
    <p className="text-red-600 mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      Try Again
    </button>
  </div>
);

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-white/70 text-xs">{subtitle}</p>
      </div>
      <div className="bg-white/20 p-3 rounded-xl">
        <Icon className="w-8 h-8" />
      </div>
    </div>
  </div>
);

// Main Dashboard Component
const StudentDashboard = () => {
  // Note: This would use your actual useStudentContext hook
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock functions - replace with your actual context functions
  const addStudent = async (studentData) => {
    const newStudent = { ...studentData, id: Date.now() };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = async (id, studentData) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...studentData } : s));
  };

  const deleteStudent = async (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const retryLoadCourses = () => {
    setError(null);
    // Retry logic here
  };

  const handleAddStudent = async (studentData) => {
    await addStudent(studentData);
    setShowForm(false);
  };

  const handleUpdateStudent = async (studentData) => {
    await updateStudent(editingStudent.id, studentData);
    setEditingStudent(null);
    setShowForm(false);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  // Calculate stats
  const totalStudents = students.length;
  const averageGPA = students.length > 0 
    ? (students.reduce((sum, s) => sum + (parseFloat(s.gpa) || 0), 0) / students.length).toFixed(1)
    : '0.0';
  const activeCourses = new Set(students.map(s => s.courseId)).size;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={retryLoadCourses} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Load SweetAlert2 */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.7.32/sweetalert2.min.js"></script>
      
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Student Management Dashboard</h1>
              <p className="text-blue-100 text-lg"> dashboard for efficient student management</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            icon={Users}
            title="Total Students"
            value={totalStudents}
            subtitle="Active enrollments"
            color="from-blue-500 to-blue-600"
          />
          <StatsCard
            icon={BookOpen}
            title="Active Courses"
            value={activeCourses}
            subtitle="Different programs"
            color="from-purple-500 to-purple-600"
          />
          
        </div>

        {/* Form Section */}
        {showForm && (
          <StudentForm
            student={editingStudent}
            onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
            onCancel={handleCancelForm}
            courses={courses}
            isLoading={loading}
          />
        )}

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Student
              </button>
            )}
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <StudentList
            students={students}
            courses={courses}
            onEdit={handleEditStudent}
            onDelete={deleteStudent}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;