import "@/styles/globals.css";
// import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
// import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import store from "../redux/store";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {
  // const [supabase] = useState(() => createBrowserSupabaseClient());
  const getLayout = Component.getLayout || ((page) => page);

  const layout = () => {
    return getLayout(<Component {...pageProps} />);
  };

  return (
    <Provider store={store}>
      {layout()}
    </Provider>
  )
}
