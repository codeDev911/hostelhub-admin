// components/InvoiceCard.tsx
"use client";

import Image from "next/image";

interface InvoiceCardProps {
  invoice: any;
}



export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  const invoiceDate = new Date(invoice.createdAt);
  const monthName = invoiceDate.toLocaleString("en-US", { month: "long" });
  
  return (
    <div className="bg-white w-full mx-auto shadow-lg rounded-lg md:p-8 p-4 border border-gray-200 text-sm text-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png" // ✅ change path if needed
            alt="HostelHub Logo"
            width={50}
            height={50}
            className="rounded-md object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">HostelHub</h1>
            <p className="text-xs text-gray-500">Invoice</p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="text-right">
          <p className="text-sm font-semibold">
            Invoice #: <span className="font-normal">{invoice.invoiceNumber}</span>
          </p>
          <p>Date: <span className="font-medium">{invoiceDate.toLocaleDateString("en-PK")}</span></p>
          <p>Due: <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString("en-PK")}</span></p>
        </div>
      </div>

      {/* Bill To / From */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mb-6">
        <div>
          <h2 className="font-semibold text-gray-900 mb-1">Bill To:</h2>
          <p><strong>{invoice.student.firstName} {invoice.student.lastName}</strong></p>
          <p>{invoice.student.email}</p>
          <p>{invoice.student.phone}</p>
          <p>{invoice.student.address}</p>
          
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-1">Bill From:</h2>
          <p><strong>{invoice.hostel.name}</strong></p>
          <p>{invoice.hostel.address}</p>
          <p>{invoice.hostel.phone}</p>
          <p>{invoice.hostel.email}</p>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 font-semibold">Description</th>
            <th className="p-3 font-semibold text-right">Amount (PKR)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-3">Monthly Hostel Rent ({monthName})</td>
            <td className="p-3 text-right font-medium">
              Rs {invoice.amount.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-between font-bold text-lg mt-4 pb-4 border-b">
        <span>Total Amount Due:</span>
        <span>Rs {invoice.amount.toLocaleString()}</span>
      </div>


      {/* Payment Status */}
      <div className="mt-4">
        <p><strong>Status:</strong> {invoice.status.toUpperCase()}</p>
    {invoice.payments?.[0] && 
    
        <p>{invoice.status.toUpperCase()}: Rs {invoice?.payments?.[0]?.amount?.toLocaleString() ?? "0"} via {invoice.payments?.[0]?.paymentMethod?.toUpperCase()}
        {invoice?.payments?.[0].receiptNumber && <span className="block">Receipt : {invoice?.payments?.[0].receiptNumber}</span>}
        </p>

    }
        {invoice.status === "paid" && (
          <p>Paid Date: {new Date().toLocaleDateString("en-PK")}</p>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-gray-600">
        <p className="font-medium">Thank you for your business!</p>
        <p className="text-xs text-gray-400">hostelhub.pk</p>
      </div>
    </div>
  );
}



export function InvoiceHTML ({invoice}:InvoiceCardProps){
    return  `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Invoice - ${invoice.invoiceNumber} </title>
<style>
  body { font-family: Arial, sans-serif; background:#f7f7f7; margin:0; padding:0; }
  .invoice-wrapper {
    max-width:650px; margin:auto; background:#fff; padding:20px;
  }
  .flex { display:flex; justify-content:space-between; }
  .logo-area { display:flex; gap:10px; align-items:center; }
  table { width:100%; border-collapse:collapse; margin-top:14px; }
  th, td { padding:10px; border:1px solid #ddd; font-size:14px; }
  th { background:#f3f3f3; font-weight:bold; }
  .footer-text { text-align:center; margin-top:15px; color:#777; font-size:12px; }
  @media(max-width:600px){
    .flex{flex-direction:column;} .logo-area{margin-bottom:10px;}
    td, th{font-size:12px;padding:8px;}
  }
</style>
</head>

<body>
<div class="invoice-wrapper">

  <!-- Header -->
  <div class="flex" style=" padding-bottom:10px;margin-bottom:10px;">
    <div class="logo-area">
      <img src="/logo.png" width="48" style="border-radius:6px;">
      <div>
        <div style="font-size:20px;font-weight:700;color:#222;">HostelHub</div>
        <div style="font-size:12px;color:#777;">Invoice</div>
      </div>
    </div>

    <div style="text-align:right;font-size:12px;">
      <div><strong>Invoice#:</strong> ${invoice.invoiceNumber}</div>
      <div><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString("en-PK")}</div>
      <div><strong>Due:</strong> ${new Date(invoice.dueDate).toLocaleDateString("en-PK")}</div>
    </div>
  </div>

  <!-- Bill To / Bill From -->
  <div class="flex" style="margin-bottom:15px;">
    <div style="width:50%;font-size:13px;">
      <strong style="font-size:14px;color:#000;">Bill To:</strong><br>
      ${invoice.student.firstName} ${invoice.student.lastName}<br>
      ${invoice.student.email}<br>
      ${invoice.student.phone}<br>
      Room: <strong>${invoice.student?.room?.roomNumber}</strong> (${invoice.student?.room?.roomType}), Floor ${invoice.student?.room?.floor}
    </div>
    </br>
    <div style="width:50%;font-size:13px;">
      <strong style="font-size:14px;color:#000;">Bill From:</strong><br>
      <strong>${invoice.hostel.name}</strong><br>
      ${invoice.hostel.address}<br>
      ${invoice.hostel.phone}<br>
      ${invoice.hostel.email}
    </div>
  </div>

  <!-- Table -->
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:right;">Amount (PKR)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Monthly Hostel Rent (${new Date(invoice.createdAt).toLocaleString("en-US", { month: "long" })})</td>
        <td style="text-align:right;">Rs ${invoice.amount.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <!-- Total -->
  <div class="" style="font-size:16px;font-weight:700;margin-top:12px;border-top:1px solid #ddd;padding-top:10px;">
    <span>Total Amount Due:</span>
    <span>Rs ${invoice.amount.toLocaleString()}</span>
  </div>

  <!-- Payment -->
  <div style="margin-top:10px;font-size:13px;">
    <strong>Status:</strong> ${invoice.status.toUpperCase()}<br>
    Paid: Rs ${(invoice.payments?.[0]?.amount ?? 0).toLocaleString()} via ${invoice.payments?.[0]?.paymentMethod}<br>
    ${invoice.status === "paid" ? `Paid Date: ${new Date().toLocaleDateString("en-PK")}` : ""}
  </div>

  <!-- Footer -->
  <div class="footer-text">
    Thank you for your business!<br>
    <strong>hostelhub.pk</strong>
  </div>

</div>
</body>
</html>
`;

}