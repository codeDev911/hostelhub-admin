export const bookingEmail = (hostelName:any,hostelEmail:any,hostelPhone:any,hostelAddress:any,phone:any,name:any,email:any,room:any,price:any,checkInDate:any,status:any) =>{
    return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>HostelHub — Booking Confirmation</title>
</head>

<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Open Sans', Arial, sans-serif;color:#1A1A1A;">

  <!-- Wrapper -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0;background-color:#ffffff;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:6px;">

          <!-- Logo -->
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

          <!-- Content -->
          <tr>
            <td style="padding:28px;">

              <!-- Heading -->
              <h1 style="font-family:Inter, Arial, sans-serif;font-size:22px;margin:0 0 16px 0;font-weight:600;">
                Your Booking is recieved!
              </h1>

              <!-- Intro -->
              <p style="font-size:15px;line-height:22px;margin:0 0 20px 0;">
                Thank you for booking with <strong style="font-family:Inter;">${hostelName}</strong>. Our  team will review your booking and contact you soon.<br/> If you have any question please contact our team via : <br/>
<strong> ${hostelEmail}</strong><br/>
<strong> ${hostelPhone}</strong> <br/>
<strong> ${hostelAddress}</strong> 
<br/><br/>
                Below are your booking details:
              </p>

              <!-- Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F7F5F0;border-radius:6px;padding:16px;margin-bottom:24px;">
                <tr>
                  <td style="font-size:15px;line-height:22px;">

                    <p style="margin:0 0 10px 0;">
                      <strong style="font-family:Inter;">Name:</strong> ${name}
                    </p>

                    <p style="margin:0 0 10px 0;">
                      <strong style="font-family:Inter;">Email:</strong> ${email}
                    </p>
                    <p style="margin:0 0 10px 0;">
                      <strong style="font-family:Inter;">Phone  :</strong> ${phone}
                    </p>
 

                    <p style="margin:0 0 10px 0;">
                      <strong style="font-family:Inter;">Room:</strong> ${room}
                    </p>

   <p style="margin:0 0 10px 0;">
                      <strong style="font-family:Inter;">Price:</strong> ${price}
                    </p>

                 <p style="margin:0 0 10px 0;">
                      <strong style="font-family:Inter;">Check in date:</strong> ${new Date(checkInDate).toLocaleString("en-US",{
                        day:"numeric",
                        year:"2-digit",
                        month:"short"
                      })}
                    </p>

                    
                 <p style="margin:0 0 10px 0;">
                      <strong style="font-family:Inter;">Status:</strong> ${status}
                    </p>

                  </td>
                </tr>
              </table>

              

              <!-- Additional Note -->
              <p style="font-size:14px;line-height:20px;margin:0;color:#555555;">
                If you have any questions regarding your booking, feel free to contact the hostel directly.
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

        <!-- Legal -->
        <p style="max-width:600px;font-size:12px;color:#BDBDBD;margin:12px auto 0 auto;text-align:center;">
          You received this email because a booking was made on HostelHub.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
`
}