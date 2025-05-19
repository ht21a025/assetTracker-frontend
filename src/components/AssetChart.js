import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const formatMonthLabel = (monthStr) => {
  if (monthStr === "初期資産") return "初期資産";
  const [year, month] = monthStr.split("-");
  return `${year}年${parseInt(month)}月`;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  }).format(value);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const asset = payload[0].value;
  const data = payload[0].payload;

  const diff = (data.income || 0) - (data.expense || 0);
  const diffStyle = {
    color: diff >= 0 ? "blue" : "red",
    fontWeight: "bold",
  };

  return (
    <div
      className="custom-tooltip"
      style={{
        backgroundColor: "#fff",
        padding: "0.8rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <p>{label}</p>
      <p>資産額: {formatCurrency(asset)}</p>
      {data.income !== undefined && data.expense !== undefined && (
        <p style={diffStyle}>
          差額: {diff >= 0 ? "+" : ""}
          {diff.toLocaleString()}円
        </p>
      )}
    </div>
  );
};

export default function AssetChart({ userId }) {
  const [data, setData] = useState([]);
  const [showBarChart, setShowBarChart] = useState(false);

  useEffect(() => {
    if (!userId) return;

    fetch(
      `https://assettracker-backend.onrender.com/api/asset/summary?userId=${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((d) => ({
          ...d,
          monthLabel: formatMonthLabel(d.month),
        }));
        setData(formatted);
      });
  }, [userId]);

  const ChartComponent = showBarChart ? BarChart : LineChart;
  const ChartElement = showBarChart ? (
    <Bar dataKey="asset" fill="#82ca9d" name="資産額" />
  ) : (
    <Line
      type="monotone"
      dataKey="asset"
      name="資産額"
      stroke="#8884d8"
      strokeWidth={2}
      dot={{ r: 3 }}
    />
  );

  return (
    <div className="chart-container">
      <h3 className="chart-title">
        資産の推移（{showBarChart ? "棒グラフ" : "折れ線グラフ"}）
      </h3>
      <button
        className="toggle-button"
        onClick={() => setShowBarChart((prev) => !prev)}
      >
        {showBarChart ? "折れ線グラフに切り替え" : "棒グラフに切り替え"}
      </button>

      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthLabel" />
          <YAxis tickFormatter={(value) => `${value.toLocaleString()}円`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {ChartElement}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
