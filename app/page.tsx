"use client";

import { useEffect, useMemo, useState } from "react";
import { DEVICES, getDevice } from "../lib/devices";

type ObjectMode = "off" | "flowers" | "animals" | "geometry";
type ObjectSize = "s" | "m" | "l";
type Lang = "ru" | "en";
type ProgressMode = "percent" | "days";
type YearStyle = "ticks" | "ring" | "months";
type Align = "left" | "center" | "right";

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
    layout: "LAYOUT & SAFE AREA",
    preview: "PREVIEW",
    background: "BACKGROUND",
    primary: "PRIMARY",
    hue: "HUE",
    saturation: "SATURATION",
    lightness: "LIGHTNESS",
    on: "ON",
    off: "OFF",
    style: "STYLE",
    value: "VALUE",
    size: "SIZE",
    vertical: "VERTICAL POSITION",
    topSafe: "TOP SAFE AREA",
    bottomSafe: "BOTTOM SAFE AREA",
    align: "ALIGNMENT",
    spacing: "CONTENT SPACING",
    percent: "%",
    daysMode: "267 / 365",
    ticks: "TICKS",
    ring: "RING",
    months: "MONTHS",
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
      ["01", "CONFIGURE THE WALLPAPER", "Choose device, colors, modules, layout and safe areas."],
      ["02", "COPY THE PERMANENT URL", "The URL contains all settings. No account or database is required."],
      ["03", "OPEN SHORTCUTS", "Create a new Shortcut on iPhone."],
      ["04", "GET CONTENTS OF URL", "Add URL, paste the generated link, then add Get Contents of URL."],
      ["05", "SET WALLPAPER", "Add Set Wallpaper and choose your Lock Screen."],
      ["06", "CREATE AUTOMATION", "Run the Shortcut every day, for example at 00:05."],
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
    layout: "КОМПОЗИЦИЯ И SAFE AREA",
    preview: "ПРЕВЬЮ",
    background: "ФОН",
    primary: "ОСНОВНОЙ",
    hue: "ТОН",
    saturation: "НАСЫЩЕННОСТЬ",
    lightness: "СВЕТЛОТА",
    on: "ВКЛ",
    off: "ВЫКЛ",
    style: "СТИЛЬ",
    value: "ЗНАЧЕНИЕ",
    size: "РАЗМЕР",
    vertical: "ПОЗИЦИЯ ПО ВЫСОТЕ",
    topSafe: "SAFE AREA СВЕРХУ",
    bottomSafe: "SAFE AREA СНИЗУ",
    align: "ВЫРАВНИВАНИЕ",
    spacing: "ВОЗДУХ",
    percent: "%",
    daysMode: "267 / 365",
    ticks: "РИСКИ",
    ring: "КОЛЬЦО",
    months: "МЕСЯЦЫ",
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
      ["01", "НАСТРОЙ ОБОИ", "Выбери модель iPhone, цвета, модули, композицию и safe area."],
      ["02", "СКОПИРУЙ ПОСТОЯННУЮ ССЫЛКУ", "Все настройки записаны прямо в URL. Аккаунт и база данных не нужны."],
      ["03", "ОТКРОЙ «КОМАНДЫ»", "Создай новую команду на iPhone."],
      ["04", "ПОЛУЧИ СОДЕРЖИМОЕ URL", "Добавь URL, вставь ссылку, затем «Получить содержимое URL»."],
      ["05", "УСТАНОВИ ОБОИ", "Добавь «Установить обои» и выбери экран блокировки."],
      ["06", "СОЗДАЙ АВТОМАТИЗАЦИЮ", "Запускай команду каждый день, например в 00:05."],
      ["07", "РАЗРЕШИ АВТОМАТИЗАЦИЮ", "Отключи лишние подтверждения, если твоя версия iOS это позволяет."],
      ["08", "ГОТОВО", "Объект, слово и прогресс будут обновляться автоматически."]
    ],
    footer: "НАСТРОЙКИ В URL · БЕЗ АККАУНТА · БЕЗ БАЗЫ ДАННЫХ"
  }
} as const;

function clamp(n:number,min:number,max:number){return Math.max(min,Math.min(max,n));}
function hex(value:string,fallback:string){
  const cleaned=value.trim().replace("#","");
  return /^[0-9A-Fa-f]{6}$/.test(cleaned)?cleaned.toUpperCase():fallback;
}
function hexToHsl(hexValue:string){
  const clean=hex(hexValue,"000000");
  const r=parseInt(clean.slice(0,2),16)/255,g=parseInt(clean.slice(2,4),16)/255,b=parseInt(clean.slice(4,6),16)/255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  let h=0,s=0; const l=(max+min)/2;
  if(max!==min){
    const d=max-min; s=l>.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}
    h*=60;
  }
  return {h:Math.round(h),s:Math.round(s*100),l:Math.round(l*100)};
}
function hslToHex(h:number,s:number,l:number){
  h=((h%360)+360)%360;s=clamp(s,0,100)/100;l=clamp(l,0,100)/100;
  const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
  let r=0,g=0,b=0;
  if(h<60)[r,g,b]=[c,x,0]; else if(h<120)[r,g,b]=[x,c,0]; else if(h<180)[r,g,b]=[0,c,x];
  else if(h<240)[r,g,b]=[0,x,c]; else if(h<300)[r,g,b]=[x,0,c]; else [r,g,b]=[c,0,x];
  const f=(v:number)=>Math.round((v+m)*255).toString(16).padStart(2,"0");
  return `${f(r)}${f(g)}${f(b)}`.toUpperCase();
}
function deviceShellType(id:string){
  if(["iphone14pro","iphone14promax","iphone15","iphone15plus","iphone15pro","iphone15promax","iphone16","iphone16plus","iphone16pro","iphone16promax","iphone17","iphone17air","iphone17pro","iphone17promax","iphone18pro","iphone18promax"].includes(id))return"island";
  if(id==="iphoneduo")return"duo";
  return"notch";
}

export default function Home(){
  const [siteLang,setSiteLang]=useState<Lang>("ru"); const t=COPY[siteLang];
  const [device,setDevice]=useState("iphone11");
  const [background,setBackground]=useState("000000");
  const [primary,setPrimary]=useState("FFFFFF");
  const [lang,setLang]=useState<Lang>("ru");
  const [yearProgress,setYearProgress]=useState(true);
  const [progressMode,setProgressMode]=useState<ProgressMode>("percent");
  const [yearStyle,setYearStyle]=useState<YearStyle>("ticks");
  const [yearSize,setYearSize]=useState<ObjectSize>("l");
  const [yearY,setYearY]=useState(49);
  const [birthdayEnabled,setBirthdayEnabled]=useState(true);
  const [birthday,setBirthday]=useState("1990-10-24");
  const [birthdaySize,setBirthdaySize]=useState<ObjectSize>("m");
  const [birthdayY,setBirthdayY]=useState(69);
  const [objectMode,setObjectMode]=useState<ObjectMode>("flowers");
  const [objectSize,setObjectSize]=useState<ObjectSize>("l");
  const [objectY,setObjectY]=useState(60);
  const [motivation,setMotivation]=useState(true);
  const [wordSize,setWordSize]=useState<ObjectSize>("l");
  const [wordY,setWordY]=useState(77);
  const [details,setDetails]=useState(true);
  const [align,setAlign]=useState<Align>("center");
  const [topSafe,setTopSafe]=useState(27);
  const [bottomSafe,setBottomSafe]=useState(18);
  const [previewSeed,setPreviewSeed]=useState<number|null>(null);
  const [copied,setCopied]=useState(false);
  const [timeZone,setTimeZone]=useState("UTC");

  useEffect(()=>{try{setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC")}catch{setTimeZone("UTC")}},[]);

  const birthdayMD=birthday?birthday.slice(5):"10-24";
  const selectedDevice=getDevice(device); const shellType=deviceShellType(device);

  const query=useMemo(()=>{
    const p=new URLSearchParams({
      device,bg:hex(background,"000000"),fg:hex(primary,"FFFFFF"),lang,
      year:yearProgress?"1":"0",yearMode:progressMode,yearStyle,yearSize,yearY:String(yearY),
      birthday:birthdayEnabled?birthdayMD:"off",birthdaySize,birthdayY:String(birthdayY),
      object:objectMode,objectSize,objectY:String(objectY),
      motivation:motivation?"1":"0",wordSize,wordY:String(wordY),
      details:details?"1":"0",align,topSafe:String(topSafe),bottomSafe:String(bottomSafe),tz:timeZone
    }); return p;
  },[device,background,primary,lang,yearProgress,progressMode,yearStyle,yearSize,yearY,birthdayEnabled,birthdayMD,birthdaySize,birthdayY,objectMode,objectSize,objectY,motivation,wordSize,wordY,details,align,topSafe,bottomSafe,timeZone]);

  const permanentPath=`/api/wallpaper?${query.toString()}`;
  const previewPath=`${permanentPath}${previewSeed===null?"":`&seed=${previewSeed}`}`;

  const copyUrl=async()=>{await navigator.clipboard.writeText(`${window.location.origin}${permanentPath}`);setCopied(true);window.setTimeout(()=>setCopied(false),1400)};

  return <main className="shell">
    <header className="topbar">
      <div>DAILY SYSTEM®</div><div className="topbarCenter">{t.navTitle}</div>
      <div className="headerActions"><button className={siteLang==="ru"?"langActive":""} onClick={()=>setSiteLang("ru")}>RU</button><span>/</span><button className={siteLang==="en"?"langActive":""} onClick={()=>setSiteLang("en")}>EN</button></div>
    </header>

    <section className="heroGrid">
      <div className="intro"><div className="eyebrow">{t.eyebrow}</div><div><h1><strong>{t.heroA}</strong><br/><strong>{t.heroB}</strong></h1><p>{t.heroText}</p></div></div>
      <div className="previewPanel">
        <div className="panelLabel"><span>{t.livePreview}</span><span>{t.lock}</span></div>
        <div className="phoneStage">
          <div className={`phone phone-${shellType}`} style={{aspectRatio:`${selectedDevice.width} / ${selectedDevice.height}`}}>
            <img src={previewPath} alt="Wallpaper preview"/>
            {shellType==="island"&&<div className="dynamicIsland"/>}
            {shellType==="notch"&&<div className="notch"/>}
            {shellType!=="duo"&&<>
              <div className="iosDate">{siteLang==="ru"?"СРЕДА, 24 СЕНТЯБРЯ":"WEDNESDAY, SEPTEMBER 24"}</div>
              <div className="iosClock">9:41</div>
              <div className="lockButtons"><i>⌁</i><i>◉</i></div>
              <div className="homeIndicator"/>
            </>}
          </div>
        </div>
      </div>
    </section>

    <section className="config">
      <div className="configTitle"><span>{t.configuration}</span><span>01—10</span></div>

      <SettingRow index="01" title={t.device}>
        <select value={device} onChange={e=>setDevice(e.target.value)}>{DEVICES.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select>
      </SettingRow>

      <SettingRow index="02" title={t.colorSystem}>
        <div className="colorGrid"><ColorPanel label={t.background} value={background} onChange={setBackground} copy={t}/><ColorPanel label={t.primary} value={primary} onChange={setPrimary} copy={t}/></div>
      </SettingRow>

      <SettingRow index="03" title={t.language}><Segment value={lang} onChange={v=>setLang(v as Lang)} options={[["ru","RU"],["en","EN"]]}/></SettingRow>

      <SettingRow index="04" title={t.layout}>
        <div className="stack wideStack">
          <RangeControl label={t.topSafe} value={topSafe} min={18} max={38} suffix="%" onChange={setTopSafe}/>
          <RangeControl label={t.bottomSafe} value={bottomSafe} min={12} max={28} suffix="%" onChange={setBottomSafe}/>
          <div className="subControl"><span>{t.align}</span><Segment value={align} onChange={v=>setAlign(v as Align)} options={[["left","LEFT"],["center","CENTER"],["right","RIGHT"]]}/></div>
        </div>
      </SettingRow>

      <SettingRow index="05" title={t.year}>
        <div className="stack wideStack">
          <Toggle value={yearProgress} onChange={setYearProgress} labels={[t.off,t.on]}/>
          {yearProgress&&<>
            <div className="subControl"><span>{t.value}</span><Segment value={progressMode} onChange={v=>setProgressMode(v as ProgressMode)} options={[["percent",t.percent],["days",t.daysMode]]}/></div>
            <div className="subControl"><span>{t.style}</span><Segment value={yearStyle} onChange={v=>setYearStyle(v as YearStyle)} options={[["ticks",t.ticks],["ring",t.ring],["months",t.months]]}/></div>
            <div className="subControl"><span>{t.size}</span><Segment value={yearSize} onChange={v=>setYearSize(v as ObjectSize)} options={[["s","S"],["m","M"],["l","L"]]}/></div>
            <RangeControl label={t.vertical} value={yearY} min={topSafe+8} max={100-bottomSafe-8} suffix="%" onChange={setYearY}/>
          </>}
        </div>
      </SettingRow>

      <SettingRow index="06" title={t.object}>
        <div className="stack wideStack">
          <Segment value={objectMode} onChange={v=>setObjectMode(v as ObjectMode)} options={[["off",t.off],["flowers",t.flowers],["animals",t.animals],["geometry",t.geometry]]}/>
          {objectMode!=="off"&&<>
            <div className="subControl"><span>{t.size}</span><Segment value={objectSize} onChange={v=>setObjectSize(v as ObjectSize)} options={[["s","S"],["m","M"],["l","L"]]}/></div>
            <RangeControl label={t.vertical} value={objectY} min={topSafe+8} max={100-bottomSafe-8} suffix="%" onChange={setObjectY}/>
          </>}
        </div>
      </SettingRow>

      <SettingRow index="07" title={t.birthday}>
        <div className="stack wideStack">
          <Toggle value={birthdayEnabled} onChange={setBirthdayEnabled} labels={[t.off,t.on]}/>
          {birthdayEnabled&&<>
            <input type="date" value={birthday} onChange={e=>setBirthday(e.target.value)}/>
            <div className="subControl"><span>{t.size}</span><Segment value={birthdaySize} onChange={v=>setBirthdaySize(v as ObjectSize)} options={[["s","S"],["m","M"],["l","L"]]}/></div>
            <RangeControl label={t.vertical} value={birthdayY} min={topSafe+8} max={100-bottomSafe-8} suffix="%" onChange={setBirthdayY}/>
          </>}
        </div>
      </SettingRow>

      <SettingRow index="08" title={t.motivation}>
        <div className="stack wideStack">
          <Toggle value={motivation} onChange={setMotivation} labels={[t.off,t.on]}/>
          {motivation&&<>
            <div className="subControl"><span>{t.size}</span><Segment value={wordSize} onChange={v=>setWordSize(v as ObjectSize)} options={[["s","S"],["m","M"],["l","L"]]}/></div>
            <RangeControl label={t.vertical} value={wordY} min={topSafe+8} max={100-bottomSafe-8} suffix="%" onChange={setWordY}/>
          </>}
        </div>
      </SettingRow>

      <SettingRow index="09" title={t.details}><Toggle value={details} onChange={setDetails} labels={[t.off,t.on]}/></SettingRow>
      <SettingRow index="10" title={t.preview}><button className="outlineButton" onClick={()=>setPreviewSeed(Math.floor(Math.random()*1000000))}>{t.randomize}</button></SettingRow>
    </section>

    <section className="urlSection"><div><div className="eyebrow">{t.permanent}</div><h2><strong>{t.oneUrl}</strong><br/><strong>{t.newEveryDay}</strong></h2></div><div className="urlBox"><code>{permanentPath}</code><button onClick={copyUrl}>{copied?t.copied:t.copyUrl}</button></div></section>

    <section className="howSection"><div className="howTitle"><div className="eyebrow">{t.how}</div><h2><strong>{t.howTitle}</strong><br/><strong>{t.howTitle2}</strong></h2></div><div className="flowDiagram">{[t.flow1,t.flow2,t.flow3,t.flow4,t.flow5].map((item,i)=><div key={item} className="flowItem"><span>{String(i+1).padStart(2,"0")}</span><strong>{item}</strong>{i<4&&<b>→</b>}</div>)}</div></section>

    <section className="guideSection"><div className="configTitle"><span>{t.guide}</span><span>01—08</span></div><div className="guideGrid">{t.steps.map(([num,title,body])=><article key={num} className="guideCard"><div className="guideNum">{num}</div><h3>{title}</h3><p>{body}</p></article>)}</div></section>

    <footer><span>DAILY SYSTEM® / 2026</span><span>{t.footer}</span></footer>
  </main>
}

function SettingRow({index,title,children}:{index:string;title:string;children:React.ReactNode}){return <div className="settingRow"><div className="settingIndex">{index}</div><div className="settingTitle">{title}</div><div className="settingControl">{children}</div></div>}

function ColorPanel({label,value,onChange,copy}:{label:string;value:string;onChange:(v:string)=>void;copy:any}){
  const hsl=hexToHsl(value); const update=(next:any)=>{const m={...hsl,...next};onChange(hslToHex(m.h,m.s,m.l))}
  return <div className="colorPanel">
    <div className="colorPanelHead"><span>{label}</span><div className="swatch" style={{background:`#${hex(value,"000000")}`}}/></div>
    <ColorRange kind="hue" label={copy.hue} value={hsl.h} min={0} max={360} onChange={v=>update({h:v})}/>
    <ColorRange kind="sat" label={copy.saturation} value={hsl.s} min={0} max={100} hue={hsl.h} light={hsl.l} onChange={v=>update({s:v})}/>
    <ColorRange kind="light" label={copy.lightness} value={hsl.l} min={0} max={100} hue={hsl.h} sat={hsl.s} onChange={v=>update({l:v})}/>
    <label className="hexRow"><span>#</span><input value={value} maxLength={6} onChange={e=>onChange(e.target.value.replace(/[^0-9a-fA-F]/g,"").slice(0,6).toUpperCase())}/></label>
  </div>
}

function ColorRange({kind,label,value,min,max,hue=0,sat=100,light=50,onChange}:{kind:string;label:string;value:number;min:number;max:number;hue?:number;sat?:number;light?:number;onChange:(v:number)=>void}){
  let bg="";
  if(kind==="hue") bg="linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)";
  if(kind==="sat") bg=`linear-gradient(90deg,hsl(${hue} 0% ${light}%),hsl(${hue} 100% ${light}%))`;
  if(kind==="light") bg=`linear-gradient(90deg,#000,hsl(${hue} ${sat}% 50%),#fff)`;
  return <label className="rangeRow"><span>{label}</span><input className="colorRange" style={{background:bg}} type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))}/><em>{value}</em></label>
}

function RangeControl({label,value,min,max,suffix,onChange}:{label:string;value:number;min:number;max:number;suffix:string;onChange:(v:number)=>void}){return <label className="rangeRow genericRange"><span>{label}</span><input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))}/><em>{value}{suffix}</em></label>}

function Toggle({value,onChange,labels}:{value:boolean;onChange:(v:boolean)=>void;labels:[string,string]}){return <button className={`toggle ${value?"active":""}`} onClick={()=>onChange(!value)}><span>{value?labels[1]:labels[0]}</span><i/></button>}
function Segment({value,onChange,options}:{value:string;onChange:(v:string)=>void;options:[string,string][]}){return <div className="segment">{options.map(([id,label])=><button key={id} className={value===id?"active":""} onClick={()=>onChange(id)}>{label}</button>)}</div>}
