import { useState } from "react";

export default function InitialAssetForm({ userId, onInitialSet }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `http://localhost:8080/api/asset/initial?amount=${amount}&userId=${userId}`,
      {
        method: "POST",
      }
    );

    if (response.ok) {
      setAmount("");
      if (onInitialSet) {
        onInitialSet();
      }
    } else {
      alert("初期資産の登録に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>初期資産の設定</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="初期資産（円）"
        required
      />
      <button type="submit">登録</button>
    </form>
  );
}
