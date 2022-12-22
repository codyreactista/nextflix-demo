import { Roboto_Slab } from "@next/font/google";

import "@/styles/globals.css";

const robotoSlab = Roboto_Slab({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={robotoSlab.className}>
      <Component {...pageProps} />
    </div>
  );
}
