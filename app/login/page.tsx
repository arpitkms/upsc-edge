"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!configured) {
      setMessage("Authentication is not connected yet. Deployment environment variables still need to be configured.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.assign("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth/callback" },
        });
        if (error) throw error;
        setMessage(data.session ? "Account created. Redirecting…" : "Account created. Check your email to confirm your account, then sign in.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <main style={{minHeight:"100vh",display:"grid",gridTemplateColumns:"1.05fr .95fr",background:"#f5f7fb",fontFamily:"'DM Sans',sans-serif"}}>
    <section style={{background:"#111d34",color:"white",padding:"9vw 8vw",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
      <div><div style={{fontWeight:800,fontSize:22,letterSpacing:1}}>UPSC EDGE</div><div style={{color:"#94a5c4",fontSize:11,letterSpacing:2,marginTop:5}}>PREPARE WITH PRECISION</div></div>
      <div><div style={{color:"#9aafff",fontSize:11,letterSpacing:2,fontWeight:700}}>YOUR CSE 2028 WORKSPACE</div><h1 style={{fontSize:"clamp(32px,4vw,54px)",lineHeight:1.12,letterSpacing:-2,margin:"18px 0"}}>Make every question count.</h1><p style={{color:"#b2bfd3",lineHeight:1.8,maxWidth:420}}>Practise deliberately. Track every attempt. Turn weak areas into measurable progress.</p></div>
      <div style={{color:"#71819d",fontSize:11}}>PERSONAL PREPARATION · BUILT FOR CONSISTENCY</div>
    </section>
    <section style={{display:"grid",placeItems:"center",padding:24}}>
      <form onSubmit={submit} style={{width:"min(100%,420px)",background:"white",padding:36,borderRadius:18,border:"1px solid #e9edf4",boxShadow:"0 10px 40px #14233f0b"}}>
        <div style={{fontSize:11,color:"#65738b",letterSpacing:1.5,fontWeight:700}}>WELCOME TO UPSC EDGE</div>
        <h2 style={{fontSize:27,letterSpacing:-1,margin:"10px 0 7px",color:"#172033"}}>{mode === "signin" ? "Sign in to continue" : "Create your account"}</h2>
        <p style={{fontSize:13,color:"#7b8497",marginBottom:26}}>Your practice history and saved questions, in one place.</p>
        <label style={{display:"block",fontSize:12,fontWeight:600,marginBottom:7}}>Email address</label>
        <input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={fieldStyle}/>
        <label style={{display:"block",fontSize:12,fontWeight:600,margin:"17px 0 7px"}}>Password</label>
        <input required minLength={6} type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" style={fieldStyle}/>
        <button disabled={busy} type="submit" style={{width:"100%",marginTop:22,padding:13,border:0,borderRadius:9,background:"#4268e8",color:"white",fontWeight:700,cursor:"pointer"}}>{busy ? "Please wait…" : mode === "signin" ? "Sign in →" : "Create account →"}</button>
        {message && <p role="status" style={{fontSize:12,lineHeight:1.6,color:message.includes("not connected")?"#a56b21":"#52617a",background:"#f6f7fb",padding:11,borderRadius:8,marginTop:14}}>{message}</p>}
        <p style={{fontSize:12,color:"#7b8497",textAlign:"center",marginTop:22}}>{mode === "signin" ? "New to UPSC Edge? " : "Already have an account? "}<button type="button" onClick={()=>{setMode(mode==="signin"?"signup":"signin");setMessage("")}} style={{border:0,background:"none",color:"#4268e8",fontWeight:700,cursor:"pointer"}}>{mode === "signin" ? "Create account" : "Sign in"}</button></p>
        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:"#9aa2b0"}}><Link href="/" style={{textDecoration:"none",color:"#7b8497"}}>Return to workspace</Link></div>
      </form>
    </section>
  </main>;
}

const fieldStyle: React.CSSProperties = {width:"100%",padding:"12px 13px",border:"1px solid #e2e7f0",borderRadius:9,fontSize:13,outline:"none",boxSizing:"border-box"};
