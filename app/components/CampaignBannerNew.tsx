// "use client";

// import { useEffect, useState, useRef } from "react";
// import { supabase } from "../admin/lib/supabase";
// import { Campaign } from "../lib/types";

// // Paleta fija en hex para que html2canvas no falle con oklch/lab
// const C = {
//   pink:       "#f48fb8",
//   cream:      "#fdf6e3",
//   yellow:     "#f6e27a",
//   lilac:      "#d8b4e2",
//   blue:       "#add8f0",
//   skyBlue:    "#87ceeb",
//   pinkDot:    "#f4a0c0",
//   gray900:    "#111827",
//   gray700:    "#374151",
//   gray500:    "#6b7280",
//   gray400:    "#9ca3af",
//   white:      "#ffffff",
// };

// export default function CampaignBanner() {
//   const [campaign, setCampaign] = useState<Campaign | null>(null);
//   const [capturing, setCapturing] = useState(false);
//   const bannerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     supabase
//       .from("campaigns")
//       .select("*")
//       .eq("is_active", true)
//       .single()
//       .then(({ data }) => setCampaign(data));
//   }, []);

//   const captureImage = async (): Promise<HTMLCanvasElement | null> => {
//     if (!bannerRef.current) return null;
//     const html2canvas = (await import("html2canvas")).default;
//     return html2canvas(bannerRef.current, {
//       useCORS: true,
//       allowTaint: false,
//       backgroundColor: C.pink,
//       scale: 2,
//       logging: false,
//     });
//   };

//   const downloadBlob = (canvas: HTMLCanvasElement) => {
//     canvas.toBlob((blob) => {
//       if (!blob) return;
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "campana-michis.png";
//       a.click();
//       URL.revokeObjectURL(url);
//     }, "image/png");
//   };

//   const handleDownload = async () => {
//     setCapturing(true);
//     try {
//       const canvas = await captureImage();
//       if (canvas) downloadBlob(canvas);
//     } catch (err) {
//       console.error("Error al descargar:", err);
//     } finally {
//       setCapturing(false);
//     }
//   };

//   const handleShare = async () => {
//     setCapturing(true);
//     try {
//       const canvas = await captureImage();
//       if (canvas) downloadBlob(canvas);
//       const pageUrl = encodeURIComponent(window.location.href);
//       window.open(
//         `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
//         "_blank",
//         "width=600,height=400"
//       );
//     } catch (err) {
//       console.error("Error al compartir:", err);
//     } finally {
//       setCapturing(false);
//     }
//   };

//   if (!campaign) return null;

//   // Círculos decorativos reutilizables
//   const Dots = ({ colors }: { colors: string[] }) => (
//     <span style={{ display: "flex", gap: 4 }}>
//       {colors.map((bg, i) => (
//         <span key={i} style={{
//           width: 14, height: 14, borderRadius: "50%",
//           background: bg, border: `2px solid ${C.gray400}`,
//           display: "inline-block",
//         }} />
//       ))}
//     </span>
//   );

//   // Celda del grid
//   const Cell = ({
//     label, value, headerBg, dots, borderRight, borderLeft, borderBottom, borderTop,
//   }: {
//     label: string; value?: string | null; headerBg: string;
//     dots: string[]; borderRight?: boolean; borderLeft?: boolean;
//     borderBottom?: boolean; borderTop?: boolean;
//   }) => (
//     <div style={{
//       background: C.cream,
//       borderRight:  borderRight  ? `2px solid ${C.pink}` : undefined,
//       borderLeft:   borderLeft   ? `2px solid ${C.pink}` : undefined,
//       borderBottom: borderBottom ? `4px solid ${C.pink}` : undefined,
//       borderTop:    borderTop    ? `2px solid ${C.pink}` : undefined,
//     }}>
//       {/* barra título */}
//       <div style={{
//         background: headerBg,
//         borderBottom: `2px solid ${C.pink}`,
//         padding: "6px 16px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//       }}>
//         <span style={{ fontSize: 13, fontWeight: 700, color: C.gray700 }}>{label}</span>
//         <Dots colors={dots} />
//       </div>
//       {/* contenido */}
//       <div style={{ padding: "16px" }}>
//         <p style={{
//           fontSize: 22, fontWeight: 900, color: C.gray900,
//           whiteSpace: "pre-line", lineHeight: 1.3, margin: 0,
//         }}>
//           {value}
//         </p>
//       </div>
//     </div>
//   );

//   return (
//     <section style={{ background: C.pink, padding: "40px 16px" }}>
//       <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

//         {/* ── Banner captuable — solo inline styles aquí ───────── */}
//         <div ref={bannerRef} style={{ width: "100%" }}>

//           {/* Header */}
//           <div style={{
//             background: C.cream,
//             border: `4px solid ${C.pink}`,
//             borderBottom: "none",
//             borderRadius: "12px 12px 0 0",
//             padding: "20px 24px",
//             display: "flex",
//             alignItems: "flex-start",
//             gap: 16,
//           }}>
//             {/* Logos patrocinadores */}
//             {campaign.sponsor_logos && campaign.sponsor_logos.length > 0 && (
//               <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
//                 {campaign.sponsor_logos.map((url, i) => (
//                   <img key={i} src={url} alt={`patrocinador ${i + 1}`}
//                     style={{ height: 56, width: "auto", objectFit: "contain" }}
//                     crossOrigin="anonymous" />
//                 ))}
//               </div>
//             )}

//             {/* Título */}
//             <div style={{ flex: 1, textAlign: "center" }}>
//               <h2 style={{ fontSize: 28, fontWeight: 900, color: C.gray900, lineHeight: 1.2, margin: 0 }}>
//                 {campaign.title}
//               </h2>
//               {campaign.subtitle && (
//                 <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.gray500, marginTop: 4, fontWeight: 600 }}>
//                   {campaign.subtitle}
//                 </p>
//               )}
//               {campaign.month && (
//                 <>
//                   <div style={{ borderTop: `2px solid ${C.gray400}`, width: 160, margin: "12px auto" }} />
//                   <p style={{ fontSize: 20, fontWeight: 700, color: C.gray900, margin: 0 }}>{campaign.month}</p>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Grid 2×2 */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderLeft: `4px solid ${C.pink}`, borderRight: `4px solid ${C.pink}` }}>
//             <Cell label="Fecha"               value={campaign.date_label} headerBg={C.yellow} dots={[C.yellow, C.skyBlue, C.white]}  borderRight borderBottom />
//             <Cell label="Lugar"               value={campaign.place}      headerBg={C.lilac}  dots={[C.yellow, C.pinkDot, C.white]} borderLeft  borderBottom />
//             <Cell label="Cuota de recuperación" value={campaign.price}    headerBg={C.blue}   dots={[C.yellow, C.yellow, C.yellow]} borderRight borderTop />
//             <Cell label="Citas e informes"    value={campaign.contact}    headerBg={C.yellow} dots={[C.yellow, C.pinkDot, C.white]} borderLeft  borderTop />
//           </div>

//           {/* Nota al pie */}
//           {campaign.notes && (
//             <div style={{
//               background: C.pink,
//               border: `4px solid ${C.pink}`,
//               borderTop: "none",
//               borderRadius: "0 0 12px 12px",
//               padding: "12px 24px",
//               textAlign: "center",
//             }}>
//               <p style={{ fontSize: 13, fontWeight: 900, color: C.gray900, margin: 0 }}>
//                 {campaign.notes}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* ── Botones (fuera del ref, no se capturan) ───────────── */}
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
//           <button
//             onClick={handleDownload}
//             disabled={capturing}
//             className="flex items-center gap-2 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-800 font-semibold text-sm px-5 py-2.5 rounded-xl border-2 border-white shadow transition hover:scale-105 active:scale-95"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
//             </svg>
//             {capturing ? "Generando..." : "Descargar imagen"}
//           </button>

//           <button
//             onClick={handleShare}
//             disabled={capturing}
//             className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow transition hover:scale-105 active:scale-95"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
//             </svg>
//             {capturing ? "Generando..." : "Compartir en Facebook"}
//           </button>
//         </div>

//         <p className="text-xs text-center max-w-xs" style={{ color: "#9b3a5e" }}>
//           💡 La imagen se descargará en tu dispositivo. Súbela manualmente a Facebook para mejor calidad.
//         </p>
//       </div>
//     </section>
//   );
// }
