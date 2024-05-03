import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {ReactNode} from "react";
import {ToastContainer} from "react-toastify";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "AutoUpstall",
    description: "AutoUpstall",
};

export default function RootLayout({children}: Readonly<{ children: ReactNode; }>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        {children}
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        </body>
        </html>
    );
}
