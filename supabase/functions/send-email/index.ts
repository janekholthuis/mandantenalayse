import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface EmailRequest {
  to: string
  subject: string
  html: string
  from?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const { to, subject, html, from }: EmailRequest = await req.json()

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get email service configuration from environment variables
    const emailProvider = Deno.env.get('EMAIL_PROVIDER') || 'sendgrid'
    const apiKey = Deno.env.get('EMAIL_API_KEY')
    const fromEmail = from || Deno.env.get('FROM_EMAIL') || 'noreply@mandantenanalyse.com'

    if (!apiKey) {
      console.error('EMAIL_API_KEY environment variable is not set')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    let emailResponse

    // Send email based on provider
    if (emailProvider === 'sendgrid') {
      emailResponse = await sendWithSendGrid(apiKey, fromEmail, to, subject, html)
    } else if (emailProvider === 'mailgun') {
      emailResponse = await sendWithMailgun(apiKey, fromEmail, to, subject, html)
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported email provider' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (emailResponse.success) {
      return new Response(
        JSON.stringify({ success: true, message: 'Email sent successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: emailResponse.error }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
  } catch (error) {
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function sendWithSendGrid(apiKey: string, from: string, to: string, subject: string, html: string) {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject: subject,
          },
        ],
        from: { email: from, name: 'Mandantenanalyse.com' },
        content: [
          {
            type: 'text/html',
            value: html,
          },
        ],
      }),
    })

    if (response.ok) {
      return { success: true }
    } else {
      const errorText = await response.text()
      console.error('SendGrid error:', errorText)
      return { success: false, error: errorText }
    }
  } catch (error) {
    console.error('SendGrid request failed:', error)
    return { success: false, error: error.message }
  }
}

async function sendWithMailgun(apiKey: string, from: string, to: string, subject: string, html: string) {
  try {
    const domain = Deno.env.get('MAILGUN_DOMAIN')
    if (!domain) {
      return { success: false, error: 'MAILGUN_DOMAIN not configured' }
    }

    const formData = new FormData()
    formData.append('from', `Mandantenanalyse.com <${from}>`)
    formData.append('to', to)
    formData.append('subject', subject)
    formData.append('html', html)

    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${apiKey}`)}`,
      },
      body: formData,
    })

    if (response.ok) {
      return { success: true }
    } else {
      const errorText = await response.text()
      console.error('Mailgun error:', errorText)
      return { success: false, error: errorText }
    }
  } catch (error) {
    console.error('Mailgun request failed:', error)
    return { success: false, error: error.message }
  }
}