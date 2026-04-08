import { webhooks } from "@/lib/webhooksStore";

export async function GET() {
  return Response.json(webhooks);
}