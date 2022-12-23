import { Roboto_Slab } from "@next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Loading from "@/components/loading/loading";
import { magic } from "@/lib/magic-client";
import "@/styles/globals.css";

const robotoSlab = Roboto_Slab({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        // route to /
        router.push("/");
      } else {
        // route to /login
        router.push("/login");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className={robotoSlab.className}>
      {isLoading ? <Loading /> : <Component {...pageProps} />}
    </div>
  );
}
