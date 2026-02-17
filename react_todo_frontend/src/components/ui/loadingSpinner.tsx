export default function LoadingSpinner() {
  return (
    <div 
      style={{
           inset: 0,  
           position: "fixed",
           display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            zIndex: 9999,
        }}
        >
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #e5e5e5',
        borderTop: '3px solid #7973e6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p>読み込み中…</p>
    </div>
  );
}


