import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.2.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
// --- FIX: Using the correct, hardcoded public URL for your logo ---
const LOGO_URL = "https://lehpiptexuxbnxgdunmc.supabase.co/storage/v1/object/public/assets/tedxauc-logo-new.png";
const WEBHOOK_SECRET = Deno.env.get("EMAIL_WEBHOOK_SECRET");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  if (secret !== WEBHOOK_SECRET) {
    console.error("Unauthorized: Invalid webhook secret.");
    return new Response("Unauthorized", { status: 401, headers: CORS_HEADERS });
  }

  try {
    const { record } = await req.json();
    console.log("Secure function received a new booking record:", record);

    const { 
      customer_name, 
      customer_email, 
      selected_seats, 
      event_title, 
      event_date, 
      event_time 
    } = record;

    if (!customer_email) {
      throw new Error("Customer email is missing.");
    }

    const { data, error } = await resend.emails.send({
      // 🐛 FIX APPLIED HERE: Changed from 'tickets@tedxauc.org' to your verified domain 'tickets@tedxamity.com'
      from: "TEDxAUC Tickets <tickets@tedxamity.com>", 
      to: [customer_email],
      subject: `Your Ticket Confirmation for ${event_title}`,
      // --- REDESIGNED HTML TEMPLATE ---
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your TEDxAUC Ticket</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f0f2f5;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f0f2f5;">
            <tr>
              <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  <tr>
                    <td align="center" style="padding: 30px 20px; background-color: #111111; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                      <img src="${LOGO_URL}" alt="TEDxAUC Logo" width="120">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px; color: #333333;">
                      <h1 style="color: #e62b1e; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">Booking Confirmed!</h1>
                      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${customer_name},</p>
                      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">Thank you for booking your ticket for <strong>${event_title}</strong>. We're excited to have you join us for this inspiring event.</p>
                      
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eeeeee; border-radius: 8px; overflow: hidden;">
                        <tr>
                          <td style="padding: 20px; background-color: #f9f9f9;">
                            <h2 style="font-size: 20px; color: #333; margin: 0 0 15px 0;">Your Ticket Details</h2>
                            <table width="100%" border="0" cellspacing="0" cellpadding="5">
                              <tr>
                                <td style="color: #666666; width: 100px; padding-bottom: 10px;">Attendee:</td>
                                <td style="color: #111111; font-weight: bold;">${customer_name}</td>
                              </tr>
                              <tr>
                                <td style="color: #666666; padding-bottom: 10px;">Event:</td>
                                <td style="color: #111111; font-weight: bold;">${event_title}</td>
                              </tr>
                              <tr>
                                <td style="color: #666666; padding-bottom: 10px;">Date & Time:</td>
                                <td style="color: #111111; font-weight: bold;">${event_date} at ${event_time}</td>
                              </tr>
                               <tr>
                                <td style="color: #666666;">Seat(s):</td>
                                <td style="color: #111111; font-weight: bold;">${selected_seats.join(", ")}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 20px; background-color: #e62b1e; border-top: 1px solid #dddddd;">
                            <p style="font-size: 12px; color: #ffffff; margin: 0; text-align: center;">
                              <strong>Important:</strong> Show this email or the ticket in your website profile at the gate.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">We can't wait to see you there!</p>
                      <p style="font-size: 16px; line-height: 1.6; margin: 10px 0 0 0;"><em>- The TEDxAUC Team</em></p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 20px; font-size: 12px; color: #777777; background-color: #f0f2f5;">
                      <p style="margin: 0;">&copy; ${new Date().getFullYear()} TEDxAUC, Amity University Chhattisgarh. All rights reserved.</p>
                      <p style="margin: 5px 0 0 0;">This independent TEDx event is operated under license from TED.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw new Error(JSON.stringify(error));
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });

  } catch (err) {
    console.error("An error occurred in the Edge Function:", err.message);
    return new Response(String(err?.message ?? err), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
});