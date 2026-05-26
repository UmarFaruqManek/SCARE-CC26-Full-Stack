import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  //useLocation adalah hooks untuk mendeteksi perubahan URL/Rute
  const { pathname } = useLocation();

  useEffect(() => {
    // Setiap kali pathname (URL) berubah, paksa window scroll ke (0,0)
    window.scrollTo(0, 0);
  }, [pathname]); // 'pathname' adalah dependency array di sini

  // Komponen ini tidak merender apa-apa secara visual
  return null;
}