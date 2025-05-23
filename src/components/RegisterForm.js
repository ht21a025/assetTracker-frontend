import { useState } from "react";

export default function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://assettracker-backend.onrender.com/api/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (res.ok) {
        const user = await res.json();
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userEmail", user.email);
        onRegister(user.id);
      } else {
        alert("登録に失敗しました（既に同じメールアドレスが登録されています）");
      }
    } catch (err) {
      alert("通信エラー");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h3>新規登録</h3>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "登録中..." : "登録"}
      </button>
    </form>
  );
}
