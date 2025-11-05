export const runtime = "nodejs";
import fs from "fs";
import path from "path";

export async function GET() {
  const enginePath = path.resolve(
    "node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node"
  );

  const exists = fs.existsSync(enginePath);
  return new Response(
    JSON.stringify({ enginePath, exists }),
    { headers: { "content-type": "application/json" } }
  );
}
