"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Search,
  DollarSign,
  RefreshCw,
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X
} from "lucide-react";
import { getTransactionsByDateRange } from "@/actions/admin/action";

interface Transaction {
  id: string;
  bookingId: string;
  userId: string;
  travelPlanId: string;
  amount: number;
  type: "SALE" | "REFUND";
  status: "CONFIRMED" | "CANCELLED" | "REFUNDED" | "PENDING";
  createdAt: Date;
  user: {
    name: string;
    email: string;
    phone?: string | null;
  };
  travelPlan: {
    title: string;
    destination: string;
    host: {
      name: string;
    };
  };
  participants: number;
  refundAmount?: number;
}

interface RevenueReportProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  onBack: () => void;
}

const RevenueReport: React.FC<RevenueReportProps> = ({ dateRange, onBack }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await getTransactionsByDateRange(
          dateRange.startDate,
          dateRange.endDate
        );

        if (response.success) {
          setTransactions(response?.transactions);
        } else {
          console.error("Error fetching transactions:", response.error);
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [dateRange]);

  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch =
        transaction.user.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.user.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.travelPlan.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.bookingId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || transaction.status === statusFilter;
      const matchesType =
        typeFilter === "ALL" || transaction.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
    });

  const totalSales = filteredTransactions
    .filter((t) => t.type === "SALE")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = filteredTransactions
    .filter((t) => t.type === "REFUND")
    .reduce((sum, t) => sum + t.amount, 0);

  const netRevenue = totalSales - totalRefunds;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "REFUNDED":
        return <RefreshCw className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportToPDF = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Revenue Report - ${new Date(
            dateRange.startDate
          ).toLocaleDateString()} to ${new Date(
      dateRange.endDate
    ).toLocaleDateString()}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              font-size: 12px;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #333;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
              font-size: 14px;
            }
            .summary {
              display: flex;
              justify-content: space-around;
              margin-bottom: 30px;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
            }
            .summary-item {
              text-align: center;
            }
            .summary-item h3 {
              margin: 0;
              color: #333;
              font-size: 18px;
            }
            .summary-item p {
              margin: 5px 0;
              color: #666;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              font-size: 11px;
            }
            th {
              background-color: #f8f9fa;
              font-weight: bold;
              color: #333;
            }
            .status-confirmed { color: #059669; }
            .status-cancelled { color: #dc2626; }
            .status-refunded { color: #ea580c; }
            .type-sale { color: #059669; font-weight: bold; }
            .type-refund { color: #dc2626; font-weight: bold; }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #666;
              font-size: 10px;
            }
            @media print {
              body { margin: 0; }
              .summary { flex-wrap: wrap; }
              table { font-size: 10px; }
              th, td { padding: 6px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Revenue Report</h1>
            <p>${new Date(
              dateRange.startDate
            ).toLocaleDateString()} - ${new Date(
      dateRange.endDate
    ).toLocaleDateString()}</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>

          <div class="summary">
            <div class="summary-item">
              <h3>${formatCurrency(totalSales)}</h3>
              <p>Total Sales</p>
            </div>
            <div class="summary-item">
              <h3>${formatCurrency(totalRefunds)}</h3>
              <p>Total Refunds</p>
            </div>
            <div class="summary-item">
              <h3>${formatCurrency(netRevenue)}</h3>
              <p>Net Revenue</p>
            </div>
            <div class="summary-item">
              <h3>${filteredTransactions.length}</h3>
              <p>Total Transactions</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Travel Plan</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions
                .map(
                  (transaction) => `
                <tr>
                  <td>${formatDate(transaction.createdAt)}</td>
                  <td>${transaction.bookingId}</td>
                  <td>
                    <strong>${transaction.user.name}</strong><br>
                    <small>${transaction.user.email}</small>
                  </td>
                  <td>
                    <strong>${transaction.travelPlan.title}</strong><br>
                    <small>${transaction.travelPlan.destination}</small><br>
                    <small>Host: ${transaction.travelPlan.host.name}</small>
                  </td>
                  <td class="type-${transaction.type.toLowerCase()}">${
                    transaction.type
                  }</td>
                  <td class="type-${transaction.type.toLowerCase()}">
                    ${transaction.type === "SALE" ? "+" : "-"}${formatCurrency(
                    transaction.amount
                  )}
                  </td>
                  <td class="status-${transaction.status.toLowerCase()}">${
                    transaction.status
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>This report contains ${
              filteredTransactions.length
            } transactions</p>
            <p>Report generated from your revenue management system</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex mr-2 md:mr-4  items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Revenue Report
                </h1>
                <p className="text-gray-600">
                  {new Date(dateRange.startDate).toLocaleDateString()} -{" "}
                  {new Date(dateRange.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={exportToPDF}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalSales)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Refunds</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalRefunds)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Net Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(netRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredTransactions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="ALL">All Types</option>
              <option value="SALE">Sales</option>
              <option value="REFUND">Refunds</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field as "date" | "amount");
                setSortOrder(order as "asc" | "desc");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Travel Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {transaction.bookingId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.travelPlan.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.travelPlan.destination}
                          </p>
                          <p className="text-xs text-gray-400">
                            Host: {transaction.travelPlan.host.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === "SALE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          transaction.type === "SALE"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "SALE" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No transactions found for the selected criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
