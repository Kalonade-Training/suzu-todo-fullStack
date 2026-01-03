export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        backgroundColor: "rgba(255,255,255,0.8)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: "4px solid #e5e5e5",
          borderTop: "4px solid #7973e6",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p>読み込み中…</p>
    </div>
  );
}
