const express = require('express');
const app = express();
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const dataRoutes = require('./routes/dataRoute');
const roomRoute = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');

var bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/upload', uploadRoutes);
app.use('/data', dataRoutes);
app.use('/room', roomRoute);
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
