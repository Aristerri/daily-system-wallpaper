"use client";

import { useEffect, useMemo, useState } from "react";
import { DEVICES, getDevice } from "../lib/devices";

type ObjectMode = "off" | "flowers" | "animals" | "geometry";
type ObjectSize = "s" | "m" | "l";
type Lang = "ru" | "en";
type ProgressMode = "percent" | "days";

const COPY = {
  en: {
    navTitle: "DYNAMIC WALLPAPER GENERATOR",
    eyebrow: "// LOCK_SCREEN_SYSTEM_",
    heroA: "BUILD YOUR",
    heroB: "DAILY SCREEN",
    heroText: "Minimal dynamic lock-screen wallpapers that update every day from one permanent URL.",
    livePreview: "// LIVE_PREVIEW_",
    lock: "LOCK SCREEN",
    configuration: "// CONFIGURATION_",
    device: "DEVICE",
    colorSystem: "COLOR SYSTEM",
    language: "LANGUAGE",
    year: "YEAR PROGRESS",
    birthday: "BIRTHDAY COUNTDOWN",
    object: "DAILY OBJECT",
    motivation: "DAILY MOTIVATION",
    details: "UI DETAILS",
    preview: "PREVIEW",
    background: "BACKGROUND",
    primary: "PRIMARY",
    hue: "HUE",
    saturation: "SATURATION",
    lightness: "LIGHTNESS",
    on: "ON",
    off: "OFF",
    percent: "%",
    daysMode: "267 / 365",
    flowers: "FLOWERS",
    animals: "ANIMALS",
    geometry: "GEOMETRY",
    randomize: "RANDOMIZE OBJECT + WORD",
    permanent: "// PERMANENT_URL_",
    oneUrl: "ONE URL.",
    newEveryDay: "NEW SCREEN EVERY DAY.",
    copyUrl: "COPY URL",
    copied: "COPIED",
    how: "// HOW_IT_WORKS_",
    howTitle: "SET IT ONCE.",
    howTitle2: "LET IT UPDATE DAILY.",
    flow1: "YOUR SETTINGS",
    flow2: "PERMANENT URL",
    flow3: "DAILY PNG",
    flow4: "IOS SHORTCUT",
    flow5: "LOCK SCREEN",
    guide: "// SETUP_GUIDE_",
    steps: [
      ["01", "CONFIGURE THE WALLPAPER", "Choose device, colors, modules, language and object type."],
      ["02", "COPY THE PERMANENT URL", "The URL contains the settings. No account or database is required."],
      ["03", "OPEN SHORTCUTS", "Create a new Shortcut on iPhone."],
      ["04", "GET CONTENTS OF URL", "Paste the generated wallpaper URL into the URL action, then add Get Contents of URL."],
      ["05", "SET WALLPAPER", "Add Set Wallpaper and choose your Lock Screen."],
      ["06", "CREATE AUTOMATION", "In Automation, run the Shortcut every day, for example at 00:05."],
      ["07", "ALLOW AUTOMATION", "Disable unnecessary confirmation prompts if your iOS version allows it."],
      ["08", "DONE", "The object, word and progress update automatically every day."]
    ],
    footer: "URL-BASED SETTINGS · NO ACCOUNT · NO DATABASE"
  },
  ru: {
    navTitle: "ГЕНЕРАТОР ДИНАМИЧЕСКИХ ОБОЕВ",
    eyebrow: "// LOCK_SCREEN_SYSTEM_",
    heroA: "СОБЕРИ СВОЙ",
    heroB: "DAILY SCREEN",
    heroText: "Минималистичные обои для экрана блокировки, которые обновляются каждый день по одной постоянной ссылке.",
    livePreview: "// ПРЕВЬЮ_",
    lock: "ЭКРАН БЛОКИРОВКИ",
    configuration: "// НАСТРОЙКИ_",
    device: "УСТРОЙСТВО",
    colorSystem: "ЦВЕТОВАЯ СИСТЕМА",
    language: "ЯЗЫК",
    year: "ПРОГРЕСС ГОДА",
    birthday: "ДО ДНЯ РОЖДЕНИЯ",
    object: "ОБЪЕКТ ДНЯ",
    motivation: "СЛОВО ДНЯ",
    details: "UI-ДЕТАЛИ",
    preview: "ПРЕВЬЮ",
    background: "ФОН",
    primary: "ОСНОВНОЙ",
    hue: "ТОН",
    saturation: "НАСЫЩЕННОСТЬ",
    lightness: "СВЕТЛОТА",
    on: "ВКЛ",
    off: "ВЫКЛ",
    percent: "%",
    daysMode: "267 / 365",
    flowers: "ЦВЕТЫ",
    animals: "ЖИВОТНЫЕ",
    geometry: "ГЕОМЕТРИЯ",
    randomize: "СМЕНИТЬ ОБЪЕКТ + СЛОВО",
    permanent: "// ПОСТОЯННАЯ_ССЫЛКА_",
    oneUrl: "ОДНА ССЫЛКА.",
    newEveryDay: "НОВЫЙ ЭКРАН КАЖДЫЙ ДЕНЬ.",
    copyUrl: "СКОПИРОВАТЬ URL",
    copied: "СКОПИРОВАНО",
    how: "// КАК_ЭТО_РАБОТАЕТ_",
    howTitle: "НАСТРОЙ ОДИН РАЗ.",
    howTitle2: "ДАЛЬШЕ — АВТОМАТИЧЕСКИ.",
    flow1: "ТВОИ НАСТРОЙКИ",
    flow2: "ПОСТОЯННЫЙ URL",
    flow3: "PNG НА ДЕНЬ",
    flow4: "КОМАНДА IOS",
    flow5: "LOCK SCREEN",
    guide: "// ИНСТРУКЦИЯ_",
    steps: [
      ["01", "НАСТРОЙ ОБОИ", "Выбери модель iPhone, цвета, язык и нужные модули."],
      ["02", "СКОПИРУЙ ПОСТОЯННУЮ ССЫЛКУ", "Настройки записаны прямо в URL. Аккаунт и база данных не нужны."],
      ["03", "ОТКРОЙ «КОМАНДЫ»", "Создай новую команду на iPhone."],
      ["04", "ПОЛУЧИ СОДЕРЖИМОЕ URL", "Добавь действие URL, вставь ссылку, затем действие «Получить содержимое URL»."],
      ["05", "УСТАНОВИ ОБОИ", "Добавь действие «Установить обои» и выбери экран блокировки."],
      ["06", "СОЗДАЙ АВТОМАТИЗАЦИЮ", "Запускай эту команду каждый день, например в 00:05."],
      ["07", "РАЗРЕШИ АВТОМАТИЗАЦИЮ", "Отключи лишние подтверждения, если твоя версия iOS это позволяет."],
      ["08", "ГОТОВО", "Объект, слово и прогресс будут обновляться автоматически каждый день."]
    ],
    footer: "НАСТРОЙКИ В URL · БЕЗ АККАУНТА · БЕЗ БАЗЫ ДАННЫХ"
  }
} as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hex(value: string, fallback: string) {
  const cleaned = value.trim().replace("#", "");
  return /^[0-9A-Fa-f]{6}$/.test(cleaned) ? cleaned.toUpperCase() : fallback;
}

function hexToHsl(hexValue: string) {
  const clean = hex(hexValue, "000000");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r,g,b] = [c,x,0];
  else if (h < 120) [r,g,b] = [x,c,0];
  else if (h < 180) [r,g,b] = [0,c,x];
  else if (h < 240) [r,g,b] = [0,x,c];
  else if (h < 300) [r,g,b] = [x,0,c];
  else [r,g,b] = [c,0,x];
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function deviceShellType(id: string) {
  if (["iphone14pro","iphone14promax","iphone15","iphone15plus","iphone15pro","iphone15promax",
       "iphone16","iphone16plus","iphone16pro","iphone16promax","iphone17","iphone17air","iphone17pro",
       "iphone17promax","iphone18pro","iphone18promax"].includes(id)) return "island";
  if (id === "iphoneduo") return "duo";
  return "notch";
}

export default function Home() {
  const [siteLang, setSiteLang] = useState<Lang>("ru");
  const t = COPY[siteLang];

  const [device, setDevice] = useState("iphone11");
  const [background, setBackground] = useState("000000");
  const [primary, setPrimary] = useState("FFFFFF");
  const [lang, setLang] = useState<Lang>("ru");
  const [yearProgress, setYearProgress] = useState(true);
  const [progressMode, setProgressMode] = useState<ProgressMode>("percent");
  const [birthdayEnabled, setBirthdayEnabled] = useState(true);
  const [birthday, setBirthday] = useState("1990-10-24");
  const [objectMode, setObjectMode] = useState<ObjectMode>("flowers");
  const [objectSize, setObjectSize] = useState<ObjectSize>("m");
  const [motivation, setMotivation] = useState(true);
  const [details, setDetails] = useState(true);
  const [previewSeed, setPreviewSeed] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeZone, setTimeZone] = useState("UTC");

  useEffect(() => {
    try { setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"); }
    catch { setTimeZone("UTC"); }
  }, []);

  const birthdayMD = birthday ? birthday.slice(5) : "10-24";
  const selectedDevice = getDevice(device);
  const shellType = deviceShellType(device);

  const query = useMemo(() => {
    const p = new URLSearchParams({
      device,
      bg: hex(background, "000000"),
      fg: hex(primary, "FFFFFF"),
      lang,
      year: yearProgress ? "1" : "0",
      yearMode: progressMode,
      birthday: birthdayEnabled ? birthdayMD : "off",
      object: objectMode,
      objectSize,
      motivation: motivation ? "1" : "0",
      details: details ? "1" : "0",
      tz: timeZone
    });
    return p;
  }, [device, background, primary, lang, yearProgress, progressMode, birthdayEnabled, birthdayMD, objectMode, objectSize, motivation, details, timeZone]);

  const permanentPath = `/api/wallpaper?${query.toString()}`;
  const previewPath = `${permanentPath}${previewSeed === null ? "" : `&seed=${previewSeed}`}`;

  const copyUrl = async () => {
    const absolute = `${window.location.origin}${permanentPath}`;
    await navigator.clipboard.writeText(absolute);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <main className="shell">
      <header className="topbar">
        <div>DAILY SYSTEM®</div>
        <div className="topbarCenter">{t.navTitle}</div>
        <div className="headerActions">
          <button className={siteLang === "ru" ? "langActive" : ""} onClick={() => setSiteLang("ru")}>RU</button>
          <span>/</span>
          <button className={siteLang === "en" ? "langActive" : ""} onClick={() => setSiteLang("en")}>EN</button>
        </div>
      </header>

      <section className="heroGrid">
        <div className="intro">
          <div className="eyebrow">{t.eyebrow}</div>
          <div>
            <h1><strong>{t.heroA}</strong><br /><strong>{t.heroB}</strong></h1>
            <p>{t.heroText}</p>
          </div>
        </div>

        <div className="previewPanel">
          <div className="panelLabel">
            <span>{t.livePreview}</span>
            <span>{t.lock}</span>
          </div>
          <div className="phoneStage">
            <div
              className={`phone phone-${shellType}`}
              style={{ aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}` }}
            >
              <img src={previewPath} alt="Wallpaper preview" />
              {shellType === "island" && <div className="dynamicIsland" />}
              {shellType === "notch" && <div className="notch" />}
              {shellType !== "duo" && <div className="iosClock">9:41</div>}
            </div>
          </div>
        </div>
      </section>

      <section className="config">
        <div className="configTitle">
          <span>{t.configuration}</span>
          <span>01—09</span>
        </div>

        <SettingRow index="01" title={t.device}>
          <select value={device} onChange={(e) => setDevice(e.target.value)}>
            {DEVICES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </SettingRow>

        <SettingRow index="02" title={t.colorSystem}>
          <div className="colorGrid">
            <ColorPanel label={t.background} value={background} onChange={setBackground} copy={t} />
            <ColorPanel label={t.primary} value={primary} onChange={setPrimary} copy={t} />
          </div>
        </SettingRow>

        <SettingRow index="03" title={t.language}>
          <Segment value={lang} onChange={(v) => setLang(v as Lang)} options={[["ru","RU"],["en","EN"]]} />
        </SettingRow>

        <SettingRow index="04" title={t.year}>
          <div className="stack">
            <Toggle value={yearProgress} onChange={setYearProgress} labels={[t.off, t.on]} />
            {yearProgress && (
              <Segment value={progressMode} onChange={(v) => setProgressMode(v as ProgressMode)} options={[["percent",t.percent],["days",t.daysMode]]} />
            )}
          </div>
        </SettingRow>

        <SettingRow index="05" title={t.birthday}>
          <div className="stack">
            <Toggle value={birthdayEnabled} onChange={setBirthdayEnabled} labels={[t.off, t.on]} />
            {birthdayEnabled && <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />}
          </div>
        </SettingRow>

        <SettingRow index="06" title={t.object}>
          <div className="stack">
            <Segment
              value={objectMode}
              onChange={(v) => setObjectMode(v as ObjectMode)}
              options={[["off",t.off],["flowers",t.flowers],["animals",t.animals],["geometry",t.geometry]]}
            />
            {objectMode !== "off" && (
              <Segment value={objectSize} onChange={(v) => setObjectSize(v as ObjectSize)} options={[["s","S"],["m","M"],["l","L"]]} />
            )}
          </div>
        </SettingRow>

        <SettingRow index="07" title={t.motivation}>
          <Toggle value={motivation} onChange={setMotivation} labels={[t.off, t.on]} />
        </SettingRow>

        <SettingRow index="08" title={t.details}>
          <Toggle value={details} onChange={setDetails} labels={[t.off, t.on]} />
        </SettingRow>

        <SettingRow index="09" title={t.preview}>
          <button className="outlineButton" onClick={() => setPreviewSeed(Math.floor(Math.random() * 1000000))}>
            {t.randomize}
          </button>
        </SettingRow>
      </section>

      <section className="urlSection">
        <div>
          <div className="eyebrow">{t.permanent}</div>
          <h2><strong>{t.oneUrl}</strong><br /><strong>{t.newEveryDay}</strong></h2>
        </div>
        <div className="urlBox">
          <code>{permanentPath}</code>
          <button onClick={copyUrl}>{copied ? t.copied : t.copyUrl}</button>
        </div>
      </section>

      <section className="howSection">
        <div className="howTitle">
          <div className="eyebrow">{t.how}</div>
          <h2><strong>{t.howTitle}</strong><br /><strong>{t.howTitle2}</strong></h2>
        </div>
        <div className="flowDiagram">
          {[t.flow1, t.flow2, t.flow3, t.flow4, t.flow5].map((item, i) => (
            <div key={item} className="flowItem">
              <span>{String(i + 1).padStart(2,"0")}</span>
              <strong>{item}</strong>
              {i < 4 && <b>→</b>}
            </div>
          ))}
        </div>
      </section>

      <section className="guideSection">
        <div className="configTitle">
          <span>{t.guide}</span>
          <span>01—08</span>
        </div>
        <div className="guideGrid">
          {t.steps.map(([num, title, body]) => (
            <article key={num} className="guideCard">
              <div className="guideNum">{num}</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <span>DAILY SYSTEM® / 2026</span>
        <span>{t.footer}</span>
      </footer>
    </main>
  );
}

function SettingRow({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <div className="settingRow">
      <div className="settingIndex">{index}</div>
      <div className="settingTitle">{title}</div>
      <div className="settingControl">{children}</div>
    </div>
  );
}

function ColorPanel({ label, value, onChange, copy }: {
  label: string; value: string; onChange: (value: string) => void; copy: typeof COPY["en"] | typeof COPY["ru"];
}) {
  const hsl = hexToHsl(value);
  const update = (next: Partial<typeof hsl>) => {
    const merged = { ...hsl, ...next };
    onChange(hslToHex(merged.h, merged.s, merged.l));
  };
  return (
    <div className="colorPanel">
      <div className="colorPanelHead">
        <span>{label}</span>
        <div className="swatch" style={{ background: `#${hex(value, "000000")}` }} />
      </div>
      <Range label={copy.hue} value={hsl.h} min={0} max={360} onChange={(v) => update({h: v})} />
      <Range label={copy.saturation} value={hsl.s} min={0} max={100} onChange={(v) => update({s: v})} />
      <Range label={copy.lightness} value={hsl.l} min={0} max={100} onChange={(v) => update({l: v})} />
      <label className="hexRow"><span>#</span><input value={value} maxLength={6} onChange={(e) => onChange(e.target.value.replace(/[^0-9a-fA-F]/g,"").slice(0,6).toUpperCase())}/></label>
    </div>
  );
}

function Range({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="rangeRow">
      <span>{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <em>{value}</em>
    </label>
  );
}

function Toggle({ value, onChange, labels }: { value: boolean; onChange: (value: boolean) => void; labels: [string,string] }) {
  return (
    <button className={`toggle ${value ? "active" : ""}`} onClick={() => onChange(!value)}>
      <span>{value ? labels[1] : labels[0]}</span><i />
    </button>
  );
}

function Segment({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: [string, string][]; }) {
  return (
    <div className="segment">
      {options.map(([id, label]) => (
        <button key={id} className={value === id ? "active" : ""} onClick={() => onChange(id)}>{label}</button>
      ))}
    </div>
  );
}
