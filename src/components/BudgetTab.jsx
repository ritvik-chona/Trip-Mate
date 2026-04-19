import { useState, useMemo, useCallback } from "react"
import { addExpense, deleteExpense } from "../services/expenseService"

const CATEGORIES = ["Food", "Transport", "Stay", "Activities", "Shopping", "Other"]

const CAT_COLORS = {
  Food:       { bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.2)",  text: "#fbbf24" },
  Transport:  { bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.2)",  text: "#60a5fa" },
  Stay:       { bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.2)",  text: "#34d399" },
  Activities: { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)", text: "#a78bfa" },
  Shopping:   { bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.2)", text: "#f472b6" },
  Other:      { bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94a3b8" },
}

const emptyForm = { name: "", amount: "", category: "Food" }

const inputStyle = {
  width: "100%",
  background: "#13121f",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 9,
  padding: "10px 13px",
  fontSize: 13,
  color: "#f0eeff",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  transition: "border-color 0.15s"
}

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#5e5c78",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.07em"
}

export default function BudgetTab({ tripId, budget, expenses, setExpenses }) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleAdd(e) {
    e.preventDefault()
    setLoading(true)
    const docRef = await addExpense(tripId, { ...form, amount: parseFloat(form.amount) })
    setExpenses(prev => [...prev, { id: docRef.id, ...form, amount: parseFloat(form.amount) }])
    setForm(emptyForm)
    setLoading(false)
  }

  const handleDelete = useCallback(async (expenseId) => {
    await deleteExpense(tripId, expenseId)
    setExpenses(prev => prev.filter(e => e.id !== expenseId))
  }, [tripId])

  const totalSpent = useMemo(() =>
    expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  , [expenses])

  const budgetNum = parseFloat(budget) || 0
  const percentage = budgetNum > 0 ? Math.min((totalSpent / budgetNum) * 100, 100) : 0
  const remaining = budgetNum - totalSpent
  const isOver = totalSpent > budgetNum

  const categoryTotals = useMemo(() =>
    CATEGORIES.reduce((acc, cat) => {
      const total = expenses
        .filter(e => e.category === cat)
        .reduce((s, e) => s + (parseFloat(e.amount) || 0), 0)
      if (total > 0) acc[cat] = total
      return acc
    }, {})
  , [expenses])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Overview */}
      <div style={{
        background: "#1a1828",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "22px"
      }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Budget", value: `₹${budgetNum.toLocaleString()}`, color: "#f0eeff" },
            { label: "Spent", value: `₹${totalSpent.toLocaleString()}`, color: isOver ? "#f87171" : "#f0eeff" },
            { label: isOver ? "Over by" : "Remaining", value: `₹${Math.abs(remaining).toLocaleString()}`, color: isOver ? "#f87171" : "#34d399" },
          ].map(stat => (
            <div key={stat.label} style={{
              background: "#13121f",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "12px 14px",
              textAlign: "center"
            }}>
              <p style={{ fontSize: 11, color: "#3d3b55", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</p>
              <p style={{ fontSize: 17, fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Bar */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#5e5c78", textTransform: "uppercase", letterSpacing: "0.07em" }}>Budget used</span>
            <span style={{
              fontSize: 12, fontWeight: 700,
              color: isOver ? "#f87171" : percentage > 80 ? "#fbbf24" : "#818cf8"
            }}>{percentage.toFixed(0)}%</span>
          </div>
          <div style={{
            background: "#13121f",
            borderRadius: 99, height: 8,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{
              height: "100%",
              borderRadius: 99,
              background: isOver
                ? "#f87171"
                : percentage > 80
                  ? "#fbbf24"
                  : "linear-gradient(90deg, #6366f1, #8b5cf6)",
              width: `${percentage}%`,
              transition: "width 0.4s ease"
            }} />
          </div>
          {isOver && (
            <p style={{ fontSize: 12, color: "#f87171", fontWeight: 600, marginTop: 7 }}>
              ⚠️ Over budget by ₹{Math.abs(remaining).toLocaleString()}
            </p>
          )}
        </div>

        {/* Category chips */}
        {Object.keys(categoryTotals).length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ ...labelStyle, marginBottom: 10 }}>By category</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {Object.entries(categoryTotals).map(([cat, total]) => (
                <span key={cat} style={{
                  background: CAT_COLORS[cat]?.bg,
                  border: `1px solid ${CAT_COLORS[cat]?.border}`,
                  color: CAT_COLORS[cat]?.text,
                  fontSize: 12, fontWeight: 600,
                  padding: "5px 12px", borderRadius: 20
                }}>
                  {cat}: ₹{total.toLocaleString()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add expense */}
      <div style={{
        background: "#1a1828",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden"
      }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0eeff" }}>Add an expense</h3>
        </div>
        <form onSubmit={handleAdd} style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Description</label>
            <input
              type="text" name="name" value={form.name}
              onChange={handleChange} required
              placeholder="e.g. Lunch at beach shack"
              style={{ ...inputStyle }}
              onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Amount (₹)</label>
              <input
                type="number" name="amount" value={form.amount}
                onChange={handleChange} required placeholder="500"
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                name="category" value={form.category}
                onChange={handleChange}
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              >
                {CATEGORIES.map(c => (
                  <option key={c} style={{ background: "#1a1828" }}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 2,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none", borderRadius: 9,
              padding: "11px",
              fontSize: 13, fontWeight: 600,
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? "Adding..." : "+ Add expense"}
          </button>
        </form>
      </div>

      {/* Expense list */}
      {expenses.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "56px 0",
          background: "#1a1828", borderRadius: 16,
          border: "1px dashed rgba(255,255,255,0.08)",
          color: "#3d3b55"
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>💸</div>
          <p style={{ fontSize: 14 }}>No expenses yet — start tracking!</p>
        </div>
      ) : (
        <div style={{
          background: "#1a1828",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "14px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "#13121f"
          }}>
            <p style={{ ...labelStyle, marginBottom: 0 }}>All expenses</p>
          </div>
          {expenses.map((expense, index) => (
            <div
              key={expense.id}
              style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "13px 22px",
                borderBottom: index !== expenses.length - 1
                  ? "1px solid rgba(255,255,255,0.04)"
                  : "none",
                transition: "background 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <span style={{
                  background: CAT_COLORS[expense.category]?.bg,
                  border: `1px solid ${CAT_COLORS[expense.category]?.border}`,
                  color: CAT_COLORS[expense.category]?.text,
                  fontSize: 11, fontWeight: 700,
                  padding: "3px 10px", borderRadius: 20,
                  whiteSpace: "nowrap"
                }}>{expense.category}</span>
                <span style={{ fontSize: 13, color: "#9b98b8" }}>{expense.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#f0eeff" }}>
                  ₹{parseFloat(expense.amount).toLocaleString()}
                </span>
                <button
                  onClick={() => handleDelete(expense.id)}
                  style={{
                    background: "none", border: "none",
                    color: "#2d2b45",
                    cursor: "pointer", fontSize: 15,
                    lineHeight: 1, transition: "color 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                  onMouseLeave={e => e.currentTarget.style.color = "#2d2b45"}
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}