export const PLANSID : any = {
    "starter":"asdh98h",
    "professional":"u2y3ui1",
    "premium":"kajshd9",

}


export const PLANS : any = {
  "asdh98h": {
    id: "plan_starter",
    name: "Starter",
    maxUsers: 90,          
    maxRooms: 30,         
    maxImages:5,
    maxInvoices:85, // per month
    maxPayments:85, // per month
    maxExpenses:1, // per month
    maxBookings:80, // per month
    aiFeature: false,     
    analyticsLevel: 1,     
    supportType: "email",
    priceId: "price_123"  
  },
  "u2y3ui1": {
    id: "plan_pro",
    name: "Professional",
    maxUsers: 300,
    maxRooms: 70,
    maxInvoices:250,
    maxPayments:250,
    maxImages:5,
    maxExpenses:4,
    maxBookings:230,
    aiFeature: true,
    analyticsLevel: 2,
    supportType: "priority",
    priceId: "price_456"
  },
  "kajshd9": {
    id: "plan_premium",
    name: "Premium",
    maxUsers: 800,  
    maxRooms: 200,
    maxInvoices:900,
    maxPayments:900,
    maxImages:10,
    maxExpenses:20,
    maxBookings:1000,
    aiFeature: true,
    analyticsLevel: 3,
    supportType: "24/7",
    priceId: "price_789"
  }
};