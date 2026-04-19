import { useState, useCallback, useRef } from "react"
import { addItineraryItem, updateItineraryItem, deleteItineraryItem } from "../services/itineraryService"

const DAYS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"]
const emptyForm = { day: "Day 1", time: "", activity: "", place: "", note: "" }

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

export default function ItineraryTab({ tripId, items, setItems }) {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [loading, setLoading] = useState(false)
  const activityInputRef = useRef(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleAdd(e) {
    e.preventDefault()
    setLoading(true)
    const docRef = await addItineraryItem(tripId, form)
    setItems(prev => [...prev, { id: docRef.id, ...form }])
    setForm(emptyForm)
    setLoading(false)
    activityInputRef.current?.focus()
  }

  const handleDelete = useCallback(async (itemId) => {
    await deleteItineraryItem(tripId, itemId)
    setItems(prev => prev.filter(i => i.id !== itemId))
  }, [tripId])

  async function handleEditSave(itemId) {
    await updateItineraryItem(tripId, itemId, editForm)
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, ...editForm } : i))
    setEditingId(null)
  }

  const groupedItems = DAYS.reduce((acc, day) => {
    const dayItems = items.filter(i => i.day === day)
    if (dayItems.length > 0) acc[day] = dayItems
    return acc
  }, {})

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Add form */}
      <div style={{
        background: "#1a1828",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "16px 22px",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0eeff" }}>Add an activity</h3>
        </div>
        <form onSubmit={handleAdd} style={{
          padding: "20px 22px",
          display: "flex", flexDirection: "column", gap: 14
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Day</label>
              <select
                name="day" value={form.day} onChange={handleChange}
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              >
                {DAYS.map(d => <option key={d} style={{ background: "#1a1828" }}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <input
                type="time" name="time" value={form.time} onChange={handleChange}
                style={{ ...inputStyle }}
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Activity</label>
            <input
              ref={activityInputRef}
              type="text" name="activity" value={form.activity}
              onChange={handleChange} required
              placeholder="e.g. Visit Baga Beach"
              style={{ ...inputStyle }}
              onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <div>
            <label style={labelStyle}>Place / Location</label>
            <input
              type="text" name="place" value={form.place}
              onChange={handleChange}
              placeholder="e.g. Baga Beach, North Goa"
              style={{ ...inputStyle }}
              onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <div>
            <label style={labelStyle}>Note (optional)</label>
            <input
              type="text" name="note" value={form.note}
              onChange={handleChange}
              placeholder="e.g. Carry sunscreen"
              style={{ ...inputStyle }}
              onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
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
            {loading ? "Adding..." : "+ Add activity"}
          </button>
        </form>
      </div>

      {/* Items grouped by day */}
      {Object.keys(groupedItems).length === 0 ? (
        <div style={{
          textAlign: "center", padding: "56px 0",
          background: "#1a1828", borderRadius: 16,
          border: "1px dashed rgba(255,255,255,0.08)",
          color: "#3d3b55"
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🗓️</div>
          <p style={{ fontSize: 14 }}>No activities yet — add your first one above!</p>
        </div>
      ) : (
        Object.entries(groupedItems).map(([day, dayItems]) => (
          <div key={day}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{
                background: "rgba(99,102,241,0.15)",
                color: "#818cf8",
                fontSize: 11, fontWeight: 700,
                padding: "4px 12px", borderRadius: 20,
                textTransform: "uppercase", letterSpacing: "0.06em",
                border: "1px solid rgba(99,102,241,0.2)"
              }}>{day}</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {dayItems.sort((a, b) => a.time?.localeCompare(b.time)).map(item => (
                <div key={item.id} style={{
                  background: "#1a1828",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "14px 18px",
                  transition: "border-color 0.15s"
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
                >
                  {editingId === item.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <input type="text" value={editForm.activity} onChange={e => setEditForm(p => ({ ...p, activity: e.target.value }))} style={{ ...inputStyle }} placeholder="Activity" />
                        <input type="time" value={editForm.time} onChange={e => setEditForm(p => ({ ...p, time: e.target.value }))} style={{ ...inputStyle }} />
                      </div>
                      <input type="text" value={editForm.place} onChange={e => setEditForm(p => ({ ...p, place: e.target.value }))} style={{ ...inputStyle }} placeholder="Place" />
                      <input type="text" value={editForm.note} onChange={e => setEditForm(p => ({ ...p, note: e.target.value }))} style={{ ...inputStyle }} placeholder="Note" />
                      <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                        <button onClick={() => handleEditSave(item.id)} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 7, padding: "7px 16px", fontSize: 12, fontWeight: 600, color: "#fff", cursor: "pointer" }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "7px 16px", fontSize: 12, color: "#9b98b8", cursor: "pointer" }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 14 }}>
                        <span style={{
                          minWidth: 44, fontSize: 12,
                          fontWeight: 600, color: "#6366f1", paddingTop: 1
                        }}>{item.time || "--:--"}</span>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#f0eeff", marginBottom: 3 }}>{item.activity}</p>
                          {item.place && <p style={{ fontSize: 12, color: "#5e5c78", marginBottom: 2 }}>📍 {item.place}</p>}
                          {item.note && <p style={{ fontSize: 12, color: "#3d3b55", fontStyle: "italic" }}>{item.note}</p>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 7, marginLeft: 12, flexShrink: 0 }}>
                        <button
                          onClick={() => { setEditingId(item.id); setEditForm({ ...item }) }}
                          style={{
                            background: "rgba(99,102,241,0.1)",
                            border: "1px solid rgba(99,102,241,0.2)",
                            borderRadius: 7, padding: "4px 12px",
                            fontSize: 12, fontWeight: 600,
                            color: "#818cf8", cursor: "pointer"
                          }}
                        >Edit</button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            background: "rgba(248,113,113,0.08)",
                            border: "1px solid rgba(248,113,113,0.15)",
                            borderRadius: 7, padding: "4px 12px",
                            fontSize: 12, fontWeight: 600,
                            color: "#f87171", cursor: "pointer"
                          }}
                        >Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}