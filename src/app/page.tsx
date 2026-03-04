"use client";

import "../styles/landing.css";
import { useRouter } from "next/navigation";
import LandingPage from "../components/landing/LandingPage";
export default function Home() {
  const router = useRouter();
  return <LandingPage onLaunch={() => router.push("/app")} />;
}
