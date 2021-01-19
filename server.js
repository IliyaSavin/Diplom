const express = require('express');

const path = require('path');

const app = express();

// Connect to database
//connectDB();

// Init Middleware
app.use(express.json({extended: false}));
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    (value = 'Origin, Content-Type, x-auth-token')
  );
  next();
});

app.use('/api/get', require('./routes/api/get'));
app.use('/api/main', require('./routes/api/main'));
app.use('/api/add', require('./routes/api/add'));


// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
