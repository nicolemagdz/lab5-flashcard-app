const express = require('express');
const routes = require('./routes');
const { errorHandler, ApiError } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api', routes);

// Unmatched routes -> 404
app.use((req, res, next) => {
  next(new ApiError(404, `No route for ${req.method} ${req.originalUrl}`));
});

// Must be registered last.
app.use(errorHandler);

module.exports = app;
