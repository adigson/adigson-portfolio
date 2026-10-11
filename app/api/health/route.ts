export function GET() {
  return Response.json({
    status: "operational",
    service: "adigson-portfolio",
    checkedAt: new Date().toISOString(),
  });
}
