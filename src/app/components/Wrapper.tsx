'use client';

import MetaMaskProvider from "@/providers";

export default function Wrapper({ children }: any) {
    return (
        <>
            <MetaMaskProvider>{children}</MetaMaskProvider>
        </>
    )
}