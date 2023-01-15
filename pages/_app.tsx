// import '../styles/globals.css'
import "../components/Main.css";
import "../components/Links.module.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
