import React from 'react';
import { User, BookOpen, Mail, Edit2, Trash2, Star, Award } from 'lucide-react';
import Swal from 'sweetalert2';

// Premium Student Card Component
const StudentCard = ({ student, course, onEdit, onDelete }) => {
  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: `This will permanently delete ${student.name}'s record.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(student.id);
        Swal.fire({
          title: 'Deleted!',
          text: 'Student record has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            {student.profileImage ? (
              <img
                src={student.profileImage}
                alt={student.name}
                className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{student.name}</h3>
            <p className="text-gray-600 flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              {student.email}
            </p>
          </div>
        </div>
        
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mt-6">
          <p className="text-sm text-gray-700 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
            <span className="font-semibold text-blue-700">
              {course?.name}
            </span>
          </p>
          {course?.code && (
            <p className="text-xs text-gray-500 mt-1 ml-6">{course.code}</p>
          )}
        </div>
        
        {/* Additional student info */}
        
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(student)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;