export const registrationEmail = () =>{
  return ` 
<body style="margin:0;padding:0;background-color:#ffffff;font-family: 'Open Sans', Arial, sans-serif;color:#1A1A1A;">

  <!-- Outer wrapper -->
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:36px 16px;">

        <!-- Main container -->
        <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;border-radius:6px;overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:22px 28px 10px 28px;text-align:left;">
              <img src="https://hostelhub.pk/logo.png" alt="HostelHub" width="80" style="display:block;border:0;outline:none;text-decoration:none;" />
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 28px;">
              <hr style="border:none;height:1px;background:#F0EFEC;margin:8px 0 0 0;" />
            </td>
          </tr>

          <!-- Content Card -->
          <tr>
            <td style="background-color:#ffffff;padding:28px;">
              <!-- Headline -->
              <h1 style="font-family:Inter, Arial, sans-serif;font-size:22px;margin:0 0 14px 0;font-weight:600;color:#1A1A1A;">
                Your Registration Is Received
              </h1>

              <!-- Intro paragraph -->
              <p style="font-size:15px;line-height:22px;margin:0 0 20px 0;color:#1A1A1A;">
                Thank you for registering your hostel with <strong style="font-family:Inter;">HostelHub</strong>. We’ve received your submission and our verification team will review the details you provided.
              </p>

              <!-- Trust box -->
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F7F5F0;border-radius:6px;padding:16px;">
                <tr>
                  <td style="font-size:15px;line-height:22px;color:#1A1A1A;">
                    <p style="margin:0 0 10px 0;font-weight:600;font-family:Inter;">What happens next</p>
                    <ul style="margin:0 0 0 18px;padding:0;font-size:15px;line-height:22px;color:#1A1A1A;">
                      <li style="margin-bottom:8px;">Our team reviews identity & property details for accuracy and safety.</li>
                      <li style="margin-bottom:8px;">We verify photos, amenities, and the listing information.</li>
                      <li style="margin:0;">We will notify you once your listing is approved or if we need additional information.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Optional CTA (view dashboard) -->
              <table cellspacing="0" cellpadding="0" border="0" align="left" style="margin-top:20px;">
                <tr>
                  <td align="center" bgcolor="#E2B646" style="border-radius:6px;padding:12px 22px;">
                    <a href="#" style="display:inline-block;font-family:Inter, Arial, sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                      View Your Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Support note -->
              <p style="font-size:14px;line-height:20px;margin:20px 0 0 0;color:#555555;">
                If you have any questions in the meantime, reply to this email or contact our support at
                <a href="mailto:info@hostelhub.pk" style="color:#1A1A1A;text-decoration:underline;">info@hostelhub.pk</a>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 28px;background-color:#ffffff;border-top:1px solid #F0EFEC;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="vertical-align:middle;padding-top:6px;">
                    <p style="margin:0;font-size:14px;line-height:20px;color:#777777;">
                      Regards,<br/>
                      <strong style="color:#1A1A1A;font-family:Inter;">HostelHub Team</strong><br/>
                      <span style="color:#777777;font-size:13px;">info@hostelhub.pk | +92 305 1767579</span>
                    </p>
                  </td>
                  <td style="text-align:right;vertical-align:middle;">
                    <!-- small brand mark or legal -->
                    <p style="margin:0;font-size:12px;color:#BDBDBD;">© HostelHub</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Small legal / helper -->
        <table width="600" cellspacing="0" cellpadding="0" border="0" style="margin-top:12px;">
          <tr>
            <td style="text-align:center;font-size:12px;color:#BDBDBD;padding:8px 0;">
              You received this email because you registered a hostel on HostelHub.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
 
`
}


export const RegistrationApprovedEmail = (tokenUrl:any,hostelName:any) =>{
return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>HostelHub — Hostel Approved</title>
</head>

<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Open Sans', Arial, sans-serif;color:#1A1A1A;">

  <!-- Outer Wrapper -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="padding:20px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:6px;">

          <!-- Header -->
          <tr>
            <td align="left" style="padding:20px 28px 10px 28px;">
              <img src="https://hostelhub.pk/logo.png" width="80" alt="HostelHub" style="display:block;">
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 28px;">
              <hr style="border:none;height:1px;background:#EFEFEF;margin:0;">
            </td>
          </tr>

          <!-- Content Area -->
          <tr>
            <td style="padding:28px; background-color:#ffffff;">

              <!-- Heading -->
              <h1 style="font-family:Inter, Arial, sans-serif;font-size:22px;margin:0 0 16px 0;font-weight:600;">
                Your Hostel <i>${hostelName}</i> Has Been Approved!
              </h1>

              <!-- Body Text -->
              <p style="font-size:15px;line-height:22px;margin:0 0 20px 0;">
                We’re pleased to inform you that your hostel has successfully passed our verification process. Your listing now meets HostelHub’s quality and trust standards.
              </p>

              <!-- Info Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F7F5F0;border-radius:6px;padding:16px;margin-bottom:22px;">
                <tr>
                  <td style="font-size:15px;line-height:22px;">
                    <p style="margin:0 0 8px 0;font-family:Inter;font-weight:600;">Next Step</p>
                    <p style="margin:0;">
                      Please click the button below to set up your login credentials and access your admin panel.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA (Separated Properly) -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin:0 0 30px 0;">
                <tr>
                  <td align="left">
                    <a href="${tokenUrl}"
                       style="background-color:#E2B646;color:#ffffff;font-family:Inter, Arial, sans-serif;font-size:15px;font-weight:600;text-decoration:none;padding:12px 26px;border-radius:6px;display:inline-block;">
                      Set Your Credentials
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Additional Info -->
              <p style="font-size:14px;line-height:20px;margin:0;color:#555555;">
                After setting your login, you’ll be able to manage bookings, update hostel details, upload images, and track performance from your admin dashboard.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 28px;border-top:1px solid #EFEFEF;background-color:#ffffff;">
              <p style="margin:0 0 6px 0;font-size:14px;line-height:20px;color:#777777;">
                Regards,<br>
                <strong style="font-family:Inter;color:#1A1A1A;">HostelHub Team</strong><br>
                <span style="font-size:13px;color:#777777;">info@hostelhub.pk | +92 305 1767579</span>
              </p>
              <p style="margin:4px 0 0 0;font-size:12px;color:#BDBDBD;text-align:right;">
                © HostelHub
              </p>
            </td>
          </tr>

        </table>

        <!-- Legal Line -->
        <p style="max-width:600px;font-size:12px;color:#BDBDBD;margin:12px auto 0 auto;text-align:center;">
          You received this email because your hostel was registered on HostelHub.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>

`
}


export const RegistrationRejectedEmail = (reason:any,hostelName:any) =>{
  return`
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>HostelHub — Review Update</title>
</head>

<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Open Sans', Arial, sans-serif;color:#1A1A1A;">

  <!-- Outer Wrapper -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="padding:20px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:6px;">

          <!-- Header -->
          <tr>
            <td align="left" style="padding:20px 28px 10px 28px;">
              <img src="https://hostelhub.pk/logo.png" width="80" alt="HostelHub" style="display:block;">
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 28px;">
              <hr style="border:none;height:1px;background:#EFEFEF;margin:0;">
            </td>
          </tr>

          <!-- Content Area -->
          <tr>
            <td style="padding:28px; background-color:#ffffff;">

              <!-- Heading -->
              <h1 style="font-family:Inter, Arial, sans-serif;font-size:22px;margin:0 0 16px 0;font-weight:600;">
                Your Hostel <i>${hostelName}</i> Could Not Be Approved
              </h1>

              <!-- Body Text -->
              <p style="font-size:15px;line-height:22px;margin:0 0 20px 0;">
                We appreciate you taking the time to register your hostel with <strong style="font-family:Inter;">HostelHub</strong>.  
                After reviewing the details you submitted, we’re unable to approve your listing at this time.
              </p>

              <!-- Info Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F7F5F0;border-radius:6px;padding:16px;margin-bottom:22px;">
                <tr>
                  <td style="font-size:15px;line-height:22px;">
                    <p style="margin:0 0 8px 0;font-family:Inter;font-weight:600;">Reason for Rejection</p>
                    <p style="margin:0;">
                     ${reason}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Call to Action -->
              <p style="font-size:15px;line-height:22px;margin:0 0 20px 0;">
                You are welcome to update your information and resubmit it for review at any time.
              </p>

              <table border="0" cellspacing="0" cellpadding="0" style="margin:0 0 30px 0;">
                <tr>
                  <td align="left">
                    <a href="https://hostelhub.pk" 
                       style="background-color:#E2B646;color:#ffffff;font-family:Inter, Arial, sans-serif;font-size:15px;font-weight:600;text-decoration:none;padding:12px 26px;border-radius:6px;display:inline-block;">
                      Update & Resubmit
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Support Note -->
              <p style="font-size:14px;line-height:20px;margin:0;color:#555555;">
                If you need help or want clarification about your rejection, feel free to contact our support team at 
                <a href="mailto:info@hostelhub.pk" style="color:#1A1A1A;text-decoration:underline;">info@hostelhub.pk</a>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 28px;border-top:1px solid #EFEFEF;background-color:#ffffff;">
              <p style="margin:0 0 6px 0;font-size:14px;line-height:20px;color:#777777;">
                Regards,<br>
                <strong style="font-family:Inter;color:#1A1A1A;">HostelHub Team</strong><br>
                <span style="font-size:13px;color:#777777;">info@hostelhub.pk | +92 305 1767579</span>
              </p>
              <p style="margin:4px 0 0 0;font-size:12px;color:#BDBDBD;text-align:right;">
                © HostelHub
              </p>
            </td>
          </tr>

        </table>

        <!-- Legal Line -->
        <p style="max-width:600px;font-size:12px;color:#BDBDBD;margin:12px auto 0 auto;text-align:center;">
          You received this email because you registered a hostel on HostelHub.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
`
}