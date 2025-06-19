import React, { useState, useEffect } from 'react';
import { User, BookOpen, Mail, X, Upload, Camera, AlertCircle, CheckCircle, GraduationCap, Calendar, Loader2 } from 'lucide-react';
import PhotoUpload from '../Components/PhotoUpload';
import Swal from 'sweetalert2';
import apiService from '../Services/ApiService';

const StudentForm = ({ student, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    courseId: student?.courseId || '',
    profileImage: student?.profileImage || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);

  // Fetch courses on component mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError(null);
        const fetchedCourses = await apiService.fetchCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        setCoursesError(error.message);
        console.error('Failed to fetch courses:', error);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email address is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'courseId':
        if (!value) return 'Course selection is required';
        return '';
      
      case 'profileImage':
        if (!value || value.trim() === '') return 'Profile photo is required';
        return '';
      
      default:
        return '';
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      const errorFields = Object.keys(errors);
      await Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: `Please fix the following errors: ${errorFields.join(', ')}`,
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      await onSubmit(formData);
      
      // Show success alert
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `${formData.name} has been ${student ? 'updated' : 'added'} successfully!`,
        confirmButtonColor: '#10B981',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      // Show error alert if submission fails
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save student data. Please try again.',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Only validate if field was touched before
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleImageChange = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      profileImage: imageUrl
    }));

    // Validate photo field when image changes
    setTouched(prev => ({
      ...prev,
      profileImage: true
    }));

    const error = validateField('profileImage', imageUrl);
    setErrors(prev => ({
      ...prev,
      profileImage: error
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50 w-screen h-screen">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {student ? 'Edit Student' : 'Add New Student'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Photo Upload Section */}
            <div className="flex justify-center pb-4">
              <div className="text-center">
                <div className={`${errors.profileImage && touched.profileImage ? 'ring-2 ring-red-300 rounded-lg p-2' : ''}`}>
                  <PhotoUpload
                    currentImage={formData.profileImage}
                    onImageChange={handleImageChange}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Click to upload photo <span className="text-red-500">*</span>
                </p>
                {errors.profileImage && touched.profileImage && (
                  <p className="text-sm text-red-600 flex items-center justify-center gap-1 mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.profileImage}
                  </p>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name Input */}
                <div className="sm:col-span-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.name && touched.name 
                            ? 'border-red-300 bg-red-50' 
                            : formData.name && !errors.name 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-gray-300'
                        }`}
                        placeholder="Enter student's full name"
                      />
                      {errors.name && touched.name && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                      {formData.name && !errors.name && touched.name && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.name && touched.name && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email Input */}
                <div className="sm:col-span-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email && touched.email 
                            ? 'border-red-300 bg-red-50' 
                            : formData.email && !errors.email 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                      {errors.email && touched.email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                      {formData.email && !errors.email && touched.email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Academic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Course Select */}
                <div className="sm:col-span-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Course <span className="text-red-500">*</span>
                      </div>
                    </label>
                    <div className="relative">
                      <select
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        disabled={coursesLoading}
                        className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                          (errors.courseId && touched.courseId) || coursesError
                            ? 'border-red-300 bg-red-50' 
                            : formData.courseId && !errors.courseId 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-gray-300'
                        } ${coursesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="">{coursesLoading ? 'Loading...' : 'Select a course'}</option>
                        {!coursesLoading && courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        {coursesLoading ? (
                          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        ) : (
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    {((errors.courseId && touched.courseId) || coursesError) && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {coursesError || errors.courseId}
                      </p>
                    )}
                  </div>

                  {coursesError && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Failed to load courses. Please try again later.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                student ? 'Update Student' : 'Add Student'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;