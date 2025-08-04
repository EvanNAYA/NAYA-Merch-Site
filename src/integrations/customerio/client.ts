// Customer.io integration for newsletter signups
// You'll need to add these environment variables to your .env file:
// VITE_CUSTOMER_IO_SITE_ID=your_site_id
// VITE_CUSTOMER_IO_API_KEY=your_api_key

interface NewsletterSignupData {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
}

interface CustomerIOResponse {
  success: boolean;
  message: string;
  error?: string;
}

class CustomerIOClient {
  private siteId: string;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.siteId = import.meta.env.VITE_CUSTOMER_IO_SITE_ID;
    this.apiKey = import.meta.env.VITE_CUSTOMER_IO_API_KEY;
    this.baseUrl = 'https://track.customer.io/api/v1';

    if (!this.siteId || !this.apiKey) {
      console.warn('Customer.io credentials not found. Please add VITE_CUSTOMER_IO_SITE_ID and VITE_CUSTOMER_IO_API_KEY to your .env file');
    }
  }

  async signupForNewsletter(data: NewsletterSignupData): Promise<CustomerIOResponse> {
    if (!this.siteId || !this.apiKey) {
      return {
        success: false,
        message: 'Customer.io not configured',
        error: 'Missing credentials'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/customers/${encodeURIComponent(data.email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.siteId}:${this.apiKey}`)}`
        },
        body: JSON.stringify({
          email: data.email,
          first_name: data.firstName || '',
          last_name: data.lastName || '',
          newsletter_subscribed: true,
          newsletter_signup_date: new Date().toISOString(),
          signup_source: data.source || 'website_footer',
          created_at: Math.floor(Date.now() / 1000)
        })
      });

      if (response.ok) {
        // Track the newsletter signup event
        await this.trackNewsletterSignup(data.email, data.source);
        
        return {
          success: true,
          message: 'Successfully subscribed to newsletter!'
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          message: 'Failed to subscribe to newsletter',
          error: errorText
        };
      }
    } catch (error) {
      console.error('Customer.io signup error:', error);
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async trackNewsletterSignup(email: string, source?: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/customers/${encodeURIComponent(email)}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${this.siteId}:${this.apiKey}`)}`
        },
        body: JSON.stringify({
          name: 'newsletter_signup',
          data: {
            source: source || 'website_footer',
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Failed to track newsletter signup event:', error);
    }
  }
}

export const customerIO = new CustomerIOClient();
export type { NewsletterSignupData, CustomerIOResponse }; 