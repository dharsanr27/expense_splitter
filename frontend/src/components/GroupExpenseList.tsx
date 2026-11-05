

import API from "@/api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function GroupExpenseList() {
  type Expense = {
    Id: number;
    UserName: string;
    Description: string;
    Amount: number;
  };

  const [groupExpenses, setGroupExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { groupId } = useParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchGroupExpense = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/expenses/groupExpense/${groupId}`);
      setGroupExpenses(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch group Expenses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupExpense();
  }, [groupId]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Group Expense Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["User", "Description", "Amount"]],
      body: groupExpenses.map((expense) => [
        expense.UserName,
        expense.Description,
        `Rs. ${Number(expense.Amount).toFixed(2)}`,
      ]),
    });

    doc.save("group-expenses.pdf");
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-[#F2F4F1] dark:bg-[#11161A] text-[#2a2318] dark:text-[#ECF0EE] px-4 py-8 sm:px-6 lg:px-8 font-sans transition-colors">
        
        {loading ? (
          // Loading spinner with inline animation
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  border: "4px solid #E0E0E0",
                  borderTop: "4px solid #0F6B5C",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p className="text-base font-medium text-[#666] dark:text-[#aaa]">
                Loading expenses...
              </p>
            </div>
            
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : groupExpenses.length === 0 ? (
          // No expenses
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-center text-xl font-medium text-gray-500">
              No expenses created
            </p>
          </div>
        ) : (
          // Expenses table
          <div>
            <button
              onClick={downloadPDF}
              className="mb-4 shrink-0 whitespace-nowrap rounded-xl bg-[#0F6B5C] hover:bg-[#0c5449] active:scale-[0.98] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition"
            >
              Download PDF
            </button>

            <table className="border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="text-[#2a2318] dark:text-[#ECF0EE] text-left">
                  <th className="border p-2">User</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Amount</th>
                </tr>
              </thead>

              <tbody>
                {groupExpenses.map((expense) => (
                  <tr key={expense.Id}>
                    <td className="border p-2">{expense.UserName}</td>
                    <td className="border p-2">{expense.Description}</td>
                    <td className="border p-2">₹{expense.Amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupExpenseList;