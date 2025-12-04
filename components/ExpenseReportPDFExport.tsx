import Image from "next/image";

interface ExpenseItem {
  title: string;
  description?: string;
  category: string;
  amount: number;
  receiptUrl?: string;
}

interface ExpenseReportProps {
  items: ExpenseItem[];
  reportTitle?: string;
  reportNumber?: string;
}

export default function ExpenseReportPDFExport({
  items,
  reportTitle = "Expense report ",
  reportNumber = "EXP-001",
}: ExpenseReportProps) {
  const reportDate = new Date();
  const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="" id="expense-report">
      {/* Report Container */}
      <div className="bg-white relative w-full mx-auto shadow-lg rounded-lg md:p-8 p-4 border border-gray-200 text-sm text-gray-700">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div className="flex items-center gap-2">
            {/* <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-md object-contain"
            /> */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{reportTitle}</h1>
              <span className="text-base ">New hostel,</span>
              <p className="text-sm ">Board bazar, Peshawar</p>
              <p className="text-sm ">(+923045645642)</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold">
              Report #: <span className="font-normal">{reportNumber}</span>
            </p>
            <p>
              Date:{" "}
              <span className="font-medium">
                {reportDate.toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>

        <div className="my-6 w-full flex flex-col  items-center ">
            <p className="text-xl font-semibold ">November, 2025 Expense report</p>
            <p className="text-base ">This is the report description created by me admin</p>
            <p className="text-sm ">November, 2025</p>
        
        </div>
          <Image
              src="/logo.png"
              alt="Logo"
              width={400}
              height={400}
              className="rounded-md md:w-[35%] w-[80%] absolute opacity-5 top-1/4 md:right-1/3 right-1/6  object-contain"
            />

        {/* Table */}
        <h2 className="text-lg mb-2 font-semibold">Summary </h2>
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 font-semibold">Title</th>
              <th className="p-3 font-semibold">Description</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold text-right">Amount (PKR)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-3">{item.title}</td>
                <td className="p-3">{item.description || "-"}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3 text-right font-medium">
                  Rs {item.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-between font-bold text-lg mt-4 pb-4 border-b">
          <span>Total Amount:</span>
          <span>Rs {totalAmount.toLocaleString()}</span>
        </div>
          <p className="text-xs font-normal p-2">
            This report is an official record of all expenses for "Hostelhub" of the month (November) & year (2025).
            All listed details are accurate and serve as proof of the expenditures incurred.
            Any discrepancies or questions can be addressed to the business administration.
            <br />
            Generated on: {reportDate.toLocaleDateString()}
          </p>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600">
          <p className="font-medium">
            This is monthly expense report of 'hostel name', provided by
            Hostelhub!
          </p>
          <p className="text-xs text-gray-400">hostelhub.pk</p>
        </div>
      </div>
    </div>
  );
}


export function ExpenseReportPDFExportHTML(items:any,data:any){
 return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.title} - ${data.hostel.name.toUpperCase()}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: 'Arial', sans-serif;
      background-color: #f3f4f6;
      color: #374151;
    }

    .report-wrapper {
      max-width: 800px;
      margin: auto;
      background: #fff;
      position: relative;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-area h1 {
      font-size: 1.25rem;
      font-weight: bold;
      color: #111827;
      margin: 0;
    }

    .logo-area span, .logo-area p {
      font-size: 0.875rem;
      margin: 0;
    }

    .report-info {
      text-align: right;
      font-size: 0.875rem;
    }

    /* Report title */
    .report-title {
      text-align: center;
      margin: 1.5rem 0;
    }

    .report-title p {
      margin: 0.25rem 0;
    }

    .report-title .main-title {
      font-size: 1.25rem;
      font-weight: 600;
    }

    /* Background logo / watermark */
    .watermark {
      position: absolute;
      top: 25%;
      right: 30%;
      opacity: 0.05;
      width: 35%;
      max-width: 80%;
      object-fit: contain;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      font-size: 0.875rem;
    }

    th, td {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
    }

    th {
      background-color: #f3f4f6;
      font-weight: 600;
      text-align: left;
    }

    td:last-child, th:last-child {
      text-align: right;
    }

    /* Total */
    .total {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 1.125rem;
      margin-top: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #d1d5db;
    }

    /* Footer */
    .footer-text {
      font-size: 0.75rem;
      margin-top: 1rem;
      line-height: 1.3;
    }

    .footer-center {
      text-align: center;
      margin-top: 1.5rem;
      color: #6b7280;
      font-size: 0.875rem;
    }

    @media(max-width: 600px) {
     
      .logo-area {
        margin-bottom: 1rem;
      }
      th, td {
        font-size: 0.75rem;
        padding: 0.5rem;
      }
      .report-title .main-title {
        font-size: 1rem;
      }
    }
  </style>
</head>
<body>
  <div class="report-wrapper">
    <!-- Header -->
    <div class="header">
      <div class="logo-area">
        <!-- <img src="/logo.png" alt="Logo" width="50" height="50" /> -->
        <div>
          <h1>Monthly expense report</h1>
          <span>${data?.hostel?.name}</span>
          <p>${data?.hostel?.address}</p>
          <p>${data?.hostel?.phone}</p>
        </div>
      </div>
      <div class="report-info">
        <p>Report #: ${data.id}</p>
        <p>Date: ${new Date(data.createdAt).toLocaleString('en-US',{
          "month":"short",
          day:"numeric",
          year:"numeric"
        })}</p>
      </div>
    </div>

    <!-- Report Title -->
    <div class="report-title">
      <p class="main-title">${data?.title}</p>
      <p>${data.description}</p>
      <p>${new Date(new Date().setMonth(Number(data.month)-1)).toLocaleString("en-US",{
        "month":"long"
      })}, ${data.year}</p>
    </div>

    <!-- Watermark -->
    <img src="/logo.png" alt="Watermark Logo" class="watermark">

    <!-- Table -->
    <h3>Summary</h3>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount (PKR)</th>
        </tr>
      </thead>
      <tbody>
       
       ${items?.map((item:any)=>(
        `<tr>
          <td>${item.title}</td>
          <td>${item.description}</td>
          <td>${item.category}</td>
          <td>Rs ${item.amount.toLocaleString()}</td>
        </tr>`
       ))}
      </tbody>
    </table>

    <!-- Total -->
    <div class="total">
      <span>Total Amount:</span>
      <span>Rs ${items.reduce((sum:any,item:any)=>  sum + Number(item.amount), 0).toLocaleString()}</span>
    </div>

    <!-- Footer Text / Claim -->
    <p class="footer-text">
      This report is an official record of all expenses for ${data.hostel.name.toUpperCase()} of the month <i>${new Date(new Date().setMonth(data.month)).toLocaleString("en-US",{
        "month":"long"
      })}</i> & year <i>${data.year}</i>.
      All listed details are accurate and serve as proof of the expenditures incurred.
      Any discrepancies or questions can be addressed to the business administration.
      <br>
      Generated on: ${new Date().toLocaleString("en-US",{month:"short",year:"numeric",day:"numeric"})}
    </p>

    <!-- Footer -->
    <div class="footer-center">
      <p>This is the monthly expense report of ${data.hostel.name.toUpperCase()}, provided by Hostelhub!</p>
      <p>hostelhub.pk</p>
    </div>
  </div>
</body>
</html>
`
}