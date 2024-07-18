'use client'

import React, { useState } from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import Image from 'next/image';
import { BiAnchor } from 'react-icons/bi';
import { useSDK } from "@metamask/sdk-react";
import { formatAddress } from '@/libs/utils';

export default function Header(args: any) {
    const { sdk, connected, connecting, account } = useSDK();

    const connect = async () => {
        try {
            await sdk?.connect();
        } catch (err) {
            console.warn(`No accounts found`, err);
        }
    };

    const disconnect = () => {
        if (sdk) {
            sdk.terminate();
        }
    }

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState)

    return (
        <div>
            <Navbar {...args} style={{ background: "#3742fa" }}>
                <NavbarBrand href="/" className='text-white'>
                    <BiAnchor style={{ fontSize: 26 }} /> Trade Agreement
                </NavbarBrand>
                <Nav className='ms-auto'>
                    <NavItem>
                        {!connected ? <><Button outline color='warning' onClick={connect} disabled={connecting}>
                            <Image src="/metamask.webp" alt="" width={30} height={30} /> Connect Metamask
                        </Button></> : <>
                            <Dropdown isOpen={dropdownOpen} toggle={toggle} direction='down'>
                                <DropdownToggle color='warning' className='btn-outline'>
                                    <Image src="/metamask.webp" alt="" width={30} height={30} />
                                    <span className='ms-2'>{formatAddress(account)}</span>
                                </DropdownToggle>
                                <DropdownMenu className='w-100'>
                                    <DropdownItem header>Your profile <hr /></DropdownItem>
                                    <DropdownItem>
                                        {connected ? <div onClick={disconnect}>Disconnect</div> : <></>}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </>}
                    </NavItem>

                </Nav>
            </Navbar>
        </div>
    );
}

