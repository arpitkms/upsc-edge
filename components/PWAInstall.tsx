"use client";
import {useEffect,useState} from "react";
type InstallPromptEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed"}>};
export default function PWAInstall(){
 const [promptEvent,setPromptEvent]=useState<InstallPromptEvent|null>(null);
 const [installed,setInstalled]=useState(false);
 useEffect(()=>{
  const isStandalone=()=>window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator&{standalone?:boolean}).standalone===true;
  if(isStandalone()||localStorage.getItem("upsc-edge-installed")==="true")setInstalled(true);
  if("serviceWorker" in navigator)navigator.serviceWorker.register("/sw.js").catch(()=>{});
  const onPrompt=(event:Event)=>{event.preventDefault();if(!isStandalone())setPromptEvent(event as InstallPromptEvent);};
  const onInstalled=()=>{setInstalled(true);setPromptEvent(null);localStorage.setItem("upsc-edge-installed","true");};
  const onDisplayModeChange=()=>{if(isStandalone())onInstalled();};
  window.addEventListener("beforeinstallprompt",onPrompt);
  window.addEventListener("appinstalled",onInstalled);
  const media=window.matchMedia("(display-mode: standalone)");
  media.addEventListener?.("change",onDisplayModeChange);
  return()=>{window.removeEventListener("beforeinstallprompt",onPrompt);window.removeEventListener("appinstalled",onInstalled);media.removeEventListener?.("change",onDisplayModeChange);};
 },[]);
 const install=async()=>{
  if(!promptEvent){alert("To install UPSC Edge, open your browser menu and choose Install app or Add to Home screen.");return;}
  await promptEvent.prompt();
  const choice=await promptEvent.userChoice;
  setPromptEvent(null);
  if(choice.outcome==="accepted"){setInstalled(true);localStorage.setItem("upsc-edge-installed","true");}
 };
 if(installed)return null;
 return <button className="theme-toggle install-app-button" onClick={install}>↓ Install app</button>;
}
