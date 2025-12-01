import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "AI Document Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
