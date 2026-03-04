const express = require('express');
const healthRoute = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/health', healthRoute);

app.get('/', (req, res) => {
    res.json({
        message: "Node Jenkins Demo App Running 🚀"
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;