import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWaitlistWelcomeEmail(toEmail: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Skipping waitlist welcome email for:', toEmail);
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Review2PRD <onboarding@resend.dev>', // Update this to your verified domain later: e.g. hello@app.review2prd.com
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

        if (error) {
            console.error('Failed to send waitlist email via Resend:', error);
        } else {
            console.log(`Waitlist welcome email sent successfully to ${toEmail} (ID: ${data?.id})`);
        }
    } catch (err) {
        console.error('Unexpected error sending waitlist email:', err);
    }
}
