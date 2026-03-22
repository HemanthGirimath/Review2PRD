import nodemailer from 'nodemailer';

// Create a reusable transporter using Gmail's SMTP service explicitly for container compatibility
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL (port 465) to bypass certain Docker/Railway network restrictions
    auth: {
        user: process.env.GMAIL_USER, // e.g., 'your.email@gmail.com'
        pass: process.env.GMAIL_APP_PASSWORD // The 16-character App Password, NOT your real password
    }
});

export async function sendWaitlistWelcomeEmail(toEmail: string) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('GMAIL_USER or GMAIL_APP_PASSWORD is not set. Skipping waitlist welcome email for:', toEmail);
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: `"Review2PRD" <${process.env.GMAIL_USER}>`,
            to: toEmail,
            subject: "You're on the list! Welcome to Review2PRD",
            html: `
                <div style="font-family: Arial, sans-serif; color: #1b1b18; padding: 20px;">
                    <h2 style="color: #1b1b18; font-size: 24px;">Welcome to Review2PRD! 🎉</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #4a4a44;">
                        Hey there,<br/><br/>
                        Thanks for joining the Review2PRD waitlist! We're thrilled to have you on board.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #4a4a44;">
                        Our mission is to stop you from manually copy-pasting App Store reviews and help you <strong>turn complaints into actionable product specs</strong> in under 2 minutes.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #4a4a44;">
                        We will notify you at this email address as soon as we open up early access. In the meantime, keep an eye out for updates.
                    </p>
                    <br/>
                    <p style="font-size: 16px; font-weight: bold; color: #1b1b18;">
                        — The Review2PRD Team
                    </p>
                </div>
            `
        });

        console.log(`Waitlist welcome email sent successfully to ${toEmail} (Message ID: ${info.messageId})`);
    } catch (err) {
        console.error('Unexpected error sending waitlist email via Nodemailer:', err);
    }
}
