import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, Car, Video, Bot, Factory, Zap, Layers, Scan,
  Cpu, Check, Database, Code, Eye, Target,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";

/* ───────── Design tokens ───────── */
const C = {
  ink: "#14213D", blue: "#2B50E6", mute: "#5B6478", line: "#D9DEE8", paper: "#F7F8FA",
  pink: "#D6336C", teal: "#0E9F8E", amber: "#D98E04", violet: "#7C5CFA", grey: "#94A3B8",
};
const CLS = { voiture: C.blue, personne: C.pink, chien: C.teal, feu: C.amber, banc: C.violet };
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const iou = (a, b) => {
  const x1 = Math.max(a.x, b.x), y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w), y2 = Math.min(a.y + a.h, b.y + b.h);
  const i = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  return i / (a.w * a.h + b.w * b.h - i || 1);
};

/* ───────── Small building blocks ───────── */
const Card = ({ children, className = "", style }) => (
  <div className={"bg-white border rounded-lg p-4 " + className} style={{ borderColor: C.line, ...style }}>{children}</div>
);
const Head = ({ title, sub }) => (
  <div className="mb-5">
    <h2 className="text-3xl font-bold tracking-tight" style={{ color: C.ink }}>{title}</h2>
    {sub && <p className="mt-1 text-base" style={{ color: C.mute }}>{sub}</p>}
  </div>
);
const Tag = ({ children, color = C.blue }) => (
  <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded" style={{ background: color + "1A", color }}>{children}</span>
);
const Slider = ({ label, value, min, max, step, onChange, fmt }) => (
  <label className="block text-sm mb-2" style={{ color: C.ink }}>
    <div className="flex justify-between"><span>{label}</span><b style={{ fontFamily: MONO }}>{fmt ? fmt(value) : value}</b></div>
    <input type="range" className="w-full" style={{ accentColor: C.blue }} min={min} max={max} step={step}
      value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
  </label>
);
const Code_ = ({ lines }) => (
  <pre className="rounded-lg p-4 text-sm overflow-x-auto leading-relaxed" style={{ background: C.ink, color: "#E6EBF7", fontFamily: MONO }}>{lines.join("\n")}</pre>
);

const Box = ({ b, color, label, dashed, op = 1, w = 2.5 }) => {
  const lw = label ? label.length * 7.4 + 10 : 0;
  const ty = b.y < 22 ? b.y : b.y - 20;
  return (
    <g opacity={op}>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={color + "14"} stroke={color} strokeWidth={w} strokeDasharray={dashed ? "6 4" : undefined} rx="3" />
      {label && (<>
        <rect x={b.x} y={ty} width={lw} height="20" fill={color} rx="3" />
        <text x={b.x + 5} y={ty + 14} fontSize="12" fill="#fff" fontWeight="600">{label}</text>
      </>)}
    </g>
  );
};

/* ───────── Slide 2: classification / détection / segmentation ───────── */
const Scene = ({ mode }) => {
  const cat = { x: 33, y: 46, w: 88, h: 70 }, ball = { x: 142, y: 82, w: 36, h: 36 };
  return (
    <svg viewBox="0 0 200 140" className="w-full rounded-md" style={{ background: "#EEF2FA" }}>
      <rect y="112" width="200" height="28" fill="#D5DCEA" />
      <ellipse cx="70" cy="88" rx="36" ry="26" fill={mode === "seg" ? C.blue : "#E0A15A"} />
      <circle cx="102" cy="66" r="16" fill={mode === "seg" ? C.blue : "#E0A15A"} />
      <polygon points="92,54 96,40 104,52" fill={mode === "seg" ? C.blue : "#E0A15A"} />
      <polygon points="104,52 112,40 116,56" fill={mode === "seg" ? C.blue : "#E0A15A"} />
      <circle cx="160" cy="100" r="18" fill={mode === "seg" ? C.pink : "#E5484D"} />
      {mode === "det" && (<>
        <Box b={cat} color={C.blue} label="chat 0.96" w={1.5} />
        <Box b={ball} color={C.pink} label="balle 0.91" w={1.5} />
      </>)}
    </svg>
  );
};
const S2 = () => {
  const items = [
    { k: "cls", t: "Classification", q: "Quoi ?", d: "Une seule étiquette pour toute l’image.", ex: "« Cette photo contient un chat »", c: C.violet },
    { k: "det", t: "Détection d’objets", q: "Quoi et où ?", d: "Une boîte, une classe et un score par objet.", ex: "« Chat à (33, 46), balle à (142, 82) »", c: C.blue },
    { k: "seg", t: "Segmentation", q: "Quels pixels ?", d: "Chaque pixel est affecté à un objet.", ex: "« Ces 4 200 pixels sont le chat »", c: C.teal },
  ];
  return (
    <>
      <Head title="Le problème : que veut-on savoir d’une image ?" sub="Trois tâches de vision, trois niveaux de précision." />
      <div className="grid grid-cols-3 gap-4">
        {items.map((it) => (
          <Card key={it.k}>
            <div className="relative">
              <Scene mode={it.k} />
              {it.k === "cls" && <div className="absolute bottom-2 left-2 text-xs font-bold text-white px-2 py-1 rounded" style={{ background: C.violet }}>Chat : 0.96</div>}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="font-bold" style={{ color: C.ink }}>{it.t}</h3><Tag color={it.c}>{it.q}</Tag>
            </div>
            <p className="text-sm mt-1" style={{ color: C.mute }}>{it.d}</p>
            <p className="text-sm mt-2 italic" style={{ color: C.ink }}>{it.ex}</p>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-sm" style={{ color: C.mute }}>YOLO traite la <b style={{ color: C.blue }}>détection</b> (et, dans ses versions récentes, aussi la segmentation, la pose et la classification).</p>
    </>
  );
};

/* ───────── Slide 3 ───────── */
const S3 = () => {
  const apps = [
    { i: Car, t: "Voitures autonomes", d: "Piétons, véhicules, panneaux, feux" },
    { i: Video, t: "Vidéosurveillance", d: "Comptage, intrusion, objets abandonnés" },
    { i: Bot, t: "Robotique", d: "Saisie d’objets, navigation, drones" },
    { i: Factory, t: "Industrie", d: "Contrôle qualité, détection de défauts" },
  ];
  return (
    <>
      <Head title="Présentation de YOLO" sub="You Only Look Once : on regarde l’image une seule fois." />
      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-2" style={{ borderLeft: `4px solid ${C.blue}` }}>
          <h3 className="font-bold mb-2" style={{ color: C.ink }}>Définition</h3>
          <p className="text-sm leading-relaxed" style={{ color: C.mute }}>
            YOLO est une famille de réseaux de neurones convolutifs qui détecte tous les objets d’une image <b style={{ color: C.ink }}>en une seule passe</b>, assez vite pour traiter de la vidéo en temps réel.
          </p>
          <div className="mt-4 space-y-2 text-sm" style={{ color: C.ink }}>
            {["Entrée : une image", "Une passe dans le réseau", "Sortie : boîtes + classes + scores"].map((t) => (
              <div key={t} className="flex items-center gap-2"><Check size={16} color={C.teal} />{t}</div>
            ))}
          </div>
        </Card>
        <div className="col-span-3 grid grid-cols-2 gap-4">
          {apps.map(({ i: I, t, d }) => (
            <Card key={t}><I size={26} color={C.blue} /><h4 className="font-bold mt-2" style={{ color: C.ink }}>{t}</h4><p className="text-sm" style={{ color: C.mute }}>{d}</p></Card>
          ))}
        </div>
      </div>
    </>
  );
};

/* ───────── Slide 4 ───────── */
const S4 = () => {
  const [cell, setCell] = useState([3, 2]);
  const N = 6, s = 60;
  return (
    <>
      <Head title="Le principe de détection" sub="Une image, une passe, toutes les prédictions. Cliquez sur une cellule." />
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <svg viewBox="0 0 360 360" className="w-full">
            <rect width="360" height="360" fill="#EEF2FA" />
            <rect x="40" y="170" width="190" height="120" rx="14" fill="#6D86C9" />
            <rect x="80" y="130" width="110" height="50" rx="8" fill="#6D86C9" />
            <circle cx="90" cy="290" r="20" fill="#1f2937" /><circle cx="190" cy="290" r="20" fill="#1f2937" />
            <circle cx="290" cy="130" r="16" fill={C.pink} /><rect x="274" y="148" width="32" height="90" rx="6" fill={C.pink} opacity=".8" />
            {Array.from({ length: N * N }).map((_, k) => {
              const cx = k % N, cy = Math.floor(k / N), on = cx === cell[0] && cy === cell[1];
              return <rect key={k} x={cx * s} y={cy * s} width={s} height={s} fill={on ? C.blue + "40" : "transparent"} stroke={C.blue} strokeOpacity=".35" onClick={() => setCell([cx, cy])} style={{ cursor: "pointer" }} />;
            })}
            <Box b={{ x: 32, y: 124, w: 206, h: 190 }} color={C.blue} label="voiture 0.94" />
            <Box b={{ x: 268, y: 110, w: 46, h: 136 }} color={C.pink} label="personne 0.88" />
          </svg>
        </Card>
        <div className="space-y-3">
          <Card>
            <h4 className="font-bold mb-2" style={{ color: C.ink }}>Cellule ({cell[0]}, {cell[1]}) prédit :</h4>
            <div className="flex gap-1 text-xs text-center" style={{ fontFamily: MONO }}>
              {[["x", C.blue], ["y", C.blue], ["w", C.blue], ["h", C.blue], ["score", C.amber], ["p(voiture)", C.teal], ["p(personne)", C.pink]].map(([t, c]) => (
                <div key={t} className="flex-1 py-3 rounded text-white font-bold" style={{ background: c }}>{t}</div>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: C.mute }}>Boîte (4 nombres) · confiance de présence · probabilité par classe.</p>
          </Card>
          {[["Une seule passe", "Pas de proposition de régions : tout est prédit d’un coup, d’où la vitesse."], ["Plusieurs objets", "Chaque position de la grille peut proposer sa propre détection."], ["Filtrage final", "Les scores faibles et les doublons sont éliminés (seuil, NMS)."]].map(([t, d]) => (
            <Card key={t}><b style={{ color: C.ink }}>{t}</b><p className="text-sm" style={{ color: C.mute }}>{d}</p></Card>
          ))}
        </div>
      </div>
    </>
  );
};

/* ───────── Slide 5 : VISUEL 1 ───────── */
const DET = [
  { c: "voiture", s: 0.94, b: { x: 60, y: 185, w: 220, h: 140 } },
  { c: "personne", s: 0.88, b: { x: 360, y: 128, w: 70, h: 190 } },
  { c: "chien", s: 0.67, b: { x: 465, y: 250, w: 110, h: 75 } },
  { c: "feu", s: 0.52, b: { x: 540, y: 55, w: 42, h: 95 } },
  { c: "banc", s: 0.31, b: { x: 285, y: 325, w: 90, h: 30 } },
  { c: "personne", s: 0.18, b: { x: 8, y: 105, w: 34, h: 95 } },
];
const S5 = () => {
  const [t, setT] = useState(0.25);
  const kept = DET.filter((d) => d.s >= t).length;
  return (
    <>
      <Head title="Visuel : seuil de confiance interactif" sub="Déplacez le curseur : les détections sous le seuil disparaissent." />
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <svg viewBox="0 0 640 400" className="w-full rounded-md">
            <rect width="640" height="400" fill="#EAF0FA" /><rect y="320" width="640" height="80" fill="#CBD3E1" />
            <rect x="18" y="100" width="8" height="220" fill="#8792A8" />
            <ellipse cx="330" cy="342" rx="45" ry="12" fill="#6FAF7B" />
            <rect x="70" y="235" width="200" height="75" rx="12" fill="#6D86C9" /><rect x="110" y="195" width="120" height="45" rx="10" fill="#6D86C9" />
            <circle cx="110" cy="312" r="20" fill="#1f2937" /><circle cx="230" cy="312" r="20" fill="#1f2937" />
            <circle cx="395" cy="150" r="16" fill="#E58AA8" /><rect x="375" y="168" width="40" height="90" rx="8" fill="#E58AA8" />
            <rect x="378" y="258" width="14" height="58" fill="#B8587A" /><rect x="398" y="258" width="14" height="58" fill="#B8587A" />
            <ellipse cx="510" cy="290" rx="40" ry="20" fill="#C08A5B" /><circle cx="555" cy="275" r="14" fill="#C08A5B" />
            <rect x="480" y="300" width="8" height="22" fill="#9A6B40" /><rect x="525" y="300" width="8" height="22" fill="#9A6B40" />
            <rect x="558" y="140" width="6" height="180" fill="#444" /><rect x="548" y="62" width="26" height="80" rx="5" fill="#333" />
            <circle cx="561" cy="78" r="7" fill="#E5484D" /><circle cx="561" cy="102" r="7" fill="#E8A317" /><circle cx="561" cy="126" r="7" fill="#3FB950" />
            {DET.map((d, i) => d.s >= t && <Box key={i} b={d.b} color={CLS[d.c]} label={`${d.c} ${d.s.toFixed(2)}`} />)}
          </svg>
          <p className="text-xs mt-2" style={{ color: C.mute }}>⚠ Données fictives : aucune inférence réelle n’est exécutée. Les deux dernières détections simulent des faux positifs.</p>
        </Card>
        <div className="space-y-3">
          <Card>
            <Slider label="Seuil de confiance" value={t} min={0.05} max={0.95} step={0.01} onChange={setT} fmt={(v) => v.toFixed(2)} />
            <div className="text-2xl font-bold" style={{ color: C.blue }}>{kept} / {DET.length} <span className="text-sm font-normal" style={{ color: C.mute }}>conservées</span></div>
          </Card>
          <Card className="space-y-1">
            {DET.map((d, i) => (
              <div key={i} className="flex justify-between text-sm" style={{ opacity: d.s >= t ? 1 : 0.35, fontFamily: MONO }}>
                <span style={{ color: CLS[d.c] }}>● {d.c}</span><span>{d.s.toFixed(2)} {d.s >= t ? "✓" : "✗"}</span>
              </div>
            ))}
          </Card>
          <p className="text-xs" style={{ color: C.mute }}>Seuil bas : plus de rappel, plus de faux positifs. Seuil haut : plus de précision, objets manqués.</p>
        </div>
      </div>
    </>
  );
};

/* ───────── Slide 6 : éléments + IoU ───────── */
const S6 = () => {
  const [dx, setDx] = useState(40), [dy, setDy] = useState(25);
  const A = { x: 60, y: 50, w: 120, h: 100 }, B = { x: 60 + dx, y: 50 + dy, w: 120, h: 100 };
  const x1 = Math.max(A.x, B.x), y1 = Math.max(A.y, B.y);
  const x2 = Math.min(A.x + A.w, B.x + B.w), y2 = Math.min(A.y + A.h, B.y + B.h);
  const v = iou(A, B);
  return (
    <>
      <Head title="Les éléments d’une détection" sub="Boîte, classe, score… et IoU pour mesurer le recouvrement." />
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-3 content-start">
          {[["Bounding box", "(x, y, w, h) : position et taille du rectangle.", C.blue], ["Classe prédite", "L’étiquette la plus probable : « voiture ».", C.teal], ["Confidence score", "Probabilité estimée entre 0 et 1.", C.amber], ["IoU", "Aire d’intersection ÷ aire d’union.", C.pink]].map(([t, d, c]) => (
            <Card key={t} style={{ borderTop: `3px solid ${c}` }}><b style={{ color: C.ink }}>{t}</b><p className="text-sm mt-1" style={{ color: C.mute }}>{d}</p></Card>
          ))}
          <Card className="col-span-2 text-sm" style={{ fontFamily: MONO, color: C.ink }}>
            IoU = aire(A ∩ B) / aire(A ∪ B)<br />0 = aucun recouvrement · 1 = boîtes identiques
          </Card>
        </div>
        <Card>
          <svg viewBox="0 0 300 220" className="w-full">
            <rect width="300" height="220" fill="#F1F4FA" />
            <rect x={A.x} y={A.y} width={A.w} height={A.h} fill={C.teal + "22"} stroke={C.teal} strokeWidth="2.5" />
            <rect x={B.x} y={B.y} width={B.w} height={B.h} fill={C.pink + "22"} stroke={C.pink} strokeWidth="2.5" />
            {x2 > x1 && y2 > y1 && <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill={C.blue} opacity=".45" />}
            <text x="64" y="44" fontSize="12" fill={C.teal} fontWeight="700">Vérité terrain</text>
            <text x={B.x + 4} y={B.y + B.h + 15} fontSize="12" fill={C.pink} fontWeight="700">Prédiction</text>
          </svg>
          <Slider label="Décalage horizontal" value={dx} min={-100} max={100} step={1} onChange={setDx} />
          <Slider label="Décalage vertical" value={dy} min={-80} max={80} step={1} onChange={setDy} />
          <div className="text-2xl font-bold" style={{ color: v >= 0.5 ? C.teal : C.pink }}>IoU = {v.toFixed(2)} <span className="text-sm font-normal" style={{ color: C.mute }}>{v >= 0.5 ? "≥ 0.5 : détection correcte" : "< 0.5 : insuffisant"}</span></div>
        </Card>
      </div>
    </>
  );
};

/* ───────── Slide 7 : NMS ───────── */
const NMSB = [
  { c: "voiture", s: 0.92, x: 90, y: 70, w: 200, h: 120 }, { c: "voiture", s: 0.85, x: 100, y: 78, w: 196, h: 118 },
  { c: "voiture", s: 0.78, x: 80, y: 62, w: 210, h: 128 }, { c: "voiture", s: 0.55, x: 135, y: 90, w: 200, h: 120 },
  { c: "voiture", s: 0.3, x: 30, y: 40, w: 120, h: 90 }, { c: "personne", s: 0.88, x: 320, y: 50, w: 56, h: 150 },
];
const S7 = () => {
  const [thr, setThr] = useState(0.5);
  const res = useMemo(() => {
    const sorted = NMSB.map((b, i) => ({ ...b, i })).sort((a, b) => b.s - a.s), kept = [];
    const out = {};
    sorted.forEach((b) => {
      const hit = kept.find((k) => k.c === b.c && iou(k, b) > thr);
      out[b.i] = hit ? { keep: false, by: hit.s, v: iou(hit, b) } : { keep: true };
      if (!hit) kept.push(b);
    });
    return out;
  }, [thr]);
  const nk = Object.values(res).filter((r) => r.keep).length;
  return (
    <>
      <Head title="La NMS : Non-Maximum Suppression" sub="Une même cible reçoit plusieurs boîtes. On garde la meilleure, on écarte ses doublons." />
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <svg viewBox="0 0 400 240" className="w-full rounded-md" style={{ background: "#EEF2FA" }}>
            <rect x="100" y="95" width="180" height="90" rx="12" fill="#6D86C9" opacity=".6" /><rect x="328" y="62" width="40" height="130" rx="8" fill="#E58AA8" opacity=".7" />
            {NMSB.map((b, i) => <Box key={i} b={b} color={CLS[b.c]} dashed={!res[i].keep} op={res[i].keep ? 1 : 0.4} label={res[i].keep ? b.s.toFixed(2) : undefined} w={res[i].keep ? 3 : 1.5} />)}
          </svg>
          <p className="text-xs mt-2" style={{ color: C.mute }}>Trait plein : conservée. Pointillé : supprimée. La NMS compare seulement les boîtes de même classe. Boîtes fictives.</p>
        </Card>
        <div className="space-y-3">
          <Card><Slider label="Seuil d’IoU" value={thr} min={0.1} max={0.9} step={0.05} onChange={setThr} fmt={(v) => v.toFixed(2)} />
            <div className="text-2xl font-bold" style={{ color: C.blue }}>{nk} / {NMSB.length} <span className="text-sm font-normal" style={{ color: C.mute }}>gardées</span></div></Card>
          <Card className="text-sm space-y-1" style={{ color: C.mute }}>
            {["1. Trier les boîtes par score", "2. Garder la meilleure", "3. Supprimer celles qui la recoupent (IoU > seuil)", "4. Répéter avec les boîtes restantes"].map((t) => <div key={t}>{t}</div>)}
          </Card>
          <p className="text-xs" style={{ color: C.mute }}>Seuil trop bas : deux objets proches risquent d’être fusionnés. Trop haut : des doublons survivent.</p>
        </div>
      </div>
    </>
  );
};

/* ───────── Slide 8 : architecture ───────── */
const S8 = () => {
  const blocks = [["Image", "640×640×3", 20, C.grey], ["Backbone", "Extraire", 200, C.blue], ["Neck", "Fusionner", 420, C.teal], ["Head", "Prédire", 640, C.pink]];
  return (
    <>
      <Head title="L’architecture générale de YOLO" sub="Trois étages : le Backbone voit, le Neck combine, le Head décide." />
      <Card>
        <svg viewBox="0 0 900 230" className="w-full">
          <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={C.mute} /></marker></defs>
          {blocks.map(([t, d, x, c], i) => (
            <g key={t}>
              <rect x={x} y="60" width="150" height="100" rx="10" fill={c} />
              <text x={x + 75} y="105" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">{t}</text>
              <text x={x + 75} y="132" textAnchor="middle" fontSize="13" fill="#fff" opacity=".9">{d}</text>
              {i < 3 && <line x1={x + 152} y1="110" x2={x + 196} y2="110" stroke={C.mute} strokeWidth="2" markerEnd="url(#ar)" />}
            </g>
          ))}
          {[78, 110, 142].map((y, i) => <line key={y} x1={352} y1={y} x2={418} y2={y} stroke={C.ink} strokeWidth="1.5" strokeDasharray="4 3" />)}
          {[78, 110, 142].map((y) => <line key={y + "b"} x1={572} y1={y} x2={638} y2={y} stroke={C.ink} strokeWidth="1.5" strokeDasharray="4 3" />)}
          <text x="385" y="50" textAnchor="middle" fontSize="12" fill={C.mute}>P3 · P4 · P5</text>
          <text x="605" y="50" textAnchor="middle" fontSize="12" fill={C.mute}>3 échelles</text>
          <rect x="810" y="75" width="80" height="70" rx="8" fill="none" stroke={C.ink} strokeWidth="2" />
          <text x="850" y="105" textAnchor="middle" fontSize="12" fill={C.ink}>boîtes</text><text x="850" y="122" textAnchor="middle" fontSize="12" fill={C.ink}>classes · scores</text>
          <line x1="792" y1="110" x2="808" y2="110" stroke={C.mute} strokeWidth="2" markerEnd="url(#ar)" />
        </svg>
      </Card>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[["Backbone", "Réseau convolutif qui transforme les pixels en caractéristiques visuelles.", C.blue], ["Neck", "Mélange les caractéristiques fines et profondes de plusieurs échelles.", C.teal], ["Head", "Produit les boîtes, les classes et les scores pour chaque échelle.", C.pink]].map(([t, d, c]) => (
          <Card key={t} style={{ borderTop: `3px solid ${c}` }}><b style={{ color: c }}>{t}</b><p className="text-sm mt-1" style={{ color: C.mute }}>{d}</p></Card>
        ))}
      </div>
    </>
  );
};

/* ───────── Slide 9 : backbone ───────── */
const S9 = () => {
  const [k, setK] = useState(0);
  const st = [
    { t: "Contours", r: "160×160", ch: "peu de canaux", d: "Lignes, bords, changements de contraste.", f: <g stroke={C.blue} strokeWidth="3"><line x1="10" y1="60" x2="70" y2="10" /><line x1="30" y1="70" x2="70" y2="40" /><line x1="10" y1="30" x2="40" y2="10" /></g>, z: 120 },
    { t: "Textures", r: "80×80", ch: "plus de canaux", d: "Motifs répétés : grain, tôle, pelage.", f: <g fill={C.teal}>{[15, 35, 55].map((x) => [15, 35, 55].map((y) => <circle key={x + "" + y} cx={x} cy={y} r="4" />))}</g>, z: 95 },
    { t: "Parties", r: "40×40", ch: "beaucoup", d: "Roues, phares, visages, roues.", f: <g fill="none" stroke={C.amber} strokeWidth="4"><circle cx="22" cy="40" r="14" /><circle cx="56" cy="40" r="14" /></g>, z: 70 },
    { t: "Objets", r: "20×20", ch: "très nombreux", d: "Sens global : voiture, personne.", f: <g><rect x="8" y="22" width="60" height="30" rx="6" fill={C.pink} /><rect x="18" y="10" width="36" height="16" rx="4" fill={C.pink} /></g>, z: 45 },
  ];
  return (
    <>
      <Head title="Le Backbone" sub="Plus on avance, plus la résolution baisse et plus le sens augmente. Cliquez sur un niveau." />
      <div className="grid grid-cols-4 gap-3">
        {st.map((s, i) => (
          <button key={s.t} onClick={() => setK(i)} className="text-left">
            <Card style={{ borderColor: k === i ? C.blue : C.line, borderWidth: k === i ? 2 : 1 }}>
              <div className="flex items-center justify-center h-32">
                <div className="flex items-center justify-center rounded" style={{ width: s.z, height: s.z, background: C.blue + "12", border: `1px solid ${C.blue}` }}>
                  <svg viewBox="0 0 80 80" width={s.z * 0.7} height={s.z * 0.7}>{s.f}</svg>
                </div>
              </div>
              <b style={{ color: C.ink }}>{s.t}</b>
              <div className="text-xs mt-1" style={{ color: C.mute, fontFamily: MONO }}>{s.r}</div>
            </Card>
          </button>
        ))}
      </div>
      <Card className="mt-4" style={{ borderLeft: `4px solid ${C.blue}` }}>
        <b style={{ color: C.ink }}>{st[k].t}</b> : {st[k].d} <span className="text-sm" style={{ color: C.mute }}>Canaux : {st[k].ch}.</span>
      </Card>
      <p className="text-xs mt-3" style={{ color: C.mute }}>Tailles indicatives pour une entrée 640×640. Les sorties des niveaux P3, P4 et P5 (strides 8, 16, 32) sont transmises au Neck. Dans YOLOv8, le Backbone s’appuie sur des blocs C2f ; YOLO11 utilise C3k2.</p>
    </>
  );
};

/* ───────── Slide 10 : neck & head ───────── */
const S10 = () => {
  const lv = [["P5", "20×20", "grands objets", 60], ["P4", "40×40", "objets moyens", 130], ["P3", "80×80", "petits objets", 200]];
  return (
    <>
      <Head title="Le Neck et le Head" sub="Le Neck fusionne les échelles, le Head prédit sur chacune." />
      <div className="grid grid-cols-5 gap-4">
        <Card className="col-span-3">
          <b style={{ color: C.teal }}>Neck : fusion multi-échelles (type FPN + PAN)</b>
          <svg viewBox="0 0 500 270" className="w-full mt-2">
            <defs><marker id="a2" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill={C.mute} /></marker></defs>
            {lv.map(([n, r, o, y]) => (
              <g key={n}>
                <rect x="40" y={y - 22} width="110" height="44" rx="6" fill={C.blue} opacity=".85" /><text x="95" y={y + 5} textAnchor="middle" fill="#fff" fontWeight="700" fontSize="14">{n} · {r}</text>
                <rect x="230" y={y - 22} width="110" height="44" rx="6" fill={C.teal} /><text x="285" y={y + 5} textAnchor="middle" fill="#fff" fontWeight="700" fontSize="14">{n} fusionné</text>
                <rect x="410" y={y - 22} width="80" height="44" rx="6" fill={C.pink} /><text x="450" y={y + 5} textAnchor="middle" fill="#fff" fontWeight="700" fontSize="13">Head</text>
                <line x1="152" y1={y} x2="228" y2={y} stroke={C.mute} strokeWidth="1.5" markerEnd="url(#a2)" /><line x1="342" y1={y} x2="408" y2={y} stroke={C.mute} strokeWidth="1.5" markerEnd="url(#a2)" />
                <text x="95" y={y + 38} textAnchor="middle" fontSize="11" fill={C.mute}>{o}</text>
              </g>
            ))}
            <line x1="270" y1="82" x2="270" y2="108" stroke={C.ink} strokeWidth="1.5" markerEnd="url(#a2)" /><line x1="270" y1="152" x2="270" y2="178" stroke={C.ink} strokeWidth="1.5" markerEnd="url(#a2)" />
            <line x1="305" y1="178" x2="305" y2="152" stroke={C.ink} strokeWidth="1.5" markerEnd="url(#a2)" /><line x1="305" y1="108" x2="305" y2="82" stroke={C.ink} strokeWidth="1.5" markerEnd="url(#a2)" />
            <text x="250" y="250" fontSize="11" fill={C.mute}>flèches : descente du sens (haut→bas), remontée des détails</text>
          </svg>
        </Card>
        <div className="col-span-2 space-y-3">
          <Card style={{ borderTop: `3px solid ${C.pink}` }}>
            <b style={{ color: C.pink }}>Head : trois sorties par position</b>
            <div className="mt-2 space-y-2 text-sm" style={{ color: C.ink }}>
              <div className="flex items-center gap-2"><Tag color={C.blue}>Boîte</Tag>x, y, w, h</div>
              <div className="flex items-center gap-2"><Tag color={C.teal}>Classe</Tag>probabilité par classe</div>
              <div className="flex items-center gap-2"><Tag color={C.amber}>Score</Tag>confiance de la détection</div>
            </div>
          </Card>
          <Card className="text-sm" style={{ color: C.mute }}>YOLOv8 et YOLO11 utilisent un Head « découplé » (boîtes et classes dans deux branches) et sans ancres. Le résultat passe ensuite par le seuil de confiance et la NMS.</Card>
        </div>
      </div>
    </>
  );
};

/* ───────── Slide 11 : versions ───────── */
const S11 = () => {
  const v = [
    ["YOLOv1", "2015", "Grille S×S, une seule passe : l’idée fondatrice."],
    ["YOLOv2", "2016", "Ancres, batch normalization, Darknet-19."],
    ["YOLOv3", "2018", "Darknet-53, prédictions à 3 échelles."],
    ["YOLOv4", "2020", "CSPDarknet53, augmentation mosaic."],
    ["YOLOv5", "2020", "Version Ultralytics en PyTorch, facile à utiliser."],
    ["YOLOv8", "2023", "Sans ancres, Head découplé, API Ultralytics unifiée."],
    ["YOLO11", "2024", "Blocs C3k2 et C2PSA, plus léger à précision égale."],
  ];
  return (
    <>
      <Head title="Les versions de YOLO" sub="Même idée de départ, des architectures de plus en plus efficaces." />
      <div className="relative">
        <div className="absolute left-0 right-0 h-0.5" style={{ top: 11, background: C.line }} />
        <div className="grid grid-cols-7 gap-2 relative">
          {v.map(([n, y, d], i) => (
            <div key={n}>
              <div className="w-6 h-6 rounded-full mb-2 border-4 bg-white" style={{ borderColor: i >= 5 ? C.blue : C.grey }} />
              <Card className="p-3" style={{ borderTop: `3px solid ${i >= 5 ? C.blue : C.grey}` }}>
                <b style={{ color: C.ink }}>{n}</b><div className="text-xs" style={{ color: C.mute }}>{y}</div>
                <p className="text-xs mt-2" style={{ color: C.mute }}>{d}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <Card className="mt-5 text-sm" style={{ color: C.mute }}>
        <b style={{ color: C.ink }}>À retenir :</b> YOLOv8 et YOLO11 couvrent plusieurs tâches avec la même API : détection, segmentation, pose, classification et boîtes orientées (OBB). Des variantes d’autres équipes existent (v6, v7, v9, v10…), non détaillées ici.
      </Card>
    </>
  );
};

/* ───────── Slide 12 : GRAPHIQUE 2 ───────── */
const SIZES = ["n", "s", "m", "l", "x"];
const M = {
  map: { t: "mAP50-95 (%, plus haut = mieux)", v8: [37.3, 44.9, 50.2, 52.9, 53.9], v11: [39.5, 47.0, 51.5, 53.4, 54.7] },
  params: { t: "Paramètres (millions, plus bas = plus léger)", v8: [3.2, 11.2, 25.9, 43.7, 68.2], v11: [2.6, 9.4, 20.1, 25.3, 56.9] },
  cpu: { t: "Latence CPU ONNX (ms, plus bas = plus rapide)", v8: [80.4, 128.4, 234.7, 375.2, 479.1], v11: [56.1, 90.0, 183.2, 238.6, 462.8] },
};
const S12 = () => {
  const [m, setM] = useState("map");
  const data = SIZES.map((s, i) => ({ taille: s, YOLOv8: M[m].v8[i], YOLO11: M[m].v11[i] }));
  return (
    <>
      <Head title="YOLOv8 vs YOLO11" sub="Détection sur COCO, tailles n / s / m / l / x." />
      <div className="flex gap-2 mb-3">
        {[["map", "Précision"], ["params", "Taille"], ["cpu", "Vitesse CPU"]].map(([k, l]) => (
          <button key={k} onClick={() => setM(k)} className="px-3 py-1.5 rounded text-sm font-semibold border"
            style={{ background: m === k ? C.blue : "#fff", color: m === k ? "#fff" : C.ink, borderColor: m === k ? C.blue : C.line }}>{l}</button>
        ))}
      </div>
      <Card>
        <div className="text-sm font-semibold mb-2" style={{ color: C.ink }}>{M[m].t}</div>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} />
              <XAxis dataKey="taille" tickFormatter={(s) => "…" + s} /><YAxis domain={m === "map" ? [30, 60] : [0, "auto"]} />
              <Tooltip /><Legend />
              <Bar dataKey="YOLOv8" fill={C.grey} radius={[3, 3, 0, 0]} /><Bar dataKey="YOLO11" fill={C.blue} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <p className="text-xs mt-2" style={{ color: C.mute }}>
        Conditions : valeurs publiées dans la documentation Ultralytics (COCO val2017, image 640 px, latence mesurée sur CPU avec ONNX). Elles dépendent du matériel et peuvent être mises à jour : à vérifier sur docs.ultralytics.com avant toute citation. Ce sont des résultats de détection, pas de segmentation.
      </p>
    </>
  );
};

/* ───────── Slide 13 : Ultralytics ───────── */
const TABS = {
  "Prédire": { l: ["from ultralytics import YOLO", "", "model = YOLO(\"yolo11n.pt\")  # modèle préentraîné", "", "results = model.predict(", "    source=\"image.jpg\",", "    conf=0.25,   # seuil de confiance", "    save=True    # enregistre l’image annotée", ")"], n: "yolo11n.pt est téléchargé automatiquement au premier appel. conf règle le seuil vu en slide 5." },
  "Entraîner": { l: ["model = YOLO(\"yolo11n.pt\")  # point de départ", "", "model.train(", "    data=\"data.yaml\",", "    epochs=50,", "    imgsz=640", ")", "", "model.val()  # évaluer sur le jeu de validation"], n: "epochs : passages sur le dataset. imgsz : taille d’entrée. On peut aussi régler batch, lr0 ou patience." },
  "data.yaml": { l: ["path: datasets/mon_dataset", "train: images/train", "val: images/val", "test: images/test   # optionnel", "", "names:", "  0: voiture", "  1: personne"], n: "Ce fichier indique où sont les images et la liste des classes. Les indices doivent correspondre aux annotations." },
  "Annotations": { l: ["# labels/train/img001.txt : un objet par ligne", "# classe  x_centre  y_centre  largeur  hauteur", "0 0.52 0.48 0.30 0.22", "1 0.80 0.55 0.08 0.30"], n: "Format YOLO : un fichier .txt par image, même nom que l’image. Coordonnées normalisées entre 0 et 1." },
};
const S13 = () => {
  const [tab, setTab] = useState("Prédire");
  return (
    <>
      <Head title="Utilisation avec Ultralytics" sub="Charger, prédire, puis entraîner sur vos propres données." />
      <div className="flex gap-2 mb-3">
        {Object.keys(TABS).map((k) => (
          <button key={k} onClick={() => setTab(k)} className="px-3 py-1.5 rounded text-sm font-semibold border"
            style={{ background: tab === k ? C.blue : "#fff", color: tab === k ? "#fff" : C.ink, borderColor: tab === k ? C.blue : C.line }}>{k}</button>
        ))}
      </div>
      <Code_ lines={TABS[tab].l} />
      <Card className="mt-3 text-sm" style={{ color: C.mute, borderLeft: `4px solid ${C.blue}` }}>{TABS[tab].n}</Card>
    </>
  );
};

/* ───────── Slide 14 ───────── */
const S14 = () => (
  <>
    <Head title="Conclusion et bonnes pratiques" sub="Ce qu’il faut retenir pour utiliser YOLO sérieusement." />
    <div className="grid grid-cols-3 gap-4">
      {[
        [Zap, "Fonctionnement", "Une passe produit boîtes, classes et scores ; la NMS retire les doublons.", C.blue],
        [Layers, "Architecture", "Backbone extrait, Neck fusionne les échelles, Head prédit.", C.teal],
        [Target, "Seuil de confiance", "Choisir selon le coût d’une erreur : faux positifs ou objets manqués.", C.amber],
        [Database, "Annotations", "Des boîtes précises et des classes cohérentes valent plus qu’un modèle plus gros.", C.pink],
        [Eye, "Évaluation", "Mesurer (mAP, rappel, précision) sur des données jamais vues à l’entraînement.", C.violet],
        [Cpu, "Choix du modèle", "Commencer par une petite taille (n ou s), puis monter si la précision manque.", C.blue],
      ].map(([I, t, d, c]) => (
        <Card key={t} style={{ borderTop: `3px solid ${c}` }}><I size={24} color={c} /><h4 className="font-bold mt-2" style={{ color: C.ink }}>{t}</h4><p className="text-sm mt-1" style={{ color: C.mute }}>{d}</p></Card>
      ))}
    </div>
  </>
);

/* ───────── Slide 1 ───────── */
const S1 = () => (
  <div className="grid grid-cols-2 gap-8 items-center min-h-full">
    <div>
      <div className="text-7xl font-black tracking-tighter" style={{ color: C.blue }}>YOLO</div>
      <h1 className="text-3xl font-bold tracking-tight mt-2" style={{ color: C.ink }}>Détection d’objets en temps réel</h1>
      <p className="mt-2" style={{ color: C.mute }}>You Only Look Once : comprendre le principe, l’architecture et l’usage avec Ultralytics.</p>
      <div className="mt-6 space-y-2 text-sm" style={{ color: C.ink }}>
        {["Comprendre comment YOLO détecte plusieurs objets en une passe", "Distinguer Backbone, Neck et Head", "Découvrir YOLOv8 et YOLO11 avec Ultralytics"].map((t) => (
          <div key={t} className="flex items-start gap-2"><Check size={16} color={C.teal} className="mt-0.5 shrink-0" />{t}</div>
        ))}
      </div>
    </div>
    <svg viewBox="0 0 400 300" className="w-full">
      <rect width="400" height="300" rx="12" fill="#EAF0FA" /><rect y="230" width="400" height="70" fill="#CBD3E1" />
      <rect x="40" y="150" width="170" height="80" rx="12" fill="#6D86C9" /><rect x="70" y="115" width="100" height="42" rx="8" fill="#6D86C9" />
      <circle cx="80" cy="232" r="18" fill="#1f2937" /><circle cx="175" cy="232" r="18" fill="#1f2937" />
      <circle cx="290" cy="110" r="14" fill="#E58AA8" /><rect x="274" y="126" width="32" height="90" rx="7" fill="#E58AA8" />
      <circle cx="350" cy="70" r="26" fill="#F5C86A" />
      <Box b={{ x: 32, y: 105, w: 188, h: 148 }} color={C.blue} label="voiture 0.97" />
      <Box b={{ x: 266, y: 92, w: 48, h: 130 }} color={C.pink} label="personne 0.91" />
    </svg>
  </div>
);

/* ───────── Presentation ───────── */
const SLIDES = [
  ["Titre", S1], ["Le problème", S2], ["Présentation", S3], ["Principe", S4], ["Visuel : seuil", S5],
  ["Éléments", S6], ["NMS", S7], ["Architecture", S8], ["Backbone", S9], ["Neck et Head", S10],
  ["Versions", S11], ["v8 vs 11", S12], ["Ultralytics", S13], ["Conclusion", S14],
];

export default function Presentation() {
  const [i, setI] = useState(0);
  const n = SLIDES.length, Cur = SLIDES[i][1];
  const go = (d) => setI((x) => Math.min(n - 1, Math.max(0, x + d)));
  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="flex flex-col w-full" style={{
      minHeight: "100vh", height: "100vh", color: C.ink, background: C.paper,
      backgroundImage: "linear-gradient(#E3E8F1 1px, transparent 1px), linear-gradient(90deg, #E3E8F1 1px, transparent 1px)",
      backgroundSize: "32px 32px", fontFamily: "ui-sans-serif, system-ui, 'Segoe UI', sans-serif",
    }}>
      <div className="h-1.5 w-full" style={{ background: C.line }}>
        <div className="h-full" style={{ width: `${((i + 1) / n) * 100}%`, background: C.blue, transition: "width .25s" }} />
      </div>
      <main className="flex-1 overflow-auto px-8 py-6"><div className="w-full"><Cur /></div></main>
      <footer className="flex items-center justify-between px-8 py-3 border-t bg-white" style={{ borderColor: C.line }}>
        <button onClick={() => go(-1)} disabled={i === 0} className="flex items-center gap-1 px-4 py-2 rounded font-semibold text-sm border"
          style={{ opacity: i === 0 ? 0.4 : 1, borderColor: C.line, color: C.ink }}><ChevronLeft size={16} />Précédent</button>
        <div className="text-center">
          <div className="text-sm font-bold" style={{ fontFamily: MONO }}>{i + 1} / {n}</div>
          <div className="text-xs" style={{ color: C.mute }}>{SLIDES[i][0]}</div>
        </div>
        <button onClick={() => go(1)} disabled={i === n - 1} className="flex items-center gap-1 px-4 py-2 rounded font-semibold text-sm text-white"
          style={{ opacity: i === n - 1 ? 0.4 : 1, background: C.blue }}>Suivant<ChevronRight size={16} /></button>
      </footer>
    </div>
  );
}
