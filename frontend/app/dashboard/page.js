// app/dashboard/page.js
"use client";
import LogsProvider from "../../components/three/logprovider";
import ThreeScene from "../../components/three/threeScene";
import SceneOverlay from "../../components/three/sceneOverlay";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../supabase/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();

  // Simple client-side guard
  useEffect(() => {
    let unsub;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/");
    });
    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/");
    });
    unsub = () => sub.data.subscription.unsubscribe();
    return () => unsub?.();
  }, [router]);

  return (
    <LogsProvider>
      <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
        <ThreeScene />
        <SceneOverlay />
      </div>
    </LogsProvider>
  );
}
