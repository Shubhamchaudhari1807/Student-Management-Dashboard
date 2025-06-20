const apiService = {
  async fetchCourses() {
    const url = `${process.env.REACT_APP_API_BASE}/api/courses`;
    console.log("Fetching courses from:", url);

    try {
      const response = await fetch(url);
      console.log("Fetching courses response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const courses = await response.json();
      console.log("Fetched courses:", courses);
      return courses;
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      throw new Error("Could not load courses");
    }
  },
};

export default apiService;
