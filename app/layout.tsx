import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Tarkov Part Picker",
	description: "Search Escape From Tarkov community gun builds.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<main className="min-h-screen bg-[#4a473a]">{children}</main>
			</body>
		</html>
	);
}
