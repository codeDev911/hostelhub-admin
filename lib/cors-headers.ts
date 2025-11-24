export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://www.hostelhub.pk",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-token",
  };
}
