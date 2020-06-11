const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

module.exports = function uploadFiles(req, res) {
  const upload = multer({ storage }).array('file', 2);
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send({ err: err.message });
    } else if (err) {
      return res.status(400).send({ err: err.message });
    }
    res.send('ok');
  });
};
