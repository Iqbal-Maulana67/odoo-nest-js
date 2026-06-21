"use client";

import Loading from "@/app/loading";
import Layout from "@/components/Layout";
import StatusBubble from "@/components/ui/StatusBubble";
import { useSalesDetail } from "@/hooks/useSales";
import { ArrowLeft, Printer } from "lucide-react";
import { spans } from "next/dist/build/webpack/plugins/profiling-plugin";
import { intervalsManager } from "next/dist/server/web/sandbox/resource-managers";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SaleDetail() {
  const { id } = useParams();

  console.log("Sale ID", id);
  const { data: saleDetail, isLoading } = useSalesDetail(parseInt(String(id)));

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4 m-5">
          <div className="flex justify-end gap-2">
            <Link
              href={"/sales"}
              className="flex gap-2 items-center rounded-lg px-4 py-2 bg-red-600/20 text-red-600 hover:bg-red-600 hover:text-white transition-colors font-semibold cursor-pointer"
            >
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </Link>
            <button className="flex gap-2 items-center rounded-lg px-4 py-2 bg-yellow-600/20 text-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors font-semibold cursor-pointer">
              <Printer size={20} />
              <span>Print</span>
            </button>
          </div>
          <div className="mb-5">
            <p className="text-2xl font-semibold">Sale Information</p>
          </div>
          <div className="grid grid-cols-8 gap-4">
            <div className="col-span-6">
              <p>Sale Name: {saleDetail.name}</p>
              <p>Customer ID: {saleDetail.partner_id[0]}</p>
              <p>Customer Name: {saleDetail.partner_id[1]}</p>
            </div>
            <div className="col-span-2">
              <p>Date: {saleDetail.date_order}</p>
              <div className="flex items-center gap-2 my-1">
                <span>Status: </span>
                {saleDetail.state == "draft" ? (
                  <StatusBubble text="DRAFT" colorClass="gray-600" />
                ) : saleDetail.state == "sale" ? (
                  <StatusBubble text="SALE" colorClass="green-600" />
                ) : saleDetail.state == "cancel" ? (
                  <StatusBubble text="CANCELLED" colorClass="red-600" />
                ) : (
                  <span></span>
                )}
              </div>
              <div className="flex items-center gap-2 my-1">
                <p>Invoice Status:</p>{" "}
                {saleDetail.invoice_status == "to invoice" ? (
                  <StatusBubble text="To Invoice" colorClass="yellow-600" />
                ) : saleDetail.invoice_status == "invoiced" ? (
                  <StatusBubble text="Invoiced" colorClass="green-600" />
                ) : saleDetail.invoice_status == "no" ? (
                  <StatusBubble text="Nothing" colorClass="red-600" />
                ) : (
                  <span></span>
                )}
              </div>
            </div>
          </div>
          {/* Sale Items */}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-5">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">
                    Item Name
                  </th>
                  <th className=" px-6 py-3 font-medium text-gray-600">
                    Quantity
                  </th>
                  <th className="text-center px-6 py-3 font-medium text-gray-600">
                    Price
                  </th>
                  <th className="text-center px-6 py-3 font-medium text-gray-600">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {saleDetail.order_line.map((item: any) => {
                  return (
                    <tr key={item.id}>
                      <td className="text-left px-6 py-3">
                        {item.product_id[1]}
                      </td>
                      <td className="text-center px-6 py-3">
                        {item.product_uom_qty}
                      </td>
                      <td className="text-center px-6 py-3">
                        Rp {Number(item.price_unit).toLocaleString("id-ID")}
                      </td>
                      <td className="text-center px-6 py-3">
                        Rp {Number(item.price_subtotal).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t-1 border-black border-t-black">
                  <td></td>
                  <td></td>
                  <td className="text-right px-6 py-3">Subtotal: </td>
                  <td className="text-center px-6 py-3">
                    Rp
                    {" " +
                      saleDetail.order_line
                        .reduce((sum: number, item: any) => {
                          return Number(sum + item.price_subtotal);
                        }, 0)
                        .toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-full flex flex-col items-end px-5 py-1">
            <div className="grid grid-cols-2 gap-2">
              <span>Subtotal: </span>

              <span>
                Rp
                {" " +
                  saleDetail.order_line
                    .reduce((sum: number, item: any) => {
                      return Number(sum + item.price_subtotal);
                    }, 0)
                    .toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
