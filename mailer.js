var nodeMailer = require('nodemailer');
exports.transporter = (to,subject,message)=>{
    let sender = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure:false,
        requireTLS:true,
        auth: {
          user: 'eloirochard1234@gmail.com',
          pass: 'awadycahtjvrgmvi'
        }
      });
      
      var mailMessage = {
        from: 'Eloi',
        to: to,
        subject: subject,
        html: message
      };
      
      sender.sendMail(mailMessage, function(error, data){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + data.response);
          return "success"
        }
      });
}