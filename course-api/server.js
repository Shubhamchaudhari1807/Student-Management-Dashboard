const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;


app.use(cors());



const courses = [
  { id: 1, name: 'HTML Basics' },
  { id: 2, name: 'CSS Mastery' },
  { id: 3, name: 'JavaScript Pro' },
  { id: 4, name: 'React In Depth' },
  { id: 5, name: 'Node.js Backend' },
  { id: 6, name: 'Full Stack Development' },
];

app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}/api/courses`);
});
