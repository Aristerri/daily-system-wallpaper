"use client";

import { useEffect, useMemo, useState } from "react";
import { DEVICES } from "../lib/devices";

type ObjectMode = "off" | "flowers" | "animals" | "geometry";
type ObjectSize = "s" | "m" | "l";
type Lang = "ru" | "en";
type ProgressMode = "percent" | "days";

function hex(value: string, fallback: string) {
  const cleaned = value.trim().replace("#", "");
  return /^[0-9A-Fa-f]{6}$/.test(cleaned) ? cleaned.toUpperCase() : fallback;
}

export default function Home() {
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
    try {
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    } catch {
      setTimeZone("UTC");
    }
  }, []);

  const birthdayMD = birthday ? birthday.slice(5) : "10-24";

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
        <div className="topbarCenter">DYNAMIC WALLPAPER GENERATOR</div>
        <div>V.01</div>
      </header>

      <section className="heroGrid">
        <div className="intro">
          <div className="eyebrow">// LOCK_SCREEN_SYSTEM_</div>
          <h1>BUILD YOUR<br />DAILY SCREEN</h1>
          <p>
            Minimal dynamic wallpapers. No account. Your settings live inside a permanent URL.
          </p>
          <div className="metaRow">
            <span>180 PIXEL OBJECTS</span>
            <span>60 DAILY VERBS</span>
            <span>IP11 → CURRENT</span>
          </div>
        </div>

        <div className="previewPanel">
          <div className="panelLabel">
            <span>// LIVE_PREVIEW_</span>
            <span>LOCK SCREEN</span>
          </div>
          <div className="phoneStage">
            <div className="phone">
              <img src={previewPath} alt="Wallpaper preview" />
              <div className="fakeClock">9:41</div>
            </div>
          </div>
        </div>
      </section>

      <section className="config">
        <div className="configTitle">
          <span>// CONFIGURATION_</span>
          <span>01—09</span>
        </div>

        <SettingRow index="01" title="DEVICE">
          <select value={device} onChange={(e) => setDevice(e.target.value)}>
            {DEVICES.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </SettingRow>

        <SettingRow index="02" title="COLOR SYSTEM">
          <div className="dual">
            <HexField label="BACKGROUND" value={background} onChange={setBackground} />
            <HexField label="PRIMARY" value={primary} onChange={setPrimary} />
          </div>
        </SettingRow>

        <SettingRow index="03" title="LANGUAGE">
          <Segment value={lang} onChange={(v) => setLang(v as Lang)} options={[["ru","RU"],["en","EN"]]} />
        </SettingRow>

        <SettingRow index="04" title="YEAR PROGRESS">
          <div className="stack">
            <Toggle value={yearProgress} onChange={setYearProgress} />
            {yearProgress && (
              <Segment value={progressMode} onChange={(v) => setProgressMode(v as ProgressMode)} options={[["percent","%"],["days","267 / 365"]]} />
            )}
          </div>
        </SettingRow>

        <SettingRow index="05" title="BIRTHDAY COUNTDOWN">
          <div className="stack">
            <Toggle value={birthdayEnabled} onChange={setBirthdayEnabled} />
            {birthdayEnabled && <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />}
          </div>
        </SettingRow>

        <SettingRow index="06" title="DAILY OBJECT">
          <div className="stack">
            <Segment
              value={objectMode}
              onChange={(v) => setObjectMode(v as ObjectMode)}
              options={[["off","OFF"],["flowers","FLOWERS"],["animals","ANIMALS"],["geometry","GEOMETRY"]]}
            />
            {objectMode !== "off" && (
              <Segment value={objectSize} onChange={(v) => setObjectSize(v as ObjectSize)} options={[["s","S"],["m","M"],["l","L"]]} />
            )}
          </div>
        </SettingRow>

        <SettingRow index="07" title="DAILY MOTIVATION">
          <Toggle value={motivation} onChange={setMotivation} />
        </SettingRow>

        <SettingRow index="08" title="UI DETAILS">
          <Toggle value={details} onChange={setDetails} />
        </SettingRow>

        <SettingRow index="09" title="PREVIEW">
          <button className="outlineButton" onClick={() => setPreviewSeed(Math.floor(Math.random() * 1000000))}>
            RANDOMIZE OBJECT + WORD
          </button>
        </SettingRow>
      </section>

      <section className="urlSection">
        <div>
          <div className="eyebrow">// PERMANENT_URL_</div>
          <h2>ONE URL.<br />NEW SCREEN EVERY DAY.</h2>
        </div>
        <div className="urlBox">
          <code>{permanentPath}</code>
          <button onClick={copyUrl}>{copied ? "COPIED" : "COPY URL"}</button>
        </div>
      </section>

      <footer>
        <span>DAILY SYSTEM® / 2026</span>
        <span>NO ACCOUNT · NO DATABASE · URL-BASED SETTINGS</span>
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

function HexField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const normalized = "#" + hex(value, "000000");
  return (
    <label className="hexField">
      <span>{label}</span>
      <div>
        <input className="colorInput" type="color" value={normalized} onChange={(e) => onChange(e.target.value.slice(1))} />
        <span>#</span>
        <input
          className="hexInput"
          maxLength={6}
          value={value}
          onChange={(e) => setSafeHex(e.target.value, onChange)}
        />
      </div>
    </label>
  );
}

function setSafeHex(value: string, fn: (value: string) => void) {
  fn(value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6).toUpperCase());
}

function Toggle({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  return (
    <button className={`toggle ${value ? "active" : ""}`} onClick={() => onChange(!value)}>
      <span>{value ? "ON" : "OFF"}</span>
      <i />
    </button>
  );
}

function Segment({
  value,
  onChange,
  options
}: {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="segment">
      {options.map(([id, label]) => (
        <button key={id} className={value === id ? "active" : ""} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}
