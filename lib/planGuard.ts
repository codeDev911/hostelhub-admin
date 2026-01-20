import { NextRequest } from "next/server";
import { SessionData } from "./auth";
import { PLANS } from "./plansData";
import { redis } from "./redis";

// Map routes to features
const routeMap: any = {
  "/api/admin/rooms": "maxRooms",
  "/api/admin/rooms/add-multiple": "maxRooms",
  "/api/admin/expenses": "maxExpenses",
  "/api/admin/bookings": "maxBookings",
  "/api/admin/invoices": "maxInvoices",
  "/api/admin/invoices/generate-multiple": "maxInvoices", // We're not able to handle generate multiple inoivces limits, we have done this in /api/admin/invoices/generate-multiple
  "/api/admin/payments": "maxPayments",
  "/api/admin/students/admit": "maxUsers",
  "/api/admin/upload-images": "maxImages",
};

let featureRemaxRedisKey :any = {
  "maxUsers":"us",
  "maxRooms":"rm",
  "maxInvoices":"in",
  "maxPayments":"py",
  "maxImages":"im",
  "maxExpenses":"ex",
  "maxBookings":"bk",
}

export const centralPlanGuard = async (
  req: NextRequest,
  session: SessionData,
  data?: any,
) => { 

  let newData: any = {};
const contentType = req.headers.get("content-type") || "";

try {
  // ONLY try to parse JSON if the header says it is JSON
  if (contentType.includes("application/json")) {
    const clone = req.clone();
    newData = await clone.json();
  } 
  // If it's an image upload (FormData), we handle it differently
  else if (contentType.includes("multipart/form-data")) {
    const clone = req.clone();
    const formData = await clone.formData();
    
    // If you send a field named 'numberOfImages' in your FormData, 
    // you can grab it here. Otherwise, default to 1.
    newData.numberOfImages = formData.get("files") || "1";
  }
  
} catch (e:any) {
  console.log("Body parsing skipped or failed:", e.message);
}
  const path: any = req.nextUrl.pathname;
  let { numberOfrooms } = newData;
  const featureKey = routeMap[path];

  const planId = session.planId || null;
  if (!planId) {
    throw new Error(
      `Plan id not founded. Please subscribe to plan or logout and login again`,
      {
        cause: "PLAN_NOT_FOUND",
      },
    );
  }

  const limit = PLANS[planId][featureKey];

  const currentUsage : any = await redis.hget(`usg:${session.hostelId!}`,featureRemaxRedisKey[featureKey]) || "0"
  
  var numberOfstudents : any = "0";
  if (path == "/api/admin/invoices/generate-multiple") {
    console.log("getting students length...");
    numberOfstudents = await redis.hget(`usg:${session.hostelId!}`,featureRemaxRedisKey["maxUsers"]) || "0"
    numberOfstudents -=1
  }
  
  const totalUsage =
  parseInt(currentUsage || 0) +
  parseInt(numberOfrooms  || 0) +
  parseInt(numberOfstudents); 
   
  if (totalUsage >= limit) {
    
    throw new Error(`${featureKey} limit Exceeded. ${limit-(totalUsage-numberOfrooms)>0?limit-(totalUsage-numberOfrooms):0} remaining in your plan`, {
      cause: "LIMIT_EXCEEDED",
    });
  }

  return true;
};
