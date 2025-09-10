import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, lastName, email, phone, message } = req.body || {};
  if (!email || !message) {
    return res.status(400).json({ status: "Error", message: "Missing email or message" });
  }

  const name = `${firstName || ""} ${lastName || ""}`.trim();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Contact form message from ${name || email}`,
      html: `
        <p><strong>Name:</strong> ${name || "N/A"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return res.status(200).json({ code: 200, status: "Message Sent" });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ status: "Error", message: "Failed to send message" });
  }
}

