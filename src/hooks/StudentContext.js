import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../Services/ApiService';

const StudentContext = createContext();

// ✅ Custom hook exported here
export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within StudentProvider');
  }
  return context;
};

const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting course load...');
      const coursesData = await apiService.fetchCourses();
      console.log('Courses loaded:', coursesData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData) => {
    try {
      const newStudent = await apiService.saveStudent(studentData);
      setStudents(prev => [...prev, newStudent]);
    } catch (err) {
      console.error('Failed to add student:', err);
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const updatedStudent = await apiService.saveStudent({ ...studentData, id });
      setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
    } catch (err) {
      console.error('Failed to update student:', err);
    }
  };

  const deleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const retryLoadCourses = () => {
    loadCourses();
  };

  const value = {
    students,
    courses,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    retryLoadCourses
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;
