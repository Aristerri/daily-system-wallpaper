"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DEVICES, getDevice } from "../lib/devices";

type ObjectMode = "off" | "flowers" | "animals" | "geometry";
type ObjectSize = "s" | "m" | "l";
type Lang = "ru" | "en";
type ProgressMode = "percent" | "days";
type FrameStyle = "frame" | "corners" | "none";
type Signature = "off" | "logo" | "text" | "both";
type Slot = "tl" | "tr" | "bl" | "br";
type ModuleKey = "object" | "birthday" | "word" | "day";

const SLOTS: Slot[] = ["tl","tr","bl","br"];

const COPY = {
  en: {
    navTitle: "DYNAMIC WALLPAPER GENERATOR",
    eyebrow: "// LOCK_SCREEN_SYSTEM_",
    heroA: "BUILD YOUR",
    heroB: "DAILY SCREEN",
    heroText: "A modular lock-screen wallpaper that updates every day from one permanent URL.",
    livePreview: "// INTERACTIVE_PREVIEW_",
    lock: "LOCK SCREEN",
    dragHint: "DRAG MODULES IN THE PHONE PREVIEW",
    configuration: "// CONFIGURATION_",
    device: "DEVICE",
    colorSystem: "COLOR SYSTEM",
    wallpaperLanguage: "WALLPAPER LANGUAGE",
    year: "YEAR PROGRESS",
    birthday: "BIRTHDAY COUNTDOWN",
    object: "DAILY OBJECT",
    motivation: "DAILY MOTIVATION",
    day: "DAY INDEX",
    details: "UI DETAILS",
    frameStyle: "BLOCK FRAME",
    signature: "SIGNATURE",
    preview: "RANDOMIZER",
    background: "BACKGROUND",
    primary: "PRIMARY",
    on: "ON",
    off: "OFF",
    value: "VALUE",
    size: "SIZE",
    percent: "%",
    daysMode: "267 / 365",
    flowers: "FLOWERS",
    animals: "ANIMALS",
    geometry: "GEOMETRY",
    frame: "FRAME",
    corners: "CORNERS",
    none: "NONE",
    logo: "LOGO",
    text: "ARISTERRI",
    both: "LOGO + TEXT",
    randomizePreview: "RANDOMIZE OBJECT + WORD",
    randomizeAll: "RANDOMIZE ALL WALLPAPER",
    resetLayout: "RESET GRID",
    permanent: "// PERMANENT_URL_",
    oneUrl: "ONE URL.",
    newEveryDay: "NEW SCREEN EVERY DAY.",
    copyUrl: "COPY URL",
    copied: "COPIED",
    how: "// HOW_IT_WORKS_",
    howTitle: "SET IT ONCE.",
    howTitle2: "LET IT UPDATE DAILY.",
    guide: "// IOS_AUTOMATION_GUIDE_",
    steps: [
      ["01","FINISH THE WALLPAPER","Choose the device, colors and modules. Drag the surrounding modules between the four grid cells."],
      ["02","COPY THE URL","Press COPY URL. This permanent address contains your wallpaper settings."],
      ["03","CREATE A SHORTCUT","Open Shortcuts → + → New Shortcut. Add the action “URL” and paste your permanent URL."],
      ["04","DOWNLOAD THE IMAGE","Add “Get Contents of URL” directly after the URL action. The result should be an image."],
      ["05","SET THE LOCK SCREEN","Add “Set Wallpaper Photo”. Choose the Lock Screen wallpaper you want the Shortcut to update."],
      ["06","TURN OFF PREVIEW","Inside the Set Wallpaper action, disable “Show Preview” if that option is available on your iOS version."],
      ["07","CREATE AUTOMATION","Shortcuts → Automation → + → Time of Day. Choose a time such as 00:05 and select Daily."],
      ["08","RUN THE SHORTCUT","Choose “Run Immediately”, add “Run Shortcut”, then select the wallpaper Shortcut you created."],
      ["09","TEST IT","Run the Shortcut manually once. Confirm that the Lock Screen changes without cropping important content."],
      ["10","DONE","Every day the same URL returns a new daily object/word while keeping your chosen design."]
    ],
    note: "Apple can change Shortcuts labels between iOS versions. If a label is slightly different, use the equivalent URL / Get Contents / Set Wallpaper actions.",
    footer: "V.05 · URL-BASED SETTINGS · NO ACCOUNT · NO DATABASE"
  },
  ru: {
    navTitle: "ГЕНЕРАТОР ДИНАМИЧЕСКИХ ОБОЕВ",
    eyebrow: "// LOCK_SCREEN_SYSTEM_",
    heroA: "СОБЕРИ СВОЙ",
    heroB: "DAILY SCREEN",
    heroText: "Модульные обои для экрана блокировки, которые обновляются каждый день по одной постоянной ссылке.",
    livePreview: "// ИНТЕРАКТИВНОЕ_ПРЕВЬЮ_",
    lock: "ЭКРАН БЛОКИРОВКИ",
    dragHint: "ПЕРЕТАСКИВАЙ БЛОКИ ПРЯМО В ПРЕВЬЮ",
    configuration: "// НАСТРОЙКИ_",
    device: "УСТРОЙСТВО",
    colorSystem: "ЦВЕТОВАЯ СИСТЕМА",
    wallpaperLanguage: "ЯЗЫК ОБОЕВ",
    year: "ПРОГРЕСС ГОДА",
    birthday: "ДО ДНЯ РОЖДЕНИЯ",
    object: "ОБЪЕКТ ДНЯ",
    motivation: "СЛОВО ДНЯ",
    day: "НОМЕР ДНЯ",
    details: "UI-ДЕТАЛИ",
    frameStyle: "РАМКА БЛОКОВ",
    signature: "ПОДПИСЬ",
    preview: "РАНДОМАЙЗЕР",
    background: "ФОН",
    primary: "ОСНОВНОЙ",
    on: "ВКЛ",
    off: "ВЫКЛ",
    value: "ЗНАЧЕНИЕ",
    size: "РАЗМЕР",
    percent: "%",
    daysMode: "267 / 365",
    flowers: "ЦВЕТЫ",
    animals: "ЖИВОТНЫЕ",
    geometry: "ГЕОМЕТРИЯ",
    frame: "РАМКА",
    corners: "УГОЛКИ",
    none: "НЕТ",
    logo: "ЛОГО",
    text: "ARISTERRI",
    both: "ЛОГО + ТЕКСТ",
    randomizePreview: "СМЕНИТЬ ОБЪЕКТ + СЛОВО",
    randomizeAll: "ПОЛНОСТЬЮ РАНДОМАЙЗИТЬ ОБОИ",
    resetLayout: "СБРОСИТЬ СЕТКУ",
    permanent: "// ПОСТОЯННАЯ_ССЫЛКА_",
    oneUrl: "ОДНА ССЫЛКА.",
    newEveryDay: "НОВЫЙ ЭКРАН КАЖДЫЙ ДЕНЬ.",
    copyUrl: "СКОПИРОВАТЬ URL",
    copied: "СКОПИРОВАНО",
    how: "// КАК_ЭТО_РАБОТАЕТ_",
    howTitle: "НАСТРОЙ ОДИН РАЗ.",
    howTitle2: "ДАЛЬШЕ — АВТОМАТИЧЕСКИ.",
    guide: "// НАСТРОЙКА_АВТОМАТИЗАЦИИ_IOS_",
    steps: [
      ["01","СОБЕРИ ОБОИ","Выбери iPhone, цвета и модули. Боковые блоки можно перетаскивать между четырьмя ячейками прямо в превью."],
      ["02","СКОПИРУЙ URL","Нажми «Скопировать URL». В постоянной ссылке уже записаны все настройки обоев."],
      ["03","СОЗДАЙ КОМАНДУ","Открой «Команды» → + → новая команда. Добавь действие «URL» и вставь постоянную ссылку."],
      ["04","ПОЛУЧИ КАРТИНКУ","Следом добавь «Получить содержимое URL». Результатом действия должна стать картинка."],
      ["05","УСТАНОВИ LOCK SCREEN","Добавь действие «Установить фото обоев» / Set Wallpaper Photo и выбери экран блокировки, который команда будет обновлять."],
      ["06","ОТКЛЮЧИ ПРЕВЬЮ","В действии установки обоев отключи «Показывать превью», если этот переключатель доступен в твоей версии iOS."],
      ["07","СОЗДАЙ АВТОМАТИЗАЦИЮ","В «Командах» открой «Автоматизация» → + → «Время суток». Например, поставь 00:05 и повтор «Ежедневно»."],
      ["08","ЗАПУСКАЙ КОМАНДУ","Выбери «Запускать немедленно», добавь «Запустить быструю команду» и укажи созданную команду с обоями."],
      ["09","ПРОТЕСТИРУЙ","Один раз запусти команду вручную и проверь, что важные блоки не перекрываются часами и нижними кнопками iPhone."],
      ["10","ГОТОВО","Одна и та же ссылка ежедневно отдаёт новую картинку, сохраняя выбранный дизайн и настройки."]
    ],
    note: "Названия действий могут немного отличаться в разных версиях iOS. Нужна связка URL → Получить содержимое URL → Установить обои.",
    footer: "V.04 · НАСТРОЙКИ В URL · БЕЗ АККАУНТА · БЕЗ БАЗЫ"
  }
} as const;

function cleanHex(value:string,fallback:string){
  const v=value.replace("#","").trim();
  return /^[0-9A-Fa-f]{6}$/.test(v)?v.toUpperCase():fallback;
}
function luminance(hex:string){
  const v=cleanHex(hex,"000000");
  const rgb=[0,2,4].map(i=>parseInt(v.slice(i,i+2),16)/255).map(c=>c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4));
  return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
}
function contrastColor(bg:string){
  return luminance(bg)>.34?"111111":"F7F7F2";
}
function randomHex(){
  const h=Math.floor(Math.random()*360), s=45+Math.floor(Math.random()*45), l=22+Math.floor(Math.random()*58);
  const c=(1-Math.abs(2*l/100-1))*s/100, x=c*(1-Math.abs((h/60)%2-1)), m=l/100-c/2;
  let r=0,g=0,b=0;
  if(h<60)[r,g,b]=[c,x,0]; else if(h<120)[r,g,b]=[x,c,0]; else if(h<180)[r,g,b]=[0,c,x];
  else if(h<240)[r,g,b]=[0,x,c]; else if(h<300)[r,g,b]=[x,0,c]; else [r,g,b]=[c,0,x];
  const f=(n:number)=>Math.round((n+m)*255).toString(16).padStart(2,"0");
  return `${f(r)}${f(g)}${f(b)}`.toUpperCase();
}
function shuffle<T>(items:T[]){
  const a=[...items];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
function deviceShellType(id:string){
  if(["iphone14pro","iphone14promax","iphone15","iphone15plus","iphone15pro","iphone15promax","iphone16","iphone16plus","iphone16pro","iphone16promax","iphone17","iphone17air","iphone17pro","iphone17promax","iphone18pro","iphone18promax"].includes(id))return"island";
  if(id==="iphoneduo")return"duo";
  return"notch";
}

export default function Home(){
  const [siteLang,setSiteLang]=useState<Lang>("ru");
  const t=COPY[siteLang];
  const [device,setDevice]=useState("iphone11");
  const [background,setBackground]=useState("000000");
  const [primary,setPrimary]=useState("FFFFFF");
  const [lang,setLang]=useState<Lang>("ru");
  const [yearProgress,setYearProgress]=useState(true);
  const [progressMode,setProgressMode]=useState<ProgressMode>("days");
  const [birthdayEnabled,setBirthdayEnabled]=useState(true);
  const [birthday,setBirthday]=useState("1990-10-24");
  const [objectMode,setObjectMode]=useState<ObjectMode>("flowers");
  const [objectSize,setObjectSize]=useState<ObjectSize>("m");
  const [motivation,setMotivation]=useState(true);
  const [wordSize,setWordSize]=useState<ObjectSize>("m");
  const [dayEnabled,setDayEnabled]=useState(true);
  const [details,setDetails]=useState(true);
  const [frameStyle,setFrameStyle]=useState<FrameStyle>("corners");
  const [signature,setSignature]=useState<Signature>("logo");
  const [slots,setSlots]=useState<Record<ModuleKey,Slot>>({object:"tl",birthday:"tr",word:"bl",day:"br"});
  const [previewSeed,setPreviewSeed]=useState<number|null>(null);
  const [copied,setCopied]=useState(false);
  const [timeZone,setTimeZone]=useState("UTC");
  const [dragging,setDragging]=useState<ModuleKey|null>(null);
  const phoneRef=useRef<HTMLDivElement|null>(null);

  useEffect(()=>{try{setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone||"UTC")}catch{setTimeZone("UTC")}},[]);

  const birthdayMD=birthday?birthday.slice(5):"10-24";
  const selectedDevice=getDevice(device);
  const shellType=deviceShellType(device);

  const query=useMemo(()=>{
    return new URLSearchParams({
      device,bg:cleanHex(background,"000000"),fg:cleanHex(primary,"FFFFFF"),lang,
      year:yearProgress?"1":"0",yearMode:progressMode,
      birthday:birthdayEnabled?birthdayMD:"off",
      object:objectMode,objectSize,
      motivation:motivation?"1":"0",wordSize,
      day:dayEnabled?"1":"0",
      details:details?"1":"0",frame:frameStyle,signature,
      objectSlot:slots.object,birthdaySlot:slots.birthday,wordSlot:slots.word,daySlot:slots.day,
      tz:timeZone
    });
  },[device,background,primary,lang,yearProgress,progressMode,birthdayEnabled,birthdayMD,objectMode,objectSize,motivation,wordSize,dayEnabled,details,frameStyle,signature,slots,timeZone]);

  const permanentPath=`/api/wallpaper?${query.toString()}`;
  const previewPath=`${permanentPath}${previewSeed===null?"":`&seed=${previewSeed}`}`;

  const copyUrl=async()=>{await navigator.clipboard.writeText(`${window.location.origin}${permanentPath}`);setCopied(true);window.setTimeout(()=>setCopied(false),1400)};

  const moveModule=(key:ModuleKey,target:Slot)=>{
    const occupied=(Object.entries(slots) as [ModuleKey,Slot][]).find(([k,v])=>k!==key&&v===target);
    setSlots(prev=>{
      const next={...prev};
      if(occupied){next[occupied[0]]=prev[key]}
      next[key]=target;
      return next;
    });
  };

  const pointerMove=(e:React.PointerEvent<HTMLDivElement>)=>{
    if(!dragging||!phoneRef.current)return;
    const r=phoneRef.current.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
    const target:Slot=(y<.50?(x<.5?"tl":"tr"):(x<.5?"bl":"br"));
    moveModule(dragging,target);
  };

  const randomizeAll=()=>{
    const bg=randomHex();
    setBackground(bg); setPrimary(contrastColor(bg));
    setProgressMode(Math.random()>.5?"percent":"days");
    setObjectMode((["flowers","animals","geometry"] as ObjectMode[])[Math.floor(Math.random()*3)]);
    setObjectSize((["s","m","l"] as ObjectSize[])[Math.floor(Math.random()*3)]);
    setWordSize((["s","m","l"] as ObjectSize[])[Math.floor(Math.random()*3)]);
    setDetails(Math.random()>.25);
    setFrameStyle((["frame","corners","none"] as FrameStyle[])[Math.floor(Math.random()*3)]);
    setSignature((["logo","text","both","off"] as Signature[])[Math.floor(Math.random()*4)]);
    const s=shuffle(SLOTS);
    setSlots({object:s[0],birthday:s[1],word:s[2],day:s[3]});
    setPreviewSeed(Math.floor(Math.random()*1000000));
  };

  return <main className="shell">
    <header className="topbar">
      <div>DAILY SYSTEM®</div>
      <div className="topbarCenter">{t.navTitle}</div>
      <div className="headerRight">
        <span className="versionTag">V.05</span>
        <div className="headerActions"><button className={siteLang==="ru"?"langActive":""} onClick={()=>setSiteLang("ru")}>RU</button><span>/</span><button className={siteLang==="en"?"langActive":""} onClick={()=>setSiteLang("en")}>EN</button></div>
      </div>
    </header>

    <section className="heroGrid">
      <div className="intro"><div className="eyebrow">{t.eyebrow}</div><div><h1><strong>{t.heroA}</strong><br/><strong>{t.heroB}</strong></h1><p>{t.heroText}</p></div></div>
      <div className="previewPanel">
        <div className="panelLabel"><span>{t.livePreview}</span><span>{t.lock}</span></div>
        <div className="dragHint">{t.dragHint}</div>
        <div className="phoneStage">
          <div ref={phoneRef} className={`phone phone-${shellType}`} style={{aspectRatio:`${selectedDevice.width} / ${selectedDevice.height}`}}
            onPointerMove={pointerMove} onPointerUp={()=>setDragging(null)} onPointerCancel={()=>setDragging(null)}>
            <img src={previewPath} alt="Wallpaper preview"/>
            {shellType==="island"&&<div className="dynamicIsland"/>}
            {shellType==="notch"&&<div className="notch"/>}
            {shellType!=="duo"&&<>
              <div className="iosDate">{siteLang==="ru"?"СРЕДА, 24 СЕНТЯБРЯ":"WEDNESDAY, SEPTEMBER 24"}</div>
              <div className="iosClock">9:41</div>
              <div className="lockButtons">
                <span className="systemButton"><svg viewBox="0 0 24 24"><path d="M9 2h6l-1.6 6H17L7 22l2.5-9H6L9 2Z"/></svg></span>
                <span className="systemButton"><svg viewBox="0 0 24 24"><path d="M8 6l1.4-2h5.2L16 6h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3Zm4 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-2.2a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6Z"/></svg></span>
              </div>
              <div className="homeIndicator"/>
            </>}
            {objectMode!=="off"&&<DragHandle name="OBJECT" slot={slots.object} active={dragging==="object"} onDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setDragging("object")}}/>}
            {birthdayEnabled&&<DragHandle name="BIRTHDAY" slot={slots.birthday} active={dragging==="birthday"} onDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setDragging("birthday")}}/>}
            {motivation&&<DragHandle name="WORD" slot={slots.word} active={dragging==="word"} onDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setDragging("word")}}/>}
            {dayEnabled&&<DragHandle name="DAY" slot={slots.day} active={dragging==="day"} onDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);setDragging("day")}}/>}
          </div>
        </div>
      </div>
    </section>

    <section className="config">
      <div className="configTitle"><span>{t.configuration}</span><span>01—12</span></div>

      <SettingRow index="01" title={t.device}>
        <select value={device} onChange={e=>setDevice(e.target.value)}>{DEVICES.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select>
      </SettingRow>

      <SettingRow index="02" title={t.colorSystem}>
        <div className="colorGrid">
          <ColorPicker label={t.background} value={background} onChange={setBackground}/>
          <ColorPicker label={t.primary} value={primary} onChange={setPrimary}/>
        </div>
      </SettingRow>

      <SettingRow index="03" title={t.wallpaperLanguage}><Segment value={lang} onChange={v=>setLang(v as Lang)} options={[["ru","RU"],["en","EN"]]}/></SettingRow>

      <SettingRow index="04" title={t.frameStyle}>
        <Segment value={frameStyle} onChange={v=>setFrameStyle(v as FrameStyle)} options={[["frame",t.frame],["corners",t.corners],["none",t.none]]}/>
      </SettingRow>

      <SettingRow index="05" title={t.year}>
        <div className="stack">
          <Toggle value={yearProgress} onChange={setYearProgress} labels={[t.off,t.on]}/>
          {yearProgress&&<div className="subControl"><span>{t.value}</span><Segment value={progressMode} onChange={v=>setProgressMode(v as ProgressMode)} options={[["percent",t.percent],["days",t.daysMode]]}/></div>}
        </div>
      </SettingRow>

      <SettingRow index="06" title={t.object}>
        <div className="stack">
          <Segment value={objectMode} onChange={v=>setObjectMode(v as ObjectMode)} options={[["off",t.off],["flowers",t.flowers],["animals",t.animals],["geometry",t.geometry]]}/>
          {objectMode!=="off"&&<div className="subControl"><span>{t.size}</span><Segment value={objectSize} onChange={v=>setObjectSize(v as ObjectSize)} options={[["s","S"],["m","M"],["l","L"]]}/></div>}
        </div>
      </SettingRow>

      <SettingRow index="07" title={t.birthday}>
        <div className="stack"><Toggle value={birthdayEnabled} onChange={setBirthdayEnabled} labels={[t.off,t.on]}/>{birthdayEnabled&&<input type="date" value={birthday} onChange={e=>setBirthday(e.target.value)}/>}</div>
      </SettingRow>

      <SettingRow index="08" title={t.motivation}>
        <div className="stack"><Toggle value={motivation} onChange={setMotivation} labels={[t.off,t.on]}/>{motivation&&<div className="subControl"><span>{t.size}</span><Segment value={wordSize} onChange={v=>setWordSize(v as ObjectSize)} options={[["s","S"],["m","M"],["l","L"]]}/></div>}</div>
      </SettingRow>

      <SettingRow index="09" title={t.day}><Toggle value={dayEnabled} onChange={setDayEnabled} labels={[t.off,t.on]}/></SettingRow>
      <SettingRow index="10" title={t.details}><Toggle value={details} onChange={setDetails} labels={[t.off,t.on]}/></SettingRow>
      <SettingRow index="11" title={t.signature}>
        <Segment value={signature} onChange={v=>setSignature(v as Signature)} options={[["off",t.off],["logo",t.logo],["text",t.text],["both",t.both]]}/>
      </SettingRow>

      <SettingRow index="12" title={t.preview}>
        <div className="randomButtons">
          <button className="outlineButton" onClick={()=>setPreviewSeed(Math.floor(Math.random()*1000000))}>{t.randomizePreview}</button>
          <button className="solidButton" onClick={randomizeAll}>{t.randomizeAll}</button>
          <button className="outlineButton" onClick={()=>setSlots({object:"tl",birthday:"tr",word:"bl",day:"br"})}>{t.resetLayout}</button>
        </div>
      </SettingRow>
    </section>

    <section className="urlSection"><div><div className="eyebrow">{t.permanent}</div><h2><strong>{t.oneUrl}</strong><br/><strong>{t.newEveryDay}</strong></h2></div><div className="urlBox"><code>{permanentPath}</code><button onClick={copyUrl}>{copied?t.copied:t.copyUrl}</button></div></section>

    <section className="guideSection">
      <div className="configTitle"><span>{t.guide}</span><span>01—10</span></div>
      <div className="guideGrid guideGridTen">{t.steps.map(([num,title,body])=><article key={num} className="guideCard"><div className="guideNum">{num}</div><h3>{title}</h3><p>{body}</p></article>)}</div>
      <div className="guideNote">{t.note}</div>
    </section>

    <footer><span>DAILY SYSTEM® / 2026</span><span>{t.footer}</span></footer>
  </main>
}

function slotStyle(slot:Slot){
  const map:Record<Slot,React.CSSProperties>={
    tl:{left:"8%",top:"30%"}, tr:{right:"8%",top:"30%"},
    bl:{left:"8%",top:"69%"}, br:{right:"8%",top:"69%"}
  };
  return map[slot];
}
function DragHandle({name,slot,active,onDown}:{name:string;slot:Slot;active:boolean;onDown:(e:React.PointerEvent<HTMLButtonElement>)=>void}){
  return <button className={`dragHandle ${active?"dragActive":""}`} style={slotStyle(slot)} onPointerDown={onDown}>↕ {name}</button>
}
function SettingRow({index,title,children}:{index:string;title:string;children:React.ReactNode}){return <div className="settingRow"><div className="settingIndex">{index}</div><div className="settingTitle">{title}</div><div className="settingControl">{children}</div></div>}
function ColorPicker({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){
  const safe=cleanHex(value,"000000");
  return <div className="nativeColorPanel">
    <div className="colorPanelHead"><span>{label}</span><span className="colorValue">#{safe}</span></div>
    <label className="nativeColorTarget" style={{background:`#${safe}`}}>
      <input type="color" value={`#${safe}`} onInput={e=>onChange((e.currentTarget as HTMLInputElement).value.slice(1).toUpperCase())} onChange={e=>onChange(e.target.value.slice(1).toUpperCase())}/>
      <span>CLICK TO PICK COLOR</span>
    </label>
    <label className="hexRow"><span>#</span><input value={value} maxLength={6} onChange={e=>onChange(e.target.value.replace(/[^0-9a-fA-F]/g,"").slice(0,6).toUpperCase())}/></label>
  </div>
}
function Toggle({value,onChange,labels}:{value:boolean;onChange:(v:boolean)=>void;labels:[string,string]}){return <button className={`toggle ${value?"active":""}`} onClick={()=>onChange(!value)}><span>{value?labels[1]:labels[0]}</span><i/></button>}
function Segment({value,onChange,options}:{value:string;onChange:(v:string)=>void;options:[string,string][]}){return <div className="segment">{options.map(([id,label])=><button key={id} className={value===id?"active":""} onClick={()=>onChange(id)}>{label}</button>)}</div>}
