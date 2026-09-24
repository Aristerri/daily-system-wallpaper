import { ImageResponse } from "next/og";
import { getDevice } from "../../../lib/devices";
import { datePartsInZone, dayOfYear, daysUntilBirthday, isLeapYear } from "../../../lib/date";
import { getSprite, getSpriteName, SpriteCategory } from "../../../lib/sprites";
import { MOTIVATION } from "../../../lib/motivation";

export const runtime = "edge";

type Slot = "tl" | "tr" | "bl" | "br";

function cleanHex(value:string|null,fallback:string){
  const v=(value??"").replace("#","");
  return /^[0-9A-Fa-f]{6}$/.test(v)?`#${v}`:fallback;
}
function bool(value:string|null,fallback=false){if(value===null)return fallback;return value==="1"||value==="true"||value==="on";}
function slot(value:string|null,fallback:Slot):Slot { return value==="tl"||value==="tr"||value==="bl"||value==="br" ? value : fallback; }

function PixelSprite({matrix,color,px}:{matrix:number[][];color:string;px:number}){
  const active:{x:number;y:number}[]=[];
  matrix.forEach((row,y)=>row.forEach((v,x)=>{if(v)active.push({x,y})}));
  return <svg width={24*px} height={24*px} viewBox="0 0 24 24">{active.map(({x,y},i)=><rect key={i} x={x} y={y} width="1" height="1" fill={color}/>)}</svg>
}

function NodeDot({fg,x,y}:{fg:string;x:string;y:string}){
  return <div style={{display:"flex",position:"absolute",left:x,top:y,width:"5px",height:"5px",borderRadius:"50%",background:fg,transform:"translate(-50%,-50%)"}}/>;
}

export async function GET(request:Request){
  const {searchParams}=new URL(request.url);
  const device=getDevice(searchParams.get("device"));
  const bg=cleanHex(searchParams.get("bg"),"#000000"), fg=cleanHex(searchParams.get("fg"),"#FFFFFF");
  const lang=searchParams.get("lang")==="en"?"en":"ru";
  const yearEnabled=bool(searchParams.get("year"),true);
  const yearMode=searchParams.get("yearMode")==="percent"?"percent":"days";
  const birthday=searchParams.get("birthday")??"off";
  const objectRaw=searchParams.get("object")??"flowers";
  const objectMode=(["flowers","animals","geometry"].includes(objectRaw)?objectRaw:null) as SpriteCategory|null;
  const objectSize=(["s","m","l"].includes(searchParams.get("objectSize")??"")?searchParams.get("objectSize")!:"m") as "s"|"m"|"l";
  const wordSize=(["s","m","l"].includes(searchParams.get("wordSize")??"")?searchParams.get("wordSize")!:"m") as "s"|"m"|"l";
  const motivationEnabled=bool(searchParams.get("motivation"),true);
  const details=bool(searchParams.get("details"),true);
  const timeZone=searchParams.get("tz")||"UTC";

  const objectSlot=slot(searchParams.get("objectSlot"),"tl");
  const birthdaySlot=slot(searchParams.get("birthdaySlot"),"tr");
  const wordSlot=slot(searchParams.get("wordSlot"),"bl");

  let parts;try{parts=datePartsInZone(timeZone)}catch{parts=datePartsInZone("UTC")}
  const doy=dayOfYear(parts.year,parts.month,parts.day), totalDays=isLeapYear(parts.year)?366:365;
  const progress=Math.min(100,Math.max(0,doy/totalDays*100));
  const forcedSeed=Number(searchParams.get("seed"));
  const seed=Number.isFinite(forcedSeed)&&searchParams.has("seed")?Math.abs(Math.floor(forcedSeed)):doy+parts.year*997;
  const spriteIndex=seed%60, motivationIndex=(seed*7+11)%MOTIVATION.length;

  const scale=device.width/828;
  const padX=Math.round(device.width*.065);
  const gap=Math.round(12*scale);
  const border=Math.max(1,Math.round(scale));
  const contentTop=Math.round(device.height*.28);
  const contentBottom=Math.round(device.height*.79);
  const contentHeight=contentBottom-contentTop;
  const sideBand=Math.round(contentHeight*.31);
  const centerBand=Math.round(contentHeight*.38);
  const bottomBand=contentHeight-sideBand-centerBand;
  const cellWidth=(device.width-padX*2-gap)/2;

  const slotMap:Record<Slot,{left:number;top:number;width:number;height:number}>={
    tl:{left:padX,top:contentTop,width:cellWidth,height:sideBand},
    tr:{left:padX+cellWidth+gap,top:contentTop,width:cellWidth,height:sideBand},
    bl:{left:padX,top:contentTop+sideBand+centerBand+gap,width:cellWidth,height:bottomBand-gap},
    br:{left:padX+cellWidth+gap,top:contentTop+sideBand+centerBand+gap,width:cellWidth,height:bottomBand-gap}
  };

  const pxMap:Record<"s"|"m"|"l",number>={
    s:Math.max(4,Math.round(5*scale)),m:Math.max(6,Math.round(7*scale)),l:Math.max(8,Math.round(9*scale))
  };
  const wordMap:Record<"s"|"m"|"l",number>={
    s:Math.round(29*scale),m:Math.round(38*scale),l:Math.round(48*scale)
  };

  const moduleBox=(s:Slot,children:React.ReactNode)=> {
    const p=slotMap[s];
    return <div style={{
      display:"flex",position:"absolute",left:p.left,top:p.top,width:p.width,height:p.height,
      border:`${border}px solid ${fg}`,padding:Math.round(16*scale),flexDirection:"column",justifyContent:"center",alignItems:"center",
      overflow:"hidden"
    }}>{children}</div>
  };

  const displayYear=yearMode==="percent"?`${Math.round(progress)}%`:`${doy} / ${totalDays}`;

  return new ImageResponse(
    <div style={{display:"flex",width:"100%",height:"100%",position:"relative",background:bg,color:fg,fontFamily:"Arial, sans-serif",overflow:"hidden"}}>
      {details&&<>
        <div style={{display:"flex",position:"absolute",left:padX,top:Math.round(device.height*.07),fontSize:Math.round(10*scale),letterSpacing:"0.18em",opacity:.58}}>// DAILY_SYSTEM_</div>
        <div style={{display:"flex",position:"absolute",right:padX,top:Math.round(device.height*.07),fontSize:Math.round(10*scale),letterSpacing:"0.18em",opacity:.58}}>LOCK / {device.width}×{device.height}</div>
      </>}

      {objectMode&&moduleBox(objectSlot,
        <>
          <PixelSprite matrix={getSprite(objectMode,spriteIndex)} color={fg} px={pxMap[objectSize]}/>
          {details&&<div style={{display:"flex",fontSize:Math.round(8*scale),letterSpacing:"0.12em",opacity:.58,marginTop:Math.round(10*scale),textAlign:"center"}}>// {objectMode.toUpperCase()}_{String(spriteIndex+1).padStart(2,"0")} / {getSpriteName(objectMode,spriteIndex).toUpperCase()}</div>}
        </>
      )}

      {birthday!=="off"&&moduleBox(birthdaySlot,
        <>
          <div style={{display:"flex",fontSize:Math.round(48*scale),lineHeight:.85,fontWeight:700,letterSpacing:"-0.05em"}}>{daysUntilBirthday(parts.year,parts.month,parts.day,birthday)}</div>
          <div style={{display:"flex",fontSize:Math.round(10*scale),letterSpacing:"0.13em",marginTop:Math.round(10*scale),textAlign:"center"}}>{lang==="ru"?"ДНЕЙ ДО ДНЯ РОЖДЕНИЯ":"DAYS UNTIL BIRTHDAY"}</div>
        </>
      )}

      {motivationEnabled&&moduleBox(wordSlot,
        <>
          {details&&<div style={{display:"flex",fontSize:Math.round(8*scale),letterSpacing:"0.13em",opacity:.58,marginBottom:Math.round(9*scale)}}>{lang==="ru"?"// СЛОВО_ДНЯ_":"// WORD_OF_THE_DAY_"}</div>}
          <div style={{display:"flex",fontSize:wordMap[wordSize],lineHeight:.9,fontWeight:700,letterSpacing:"-0.05em",textAlign:"center"}}>{MOTIVATION[motivationIndex][lang==="ru"?0:1]}</div>
        </>
      )}

      {yearEnabled&&<div style={{
        display:"flex",position:"absolute",left:padX,top:contentTop+sideBand+gap/2,width:device.width-padX*2,
        height:centerBand-gap,border:`${border}px solid ${fg}`,padding:`${Math.round(16*scale)}px ${Math.round(20*scale)}px`,
        flexDirection:"column",justifyContent:"center"
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",width:"100%"}}>
          <div style={{display:"flex",fontSize:Math.round(11*scale),letterSpacing:"0.16em"}}>{lang==="ru"?"ПРОГРЕСС ГОДА":"YEAR PROGRESS"}</div>
          <div style={{display:"flex",fontSize:Math.round(42*scale),lineHeight:.85,fontWeight:700,letterSpacing:"-0.05em"}}>{displayYear}</div>
        </div>
        <div style={{display:"flex",width:"100%",height:Math.max(4,Math.round(5*scale)),border:`${border}px solid ${fg}`,marginTop:Math.round(18*scale)}}>
          <div style={{display:"flex",width:`${progress}%`,height:"100%",background:fg}}/>
        </div>
        {details&&<div style={{display:"flex",justifyContent:"space-between",width:"100%",fontSize:Math.round(8*scale),letterSpacing:"0.13em",opacity:.48,marginTop:Math.round(10*scale)}}><span>001</span><span>{String(totalDays).padStart(3,"0")}</span></div>}
      </div>}

      {details&&<>
        <NodeDot fg={fg} x={`${padX}px`} y={`${contentTop}px`}/>
        <NodeDot fg={fg} x={`${device.width-padX}px`} y={`${contentTop}px`}/>
        <NodeDot fg={fg} x={`${padX}px`} y={`${contentBottom}px`}/>
        <NodeDot fg={fg} x={`${device.width-padX}px`} y={`${contentBottom}px`}/>
        <div style={{display:"flex",position:"absolute",left:padX,bottom:Math.round(device.height*.11),fontSize:Math.round(8*scale),letterSpacing:"0.17em",opacity:.42}}>{String(doy).padStart(3,"0")} / {parts.year}</div>
      </>}
    </div>,
    {width:device.width,height:device.height}
  )
}
