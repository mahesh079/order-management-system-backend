
module.exports = (err, req, res, next) => {
    console.error('Centralized error handler:', err.message || err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({ error: message });
};
