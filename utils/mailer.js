const nodemailer = require('nodemailer');

function send(
  from = '',
  to = [],
  subject = '',
  text = '',
  html = '',
  body = ''
) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.FIRA_MAIL_USER,
      pass: process.env.FIRA_MAIL_PASS,
    },
  });
  return new Promise(async (resolve, reject) => {
    try {
      let info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
        body,
      });
      resolve(info);
    } catch (error) {
      reject(error.message);
    }
  });
}

// send(
//   'tuongnguyen',
//   ['tuongnguyenmail@gmail.com', '17050050@student.bdu.edu.vn'],
//   'email subject',
//   'email text',
//   '<h1>HTML</h1>',
//   'email body'
// )
//   .then((info) => {
//     console.log(info);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

export default send;
