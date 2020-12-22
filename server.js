const app = require('./app');

const port = 4003;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});