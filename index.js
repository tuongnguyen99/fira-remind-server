const express = require('express');
const app = express();
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const excerRouter = require('./routes/excelAPI');
var bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use('/upload', uploadRoutes);
app.use('/excel', excerRouter);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
