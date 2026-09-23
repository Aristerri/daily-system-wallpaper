import { ImageResponse } from "next/og";
import { getDevice } from "../../../lib/devices";
import { datePartsInZone, dayOfYear, daysUntilBirthday, isLeapYear } from "../../../lib/date";
import { getSprite, getSpriteName, SpriteCategory } from "../../../lib/sprites";
import { MOTIVATION } from "../../../lib/motivation";

export const runtime = "edge";

function cleanHex(value: string | null, fallback: string) {
  const raw = value ?? "";
  const v = raw.replace("#", "");
  return /^[0-9A-Fa-f]{6}$/.test(v) ? `#${v}` : fallback;
}

function bool(value: string | null, fallback = false) {
  if (value === null) return fallback;
  return value === "1" || value === "true" || value === "on";
}

function PixelSprite({ matrix, color, px }: { matrix: number[][]; color: string; px: number }) {
  const active: { x: number; y: number }[] = [];
  matrix.forEach((row, y) => row.forEach((v, x) => { if (v) active.push({ x, y }); }));
  return (
    <svg width={24 * px} height={24 * px} viewBox="0 0 24 24">
      {active.map(({ x, y }, i) => <rect key={i} x={x} y={y} width="1" height="1" fill={color} />)}
    </svg>
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const device = getDevice(searchParams.get("device"));
  const bg = cleanHex(searchParams.get("bg"), "#000000");
  const fg = cleanHex(searchParams.get("fg"), "#FFFFFF");
  const lang = searchParams.get("lang") === "en" ? "en" : "ru";
  const yearEnabled = bool(searchParams.get("year"), true);
  const yearMode = searchParams.get("yearMode") === "days" ? "days" : "percent";
  const birthday = searchParams.get("birthday") ?? "off";
  const objectRaw = searchParams.get("object") ?? "flowers";
  const objectMode = (["flowers","animals","geometry"].includes(objectRaw) ? objectRaw : null) as SpriteCategory | null;
  const objectSizeRaw = searchParams.get("objectSize") ?? "m";
  const objectSize = ["s","m","l"].includes(objectSizeRaw) ? objectSizeRaw : "m";
  const motivationEnabled = bool(searchParams.get("motivation"), true);
  const details = bool(searchParams.get("details"), true);
  const timeZone = searchParams.get("tz") || "UTC";

  let parts;
  try { parts = datePartsInZone(timeZone); } catch { parts = datePartsInZone("UTC"); }

  const doy = dayOfYear(parts.year, parts.month, parts.day);
  const totalDays = isLeapYear(parts.year) ? 366 : 365;
  const progress = Math.min(100, Math.max(0, (doy / totalDays) * 100));
  const forcedSeed = Number(searchParams.get("seed"));
  const seed = Number.isFinite(forcedSeed) && searchParams.has("seed") ? Math.abs(Math.floor(forcedSeed)) : doy + parts.year * 997;
  const spriteIndex = seed % 60;
  const motivationIndex = (seed * 7 + 11) % MOTIVATION.length;

  const scale = device.width / 828;
  const padX = Math.round(device.width * 0.075);
  const linePx = Math.max(1, Math.round(scale));
  const small = Math.round(18 * scale);
  const medium = Math.round(31 * scale);
  const large = Math.round(56 * scale);
  const safeTop = Math.round(device.height * 0.30);

  const modules: React.ReactNode[] = [];

  if (yearEnabled) {
    const display = yearMode === "days" ? `${doy} / ${totalDays}` : `${Math.round(progress)}%`;
    modules.push(
      <div key="year" style={{ display:"flex", flexDirection:"column", width:"100%", gap:Math.round(14*scale) }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", width:"100%" }}>
          <div style={{ display:"flex", fontSize:small, letterSpacing:"0.14em" }}>{lang === "ru" ? "ПРОГРЕСС ГОДА" : "YEAR PROGRESS"}</div>
          <div style={{ display:"flex", fontSize:medium, letterSpacing:"-0.03em" }}>{display}</div>
        </div>
        <div style={{ display:"flex", width:"100%", height:Math.max(5,Math.round(7*scale)), border:`${linePx}px solid ${fg}` }}>
          <div style={{ display:"flex", width:`${progress}%`, height:"100%", background:fg }} />
        </div>
      </div>
    );
  }

  if (objectMode) {
    const pxMap: Record<string, number> = {
      s: Math.max(5,Math.round(6*scale)),
      m: Math.max(7,Math.round(8.5*scale)),
      l: Math.max(9,Math.round(11*scale))
    };
    const matrix = getSprite(objectMode, spriteIndex);
    modules.push(
      <div key="object" style={{ display:"flex", width:"100%", flexDirection:"column", alignItems:"center", gap:Math.round(18*scale) }}>
        <PixelSprite matrix={matrix} color={fg} px={pxMap[objectSize]} />
        {details && (
          <div style={{ display:"flex", fontSize:Math.round(11*scale), letterSpacing:"0.16em", opacity:0.68 }}>
            // {objectMode.toUpperCase()}_{String(spriteIndex+1).padStart(2,"0")} / {getSpriteName(objectMode,spriteIndex).toUpperCase()}
          </div>
        )}
      </div>
    );
  }

  if (birthday !== "off") {
    const days = daysUntilBirthday(parts.year, parts.month, parts.day, birthday);
    modules.push(
      <div key="birthday" style={{ display:"flex", width:"100%", alignItems:"baseline", justifyContent:"space-between", borderTop:details ? `${linePx}px solid ${fg}` : undefined, paddingTop:details ? Math.round(18*scale) : 0 }}>
        <div style={{ display:"flex", fontSize:small, letterSpacing:"0.14em" }}>{lang === "ru" ? "ДО ДНЯ РОЖДЕНИЯ" : "UNTIL BIRTHDAY"}</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:Math.round(10*scale) }}>
          <span style={{ fontSize:large, letterSpacing:"-0.05em" }}>{days}</span>
          <span style={{ fontSize:small }}>{lang === "ru" ? "ДНЕЙ" : "DAYS"}</span>
        </div>
      </div>
    );
  }

  if (motivationEnabled) {
    const word = MOTIVATION[motivationIndex][lang === "ru" ? 0 : 1];
    modules.push(
      <div key="motivation" style={{ display:"flex", width:"100%", flexDirection:"column", gap:Math.round(10*scale) }}>
        {details && <div style={{ display:"flex", fontSize:Math.round(11*scale), letterSpacing:"0.16em", opacity:0.65 }}>{lang === "ru" ? "// СЛОВО_ДНЯ_" : "// WORD_OF_THE_DAY_"}</div>}
        <div style={{ display:"flex", fontSize:Math.round(72*scale), lineHeight:0.9, letterSpacing:"-0.055em", fontWeight:700 }}>{word}</div>
      </div>
    );
  }

  const justify = modules.length <= 2 ? "space-around" : "space-between";

  return new ImageResponse(
    <div style={{ display:"flex", width:"100%", height:"100%", position:"relative", background:bg, color:fg, fontFamily:"Arial, sans-serif", overflow:"hidden" }}>
      {details && (
        <>
          <div style={{ display:"flex", position:"absolute", left:padX, top:Math.round(device.height*0.07), fontSize:Math.round(12*scale), letterSpacing:"0.18em", opacity:0.6 }}>// DAILY_SYSTEM_</div>
          <div style={{ display:"flex", position:"absolute", right:padX, top:Math.round(device.height*0.07), fontSize:Math.round(12*scale), letterSpacing:"0.18em", opacity:0.6 }}>LOCK / {device.width}×{device.height}</div>
          <div style={{ display:"flex", position:"absolute", left:padX, right:padX, top:Math.round(device.height*0.235), height:linePx, background:fg, opacity:0.18 }} />
          <div style={{ display:"flex", position:"absolute", left:padX, bottom:Math.round(device.height*0.035), fontSize:Math.round(10*scale), letterSpacing:"0.18em", opacity:0.5 }}>{String(doy).padStart(3,"0")} / {parts.year}</div>
          <div style={{ display:"flex", position:"absolute", right:padX, bottom:Math.round(device.height*0.035), fontSize:Math.round(10*scale), letterSpacing:"0.18em", opacity:0.5 }}>+ {String(spriteIndex+1).padStart(2,"0")}</div>
        </>
      )}
      <div style={{ display:"flex", position:"absolute", left:padX, right:padX, top:safeTop, bottom:Math.round(device.height*0.08), flexDirection:"column", justifyContent:justify, alignItems:"stretch", gap:Math.round(28*scale) }}>
        {modules.length ? modules : <div style={{ display:"flex", fontSize:Math.round(18*scale), opacity:0.5, letterSpacing:"0.16em" }}>// EMPTY_SYSTEM_</div>}
      </div>
    </div>,
    { width:device.width, height:device.height }
  );
}
