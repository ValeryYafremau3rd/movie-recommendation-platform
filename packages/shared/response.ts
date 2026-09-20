export function responseCORS(data: string, status = 200, headers?: any) {
  return new Response(data, {
    status,
    headers: {
      ...headers,
      ...corsHeaders,
    },
  });
}

export function responseJSON(data: any, status = 200, headers?: any) {
  return responseCORS(JSON.stringify(data), status, headers);
}

export function responseError(
  error: string,
  message: string,
  status = 200,
  headers?: any,
) {
  return responseCORS(JSON.stringify({ error, message }), status, headers);
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS, PUT, POST",
  "Access-Control-Allow-Headers": "Content-Type",
};
