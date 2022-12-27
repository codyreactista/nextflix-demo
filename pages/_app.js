import { Roboto_Slab } from "@next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Loading from "@/components/loading/loading";
import "@/styles/globals.css";

const robotoSlab = Roboto_Slab({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      <style jsx global>{`
        body {
          font-family: ${robotoSlab.style.fontFamily};
        }
      `}</style>
      {isLoading ? <Loading /> : <Component {...pageProps} />}
    </>
  );
}
