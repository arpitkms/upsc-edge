"use client";
import {useEffect,useState} from "react";
type InstallPromptEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed"}>};
export default function PWAInstall(){
 const [promptEvent,setPromptEvent]=useState<InstallPromptEvent|null>(null);
 const [installed,setInstalled]=useState(false);
 useEffect(()=>{
  if("serviceWorker" in navigator)navigator.serviceWorker.register("/sw.js").catch(()=>{});
  const onPrompt=(event:Event)=>{event.preventDefault();setPromptEvent(event as InstallPromptEvent);};
  const onInstalled=()=>{setInstalled(true);setPromptEvent(null);};
  window.addEventListener("beforeinstallprompt",onPrompt);
  window.addEventListener("appinstalled",onInstalled);
  return()=>{window.removeEventListener("beforeinstallprompt",onPrompt);window.removeEventListener("appinstalled",onInstalled);};
 },[]);
 const install=async()=>{
  if(!promptEvent){alert("To install UPSC Edge, open your browser menu and choose Install app or Add to Home screen.");return;}
  await promptEvent.prompt();
  const choice=await promptEvent.userChoice;
  if(choice.outcome==="accepted")setPromptEvent(null);
 };
 if(installed)return <span className="install-status">App installed</span>;
 return <button className="theme-toggle install-app-button" onClick={install}>↓ Install app</button>;
}
