import { useMemo, useState } from "react";
import { Sun, Moon, Landmark, BedDouble, RotateCcw, ArrowRight, Check } from "lucide-react";
import adkarData from "./adkar.json";

const CATEGORY_META = {
  "أذكار الصباح": { label: "Morning", arabicLabel: "أذكار الصباح", Icon: Sun },
  "أذكار المساء": { label: "Evening", arabicLabel: "أذكار المساء", Icon: Moon },
  "أذكار بعد الصلاة": { label: "After prayer", arabicLabel: "أذكار بعد الصلاة", Icon: Landmark },
  "أذكار النوم": { label: "Before sleep", arabicLabel: "أذكار النوم", Icon: BedDouble },
};

const CATEGORY_ICONS = [Sun, Moon, Landmark, BedDouble];

function normalizeAdkarItem(item) {
  return {
    id: item.id,
    text: item.text?.trim() || "",
    plainText: item.text_without_diacritical?.trim() || "",
    description: item.description?.trim() || "",
    reference: item.reference?.trim() || "",
    target: Math.max(Number(item.count) || 1, 1),
  };
}

function buildCategories(items) {
  const grouped = items.reduce((accumulator, item) => {
    const categoryName = item.category || "أذكار";
    if (!accumulator[categoryName]) {
      accumulator[categoryName] = [];
    }

    accumulator[categoryName].push(normalizeAdkarItem(item));
    return accumulator;
  }, {});

  return Object.entries(grouped).map(([categoryName, categoryItems], index) => {
    const meta = CATEGORY_META[categoryName] || {
      label: categoryName,
      arabicLabel: categoryName,
      Icon: CATEGORY_ICONS[index % CATEGORY_ICONS.length],
    };

    return {
      key: categoryName,
      ...meta,
      items: categoryItems,
    };
  });
}

const CATEGORIES = buildCategories(adkarData);

const GOLD = "#C9A356";
const GOLD_DIM = "#6E5B32";
const INK = "#0F2E2B";
const SURFACE = "#153833";
const SURFACE_LINE = "#2A5750";
const IVORY = "#F2E9D8";
const MUTED = "#8FA69F";

function OrnamentCorner({ flip }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      style={{
        position: "absolute",
        top: flip.includes("top") ? 10 : "auto",
        bottom: flip.includes("bottom") ? 10 : "auto",
        left: flip.includes("left") ? 10 : "auto",
        right: flip.includes("right") ? 10 : "auto",
        transform: `scaleX(${flip.includes("right") ? -1 : 1}) scaleY(${flip.includes("bottom") ? -1 : 1})`,
        opacity: 0.55,
      }}
    >
      <path d="M2 2 H16 M2 2 V16" stroke={GOLD} strokeWidth="1" fill="none" />
      <path d="M2 10 A8 8 0 0 1 10 2" stroke={GOLD} strokeWidth="1" fill="none" />
      <circle cx="2" cy="2" r="2" fill={GOLD} />
    </svg>
  );
}

function BeadRing({ count, target, onTap }) {
  const safeTarget = Math.max(target, 1);
  const n = Math.max(1, Math.min(safeTarget, 33));
  const filled = Math.min(n, Math.round((count / safeTarget) * n));
  const beads = useMemo(() => {
    return Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      const x = 100 + 78 * Math.cos(angle);
      const y = 100 + 78 * Math.sin(angle);
      return { x, y, on: i < filled };
    });
  }, [n, filled]);

  return (
    <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto" }}>
      <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <circle cx="100" cy="100" r="78" fill="none" stroke={SURFACE_LINE} strokeWidth="1" />
        {beads.map((b, i) => (
          <circle
            key={i}
            cx={b.x}
            cy={b.y}
            r={i === filled - 1 ? 5.5 : 4.5}
            fill={b.on ? GOLD : "transparent"}
            stroke={b.on ? GOLD : SURFACE_LINE}
            strokeWidth="1"
          />
        ))}
      </svg>
      <button
        onClick={onTap}
        aria-label="Count this dhikr"
        style={{
          position: "absolute",
          inset: 50,
          borderRadius: "50%",
          border: `1px solid ${GOLD_DIM}`,
          background: INK,
          cursor: count >= target ? "default" : "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {count >= target ? (
          <Check size={26} color={GOLD} />
        ) : (
          <span style={{ fontFamily: "'Newsreader', serif", fontSize: 34, color: IVORY, lineHeight: 1 }}>{count}</span>
        )}
        <span style={{ fontSize: 12, color: MUTED, letterSpacing: "0.04em" }}>of {target}</span>
      </button>
    </div>
  );
}

export default function AthkarApp() {
  const [cat, setCat] = useState(CATEGORIES[0]?.key || "");
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);

  const category = CATEGORIES.find((entry) => entry.key === cat) || CATEGORIES[0];
  const item = category?.items[idx];

  const selectCategory = (key) => {
    setCat(key);
    setIdx(0);
    setCount(0);
  };

  const next = () => {
    if (!category?.items.length) return;
    setIdx((i) => (i + 1) % category.items.length);
    setCount(0);
  };

  const tap = () => {
    if (!item) return;
    setCount((c) => Math.min(c + 1, item.target));
  };
  const reset = () => setCount(0);

  if (!category || !item) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: INK,
          color: IVORY,
          fontFamily: "'Inter', sans-serif",
          padding: "40px 16px",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        <p style={{ color: MUTED }}>No adhkar entries found in adkar.json.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: INK,
        color: IVORY,
        fontFamily: "'Inter', sans-serif",
        padding: "40px 16px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Newsreader:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500&display=swap');
      `}</style>

      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{ fontSize: 13, letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase", margin: "0 0 6px" }}>
            Adkar
          </p>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontWeight: 400, fontSize: 26, margin: 0, color: IVORY }}>
            Local remembrance
          </h1>
          <div style={{ width: 40, height: 1, background: GOLD, margin: "14px auto 0" }} />
        </header>

        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <aside
            style={{
              width: 240,
              flexShrink: 0,
              position: "sticky",
              top: 24,
            }}
          >
            <div
              style={{
                background: SURFACE,
                border: `1px solid ${SURFACE_LINE}`,
                borderRadius: 18,
                padding: 16,
              }}
            >
              <div style={{ marginBottom: 14 }}>
                <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.12em", color: GOLD }}>CATEGORIES</p>
                <p style={{ margin: "6px 0 0", fontSize: 18, color: IVORY, fontFamily: "'Newsreader', serif" }}>{category.arabicLabel}</p>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: MUTED }}>
                  {idx + 1} of {category.items.length}
                </p>
              </div>

              <div style={{ height: 3, borderRadius: 2, background: SURFACE_LINE, overflow: "hidden", marginBottom: 14 }}>
                <div
                  style={{
                    width: `${Math.max(4, ((idx + 1) / category.items.length) * 100)}%`,
                    height: "100%",
                    borderRadius: 2,
                    background: GOLD,
                  }}
                />
              </div>

              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  maxHeight: 320,
                  overflowY: "auto",
                  paddingRight: 4,
                }}
              >
                {CATEGORIES.map((entry) => {
                  const active = entry.key === cat;
                  const Icon = entry.Icon;
                  return (
                    <button
                      key={entry.key}
                      onClick={() => selectCategory(entry.key)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 10,
                        padding: "12px 14px",
                        borderRadius: 14,
                        fontSize: 13,
                        cursor: "pointer",
                        border: active ? `1px solid ${GOLD}` : `1px solid ${SURFACE_LINE}`,
                        background: active ? "rgba(201,163,86,0.12)" : "transparent",
                        color: active ? GOLD : MUTED,
                        textAlign: "right",
                      }}
                    >
                      <Icon size={15} />
                      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                        <span style={{ fontSize: 13, color: active ? GOLD : IVORY }}>{entry.arabicLabel}</span>
                        <span style={{ fontSize: 11, color: MUTED }}>{entry.label}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, color: MUTED }}>
              <span>{category.arabicLabel}</span>
              <span>{idx + 1} of {category.items.length}</span>
            </div>

            <div
              style={{
                position: "relative",
                background: SURFACE,
                border: `1px solid ${SURFACE_LINE}`,
                borderRadius: 16,
                padding: "40px 28px 32px",
                textAlign: "center",
              }}
            >
          <OrnamentCorner flip={["top", "left"]} />
          <OrnamentCorner flip={["top", "right"]} />
          <OrnamentCorner flip={["bottom", "left"]} />
          <OrnamentCorner flip={["bottom", "right"]} />

          <p style={{ fontSize: 12, color: MUTED, margin: "0 0 4px", letterSpacing: "0.06em" }}>
            {category.arabicLabel} · {idx + 1} of {category.items.length}
          </p>

          <p dir="rtl" style={{ fontFamily: "'Amiri', serif", fontSize: 30, lineHeight: 1.9, margin: "18px 0 16px", color: IVORY, whiteSpace: "pre-wrap" }}>
            {item.text}
          </p>

          {item.plainText ? (
            <p dir="rtl" style={{ fontSize: 14, color: MUTED, margin: "0 0 8px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {item.plainText}
            </p>
          ) : null}

          {item.description ? (
            <p style={{ fontSize: 14, color: "#C7D6D0", margin: "0 0 8px", lineHeight: 1.7 }}>
              {item.description}
            </p>
          ) : null}

          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {item.reference ? (
              <span
                style={{
                  borderRadius: 999,
                  border: `1px solid ${SURFACE_LINE}`,
                  color: MUTED,
                  padding: "5px 10px",
                  fontSize: 12,
                }}
              >
                {item.reference}
              </span>
            ) : null}
            <span
              style={{
                borderRadius: 999,
                border: `1px solid ${SURFACE_LINE}`,
                color: MUTED,
                padding: "5px 10px",
                fontSize: 12,
              }}
            >
              Repeat {item.target} times
            </span>
          </div>

          <BeadRing count={count} target={item.target} onTap={tap} />

          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24 }}>
            <button
              onClick={reset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${SURFACE_LINE}`,
                background: "transparent",
                color: MUTED,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              onClick={next}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${GOLD}`,
                background: "rgba(201,163,86,0.1)",
                color: GOLD,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
            </div>

            <p style={{ textAlign: "center", fontSize: 12, color: SURFACE_LINE, marginTop: 24 }}>
              Tap the ring to count · sourced from adkar.json
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
