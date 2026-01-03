export const linkVerificationMail = (link: string) => {
   return `
   <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Email - HostelHub</title>
  </head>

  <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Inter,Arial,Helvetica,sans-serif;">

    <!-- Outer Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 16px;background-color:#f1f5f9;">
      <tr>
        <td align="center">

          <!-- Main Card -->
          <table width="100%" cellpadding="0" cellspacing="0"
            style="max-width:540px;background-color:#ffffff;border-radius:16px;box-shadow:0 12px 32px rgba(15,23,42,0.08);overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="padding:32px 32px 24px 32px;">
                <h1 style="margin:0;font-size:24px;font-weight:700;color:#0f172a;">
                  HostelHub
                </h1>
                <p style="margin:6px 0 0 0;font-size:14px;color:#64748b;">
                  One platform for students & hostels
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:0 32px;">
                <div style="height:1px;background-color:#e5e7eb;"></div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:28px 32px 32px 32px;">
                <h2 style="margin:0 0 12px 0;font-size:20px;font-weight:600;color:#111827;">
                  Verify your email address
                </h2>

                <p style="margin:0 0 20px 0;font-size:15px;line-height:1.7;color:#475569;">
                  Thanks for using <strong>HostelHub</strong>.  
                  You've made a request to verify your email address. Please click the button below to complete the process.
                </p>

                <!-- CTA Button -->
                <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
                  <tr>
                    <td align="left">
                      <a href="${link}"
                        style="
                          display:inline-block;
                          padding:14px 26px;
                          background-color:#edce00;
                          color:#111827;
                          text-decoration:none;
                          font-size:15px;
                          font-weight:700;
                          border-radius:12px;
                        ">
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>

              

                <!-- Info Box -->
                <div style="margin-top:28px;padding:14px 16px;background-color:#fff9db;border-radius:12px;">
                  <p style="margin:0;font-size:13px;line-height:1.6;color:#92400e;">
                    If you didn’t create an account on HostelHub, you can safely ignore this email.
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 32px;background-color:#f8fafc;text-align:center;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">
                  © 2026 HostelHub. All rights reserved.
                </p>
                <p style="margin:6px 0 0 0;font-size:12px;color:#94a3b8;">
                  Built for students. Trusted by hostels.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>
`
}