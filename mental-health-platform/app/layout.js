import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'CalmSpace - Anonymous Mental Health Platform',
  description: '7th Sem Major Project MVP built inside 1 week',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen text-slate-800">
        <Navbar />
        <main className="py-6">{children}</main>
      </body>
    </html>
  );
}