const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 8080;

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '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';
sgMail.setApiKey(SENDGRID_API_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/send-email', async (req, res) => {
  try {
    const { subject, htmlContent } = req.body;
    
    const msg = {
      to: 'info@RackRolloff.com',
      from: { email: 'info@RackRolloff.com', name: 'RackRolloff Dispatch' },
      subject: subject,
      html: htmlContent
    };

    await sgMail.send(msg);
    console.log('[SENDGRID SERVER] Email delivered to info@RackRolloff.com');
    res.status(200).json({ success: true, message: 'Email delivered via SendGrid' });
  } catch (error) {
    console.error('[SENDGRID SERVER ERROR]', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`RackRolloff SendGrid Server running on port ${PORT}`);
});
