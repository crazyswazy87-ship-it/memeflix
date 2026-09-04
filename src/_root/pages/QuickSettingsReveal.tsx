import React, { useRef, useState, useCallback, type JSX, type ReactNode, type CSSProperties} from "react";
import { Wifi, ArrowUpDown, Bluetooth, Flashlight, ChevronDown } from "lucide-react";

/**
 * QuickSettingsReveal
 * -----------------------------------------------------------------------
 * Recreates the Android "pull down" quick-settings animation:
 * the quick-settings row lives BEHIND the screen content. Dragging down
 * from the top doesn't slide a panel on top of the screen — it shrinks
 * and pushes the screen content down/back (with rounded corners),
 * revealing the bar that was sitting behind it the whole time.
 */

const MAX_REVEAL = 230; // px the panel can be dragged open
const OPEN_THRESHOLD = 0.38; // fraction of MAX_REVEAL to snap open

const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

export default function QuickSettingsReveal(): JSX.Element {
  const [reveal, setReveal] = useState<number>(0); // 0..MAX_REVEAL
  const [dragging, setDragging] = useState<boolean>(false);
  const startY = useRef<number>(0);
  const startReveal = useRef<number>(0);
  const pointerId = useRef<number | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      pointerId.current = e.pointerId;
      startY.current = e.clientY;
      startReveal.current = reveal;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [reveal]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging || e.pointerId !== pointerId.current) return;
      const delta = e.clientY - startY.current;
      setReveal(clamp(startReveal.current + delta, 0, MAX_REVEAL));
    },
    [dragging]
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      setDragging(false);
      const progress = reveal / MAX_REVEAL;
      setReveal(progress > OPEN_THRESHOLD ? MAX_REVEAL : 0);
    },
    [dragging, reveal]
  );

  const toggle = () => setReveal((r) => (r > 0 ? 0 : MAX_REVEAL));

  const progress = reveal / MAX_REVEAL; // 0..1
  const scale = 1 - progress * 0.06;
  const radius = 8 + progress * 26;

  return (
    <div style={styles.stage}>
      <div style={styles.phone}>
        {/* ---- Layer behind: quick settings + notifications ---- */}
        <div style={styles.behind}>
          <div style={styles.statusRow}>
            <span style={styles.clock}>2:46</span>
            <div style={styles.statusIcons}>
              <Wifi size={14} />
              <span style={styles.battery} />
            </div>
          </div>

          <div style={{ ...styles.tilesRow, opacity: clamp(progress * 2.4, 0, 1) }}>
            <Tile icon={<Wifi size={18} />} label="Konekt" active />
            <Tile icon={<ArrowUpDown size={18} />} label="Mobile data" />
          </div>
          <div style={{ ...styles.tilesRow, opacity: clamp(progress * 2.4 - 0.15, 0, 1) }}>
            <Tile icon={<Bluetooth size={18} />} label="Bluetooth" />
            <Tile icon={<Flashlight size={18} />} label="Flashlight" />
          </div>

          <div style={{ ...styles.notif, opacity: clamp(progress * 2.4 - 0.3, 0, 1) }}>
            <div style={styles.notifAvatar} />
            <div style={{ flex: 1 }}>
              <div style={styles.notifTitle}>kishtrades · now</div>
              <div style={styles.notifBody}>New message received</div>
            </div>
          </div>
        </div>

        {/* ---- Foreground: the actual screen, gets pushed/scaled away ---- */}
        <div
          style={{
            ...styles.front,
            transform: `translateY(${reveal}px) scale(${scale})`,
            borderRadius: `${radius}px ${radius}px 0 0`,
            transition: dragging
              ? "none"
              : "transform 260ms cubic-bezier(.2,.8,.2,1), border-radius 260ms",
            boxShadow: progress > 0.02 ? "0 -14px 30px rgba(0,0,0,0.45)" : "none",
          }}
        >
          {/* drag handle strip lives at the very top of the front layer */}
          <div
            style={styles.dragHandle}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClick={reveal === 0 || reveal === MAX_REVEAL ? toggle : undefined}
          >
            <div style={styles.grip} />
          </div>

          <div style={styles.appContent}>
            <h1 style={styles.appTitle}>Home</h1>
            <p style={styles.appHint}>
              Drag the handle down — or tap it — to see the panel reveal from behind.
            </p>
            <div style={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={styles.appIcon} />
              ))}
            </div>
          </div>
        </div>

        <button style={styles.hint} onClick={toggle} aria-label="Toggle quick settings">
          <ChevronDown
            size={16}
            style={{
              transform: reveal > 0 ? "rotate(180deg)" : "none",
              transition: "transform 260ms",
            }}
          />
        </button>
      </div>
    </div>
  );
}

interface TileProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
}

function Tile({ icon, label, active }: TileProps): JSX.Element {
  return (
    <div
      style={{
        ...styles.tile,
        background: active ? "#cfe0ff" : "#3a3a3d",
        color: active ? "#0b1a3a" : "#eee",
      }}
    >
      {icon}
      <span style={styles.tileLabel}>{label}</span>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  stage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111214",
    fontFamily: "'Segoe UI', Roboto, system-ui, sans-serif",
    padding: 24,
  },
  phone: {
    position: "relative",
    width: 320,
    height: 640,
    borderRadius: 36,
    overflow: "hidden",
    background: "#000",
    border: "8px solid #1c1c1e",
    boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
  },
  behind: {
    position: "absolute",
    inset: 0,
    background: "#0e0e10",
    padding: "16px 14px",
    boxSizing: "border-box",
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#f2f2f2",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 14,
  },
  statusIcons: { display: "flex", alignItems: "center", gap: 6, color: "#f2f2f2" },
  battery: {
    width: 16,
    height: 9,
    border: "1px solid #f2f2f2",
    borderRadius: 2,
    display: "inline-block",
  },
  clock: { letterSpacing: 0.3 },
  tilesRow: { display: "flex", gap: 10, marginBottom: 10, transition: "opacity 200ms" },
  tile: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 14px",
    borderRadius: 24,
    fontSize: 13,
    fontWeight: 600,
  },
  tileLabel: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  notif: {
    marginTop: 8,
    display: "flex",
    gap: 10,
    background: "#232326",
    borderRadius: 18,
    padding: 12,
    transition: "opacity 200ms",
  },
  notifAvatar: { width: 34, height: 34, borderRadius: "50%", background: "#4a4a4f", flexShrink: 0 },
  notifTitle: { color: "#f2f2f2", fontSize: 12.5, fontWeight: 600, marginBottom: 3 },
  notifBody: { color: "#9a9a9e", fontSize: 12 },
  front: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(160deg, #6e5bd6 0%, #4636a8 60%, #2c2270 100%)",
    transformOrigin: "top center",
    willChange: "transform",
  },
  dragHandle: {
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "grab",
    touchAction: "none",
  },
  grip: { width: 44, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.55)" },
  appContent: { padding: "10px 22px 22px" },
  appTitle: { color: "#fff", fontSize: 26, fontWeight: 700, margin: "18px 0 8px" },
  appHint: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    lineHeight: 1.5,
    marginBottom: 24,
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 },
  appIcon: { aspectRatio: "1", borderRadius: 16, background: "rgba(255,255,255,0.18)" },
  hint: {
    position: "absolute",
    bottom: 14,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(255,255,255,0.12)",
    border: "none",
    color: "#fff",
    borderRadius: "50%",
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
};