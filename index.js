const express = require('express');
const app = express();
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use('/upload', uploadRoutes);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
