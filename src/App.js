import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import InitialAssetForm from "./components/InitialAssetForm";
import MonthlyRecordForm from "./components/MonthlyRecordForm";
import AssetChart from "./components/AssetChart";

function App() {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedUserId) setUserId(storedUserId);
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    setUserId(null);
    setUserEmail(null);
    setShowRegister(false);
  };

  const triggerChartUpdate = () => setRefreshKey((k) => k + 1);

  if (!userId) {
    return (
      <div className="auth-wrapper">
        <h2>資産管理アプリ</h2>
        {showRegister ? (
          <>
            <RegisterForm
              onRegister={(id) => {
                setUserId(id);
                setUserEmail(localStorage.getItem("userEmail"));
              }}
            />
            <p>
              すでにアカウントをお持ちですか？{" "}
              <button onClick={() => setShowRegister(false)}>ログイン</button>
            </p>
          </>
        ) : (
          <>
            <LoginForm
              onLogin={(id) => {
                setUserId(id);
                setUserEmail(localStorage.getItem("userEmail"));
              }}
            />
            <p>
              アカウントをお持ちでないですか？{" "}
              <button onClick={() => setShowRegister(true)}>新規登録</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <header className="app-header">
        <h2>資産管理アプリ</h2>
        <div className="user-info">
          <span>{userEmail} さん</span>
          <button className="logout-button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <div className="layout-container">
        <div className="form-row">
          <InitialAssetForm userId={userId} onInitialSet={triggerChartUpdate} />
          <MonthlyRecordForm
            userId={userId}
            onRecordSaved={triggerChartUpdate}
          />
        </div>
        <AssetChart userId={userId} key={refreshKey} />
      </div>
    </div>
  );
}

export default App;
