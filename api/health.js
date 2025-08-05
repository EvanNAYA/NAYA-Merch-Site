// Health check endpoint for the webhook service
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Printify Product Automation',
    version: '1.0.0'
  });
}