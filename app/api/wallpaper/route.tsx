import { ImageResponse } from "next/og";
import { getDevice } from "../../../lib/devices";
import { datePartsInZone, dayOfYear, daysUntilBirthday, isLeapYear } from "../../../lib/date";
import { getSprite, getSpriteName, SpriteCategory } from "../../../lib/sprites";
import { MOTIVATION } from "../../../lib/motivation";

export const runtime = "edge";

function cleanHex(value:string|null,fallback:string){
  const v=(value??"").replace("#","");
  return /^[0-9A-Fa-f]{6}$/.test(v)?`#${v}`:fallback;
}
function bool(value:string|null,fallback=false){if(value===null)return fallback;return value==="1"||value==="true"||value==="on";}
function num(value:string|null,fallback:number,min:number,max:number){
  const n=Number(value); return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;
}
function PixelSprite({matrix,color,px}:{matrix:number[][];color:string;px:number}){
  const active:{x:number;y:number}[]=[];matrix.forEach((row,y)=>row.forEach((v,x)=>{if(v)active.push({x,y})}));
  return <svg width={24*px} height={24*px} viewBox="0 0 24 24">{active.map(({x,y},i)=><rect key={i} x={x} y={y} width="1" height="1" fill={color}/>)}</svg>
}
function YearViz({style,progress,fg,scale}:{style:string;progress:number;fg:string;scale:number}){
  if(style==="ring"){
    const r=42, c=2*Math.PI*r, dash=c*progress/100;
    return <svg width={Math.round(150*scale)} height={Math.round(150*scale)} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke={fg} strokeOpacity=".2" strokeWidth="5"/>
      <circle cx="60" cy="60" r={r} fill="none" stroke={fg} strokeWidth="5" strokeDasharray={`${dash} ${c-dash}`} transform="rotate(-90 60 60)"/>
      <circle cx="60" cy="60" r="2" fill={fg}/>
    </svg>
  }
  if(style==="months"){
    const active=Math.max(0,Math.min(12,Math.ceil(progress/100*12)));
    return <div style={{display:"flex",gap:Math.max(4,Math.round(5*scale)),width:"100%",justifyContent:"center"}}>
      {Array.from({length:12},(_,i)=><div key={i} style={{display:"flex",width:Math.round(15*scale),height:Math.round(15*scale),border:`1px solid ${fg}`,background:i<active?fg:"transparent"}}/>)}
    </div>
  }
  return <div style={{display:"flex",gap:Math.max(2,Math.round(3*scale)),width:"100%",justifyContent:"center",alignItems:"flex-end"}}>
    {Array.from({length:40},(_,i)=>{
      const on=i/39<=progress/100; const h=Math.round((10+(i%5)*3)*scale);
      return <div key={i} style={{display:"flex",width:Math.max(2,Math.round(2*scale)),height:h,background:fg,opacity:on?1:.18}}/>
    })}
  </div>
}

export async function GET(request:Request){
  const {searchParams}=new URL(request.url);
  const device=getDevice(searchParams.get("device"));
  const bg=cleanHex(searchParams.get("bg"),"#000000"), fg=cleanHex(searchParams.get("fg"),"#FFFFFF");
  const lang=searchParams.get("lang")==="en"?"en":"ru";
  const yearEnabled=bool(searchParams.get("year"),true);
  const yearMode=searchParams.get("yearMode")==="days"?"days":"percent";
  const yearStyle=["ticks","ring","months"].includes(searchParams.get("yearStyle")??"")?searchParams.get("yearStyle")!:"ticks";
  const yearSize=["s","m","l"].includes(searchParams.get("yearSize")??"")?searchParams.get("yearSize")!:"l";
  const yearY=num(searchParams.get("yearY"),49,20,82);

  const birthday=searchParams.get("birthday")??"off";
  const birthdaySize=["s","m","l"].includes(searchParams.get("birthdaySize")??"")?searchParams.get("birthdaySize")!:"m";
  const birthdayY=num(searchParams.get("birthdayY"),69,20,82);

  const objectRaw=searchParams.get("object")??"flowers";
  const objectMode=(["flowers","animals","geometry"].includes(objectRaw)?objectRaw:null) as SpriteCategory|null;
  const objectSize=["s","m","l"].includes(searchParams.get("objectSize")??"")?searchParams.get("objectSize")!:"l";
  const objectY=num(searchParams.get("objectY"),60,20,82);

  const motivationEnabled=bool(searchParams.get("motivation"),true);
  const wordSize=["s","m","l"].includes(searchParams.get("wordSize")??"")?searchParams.get("wordSize")!:"l";
  const wordY=num(searchParams.get("wordY"),77,20,82);

  const details=bool(searchParams.get("details"),true);
  const alignRaw=searchParams.get("align")??"center";
  const align=(["left","center","right"].includes(alignRaw)?alignRaw:"center") as "left"|"center"|"right";
  const topSafe=num(searchParams.get("topSafe"),27,18,38);
  const bottomSafe=num(searchParams.get("bottomSafe"),18,12,28);
  const timeZone=searchParams.get("tz")||"UTC";

  let parts;try{parts=datePartsInZone(timeZone)}catch{parts=datePartsInZone("UTC")}
  const doy=dayOfYear(parts.year,parts.month,parts.day), totalDays=isLeapYear(parts.year)?366:365;
  const progress=Math.min(100,Math.max(0,doy/totalDays*100));
  const forcedSeed=Number(searchParams.get("seed"));
  const seed=Number.isFinite(forcedSeed)&&searchParams.has("seed")?Math.abs(Math.floor(forcedSeed)):doy+parts.year*997;
  const spriteIndex=seed%60, motivationIndex=(seed*7+11)%MOTIVATION.length;

  const scale=device.width/828, padX=Math.round(device.width*.075), linePx=Math.max(1,Math.round(scale));
  const alignItems=align==="left"?"flex-start":align==="right"?"flex-end":"center";
  const textAlign=align as any;
  const yClamp=(y:number)=>Math.max(topSafe+5,Math.min(100-bottomSafe-5,y));

  const yearFont={s:Math.round(44*scale),m:Math.round(60*scale),l:Math.round(82*scale)}[yearSize]!;
  const birthdayFont={s:Math.round(36*scale),m:Math.round(52*scale),l:Math.round(72*scale)}[birthdaySize]!;
  const wordFont={s:Math.round(40*scale),m:Math.round(58*scale),l:Math.round(78*scale)}[wordSize]!;
  const pxMap={s:Math.max(5,Math.round(6*scale)),m:Math.max(7,Math.round(9*scale)),l:Math.max(10,Math.round(12*scale))};

  const absBase=(y:number)=>({
    display:"flex",position:"absolute" as const,left:padX,right:padX,top:`${yClamp(y)}%`,
    transform:"translateY(-50%)",flexDirection:"column" as const,alignItems,gap:Math.round(12*scale),textAlign
  });

  const displayYear=yearMode==="days"?`${doy} / ${totalDays}`:`${Math.round(progress)}%`;

  return new ImageResponse(
    <div style={{display:"flex",width:"100%",height:"100%",position:"relative",background:bg,color:fg,fontFamily:"Arial, sans-serif",overflow:"hidden"}}>
      {details&&<>
        <div style={{display:"flex",position:"absolute",left:padX,top:`${Math.max(4,topSafe-19)}%`,fontSize:Math.round(11*scale),letterSpacing:"0.18em",opacity:.55}}>// DAILY_SYSTEM_</div>
        <div style={{display:"flex",position:"absolute",right:padX,top:`${Math.max(4,topSafe-19)}%`,fontSize:Math.round(11*scale),letterSpacing:"0.18em",opacity:.55}}>LOCK / {device.width}×{device.height}</div>
        <div style={{display:"flex",position:"absolute",left:padX,right:padX,top:`${topSafe}%`,height:linePx,background:fg,opacity:.13}}/>
        <div style={{display:"flex",position:"absolute",left:padX,right:padX,bottom:`${bottomSafe}%`,height:linePx,background:fg,opacity:.13}}/>
      </>}

      {yearEnabled&&<div style={absBase(yearY)}>
        <div style={{display:"flex",fontSize:Math.round(11*scale),letterSpacing:"0.18em",opacity:.65}}>{lang==="ru"?"// ПРОГРЕСС_ГОДА_":"// YEAR_PROGRESS_"}</div>
        <div style={{display:"flex",fontSize:yearFont,lineHeight:.85,fontWeight:700,letterSpacing:"-0.055em"}}>{displayYear}</div>
        <YearViz style={yearStyle} progress={progress} fg={fg} scale={scale}/>
      </div>}

      {objectMode&&<div style={absBase(objectY)}>
        <PixelSprite matrix={getSprite(objectMode,spriteIndex)} color={fg} px={pxMap[objectSize]}/>
        {details&&<div style={{display:"flex",fontSize:Math.round(10*scale),letterSpacing:"0.16em",opacity:.58}}>// {objectMode.toUpperCase()}_{String(spriteIndex+1).padStart(2,"0")} / {getSpriteName(objectMode,spriteIndex).toUpperCase()}</div>}
      </div>}

      {birthday!=="off"&&<div style={absBase(birthdayY)}>
        <div style={{display:"flex",fontSize:birthdayFont,lineHeight:.9,fontWeight:700,letterSpacing:"-0.05em"}}>{daysUntilBirthday(parts.year,parts.month,parts.day,birthday)}</div>
        <div style={{display:"flex",fontSize:Math.round(13*scale),letterSpacing:"0.18em"}}>{lang==="ru"?"ДНЕЙ ДО ДНЯ РОЖДЕНИЯ":"DAYS UNTIL BIRTHDAY"}</div>
      </div>}

      {motivationEnabled&&<div style={absBase(wordY)}>
        {details&&<div style={{display:"flex",fontSize:Math.round(10*scale),letterSpacing:"0.16em",opacity:.58}}>{lang==="ru"?"// СЛОВО_ДНЯ_":"// WORD_OF_THE_DAY_"}</div>}
        <div style={{display:"flex",fontSize:wordFont,lineHeight:.88,fontWeight:700,letterSpacing:"-0.05em"}}>{MOTIVATION[motivationIndex][lang==="ru"?0:1]}</div>
      </div>}

      {details&&<>
        <div style={{display:"flex",position:"absolute",left:padX,bottom:`${Math.max(2,bottomSafe-8)}%`,fontSize:Math.round(9*scale),letterSpacing:"0.18em",opacity:.45}}>{String(doy).padStart(3,"0")} / {parts.year}</div>
        <div style={{display:"flex",position:"absolute",right:padX,bottom:`${Math.max(2,bottomSafe-8)}%`,fontSize:Math.round(9*scale),letterSpacing:"0.18em",opacity:.45}}>+ {String(spriteIndex+1).padStart(2,"0")}</div>
      </>}
    </div>,
    {width:device.width,height:device.height}
  )
}
