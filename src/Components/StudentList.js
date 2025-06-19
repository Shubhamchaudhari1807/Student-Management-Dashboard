import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { User, BookOpen, Mail, Edit2, Trash2, Plus, Search, CheckCircle, AlertCircle, Upload, Camera, X, Star, TrendingUp, Users, Award, Filter, Grid, List } from 'lucide-react';
import StudentCard from '../Components/StudentCard';
import apiService from '../Services/ApiService';
// Student List Component
// Premium Student List Component
const StudentList = ({ students, onEdit, onDelete, searchTerm }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  const [courses, setCourses] = useState([]);

useEffect(() => {
  apiService.fetchCourses().then(setCourses);
}, []);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
       
        default:
          return 0;
      }
    });
  }, [students, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
            
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Students Display */}
      {filteredAndSortedStudents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Students Found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first student'}
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredAndSortedStudents.map(student => {
            const course = courses.find(c => String(c.id) === String(student.courseId));

            return (
              <StudentCard
                key={student.id}
                student={student}
                course={course}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
export default StudentList;

