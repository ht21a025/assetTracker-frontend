import { useState } from "react";

export default function MonthlyRecordForm({ userId, onRecordSaved }) {
  const [month, setMonth] = useState("");
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const record = {
      userId,
      month,
      income: parseInt(income),
      expense: parseInt(expense),
    };

    try {
      const response = await fetch(
        "https://assettracker-backend.onrender.com/api/asset/record",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        }
      );

      if (response.ok) {
        setMonth("");
        setIncome("");
        setExpense("");

        if (onRecordSaved) {
          onRecordSaved();
        }
      } else {
        console.error("登録に失敗しました");
      }
    } catch (error) {
      console.error("通信エラー:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>月ごとの収支登録</h3>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        required
      />
      <input
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        placeholder="収入"
        required
      />
      <input
        type="number"
        value={expense}
        onChange={(e) => setExpense(e.target.value)}
        placeholder="支出"
        required
      />
      <button type="submit">登録</button>
    </form>
  );
}
