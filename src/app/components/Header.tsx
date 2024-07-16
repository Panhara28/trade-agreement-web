'use client'

import React, { useEffect, useState } from 'react';
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
import Web3 from 'web3';
import { maskText } from '@/functions/maskText';

export default function Header(args: any) {
    const [account, setAccount] = useState(null);
    let accounts;
    let userAddress;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const web3: any = new Web3(window.ethereum);
    const toggle = () => setDropdownOpen((prevState) => !prevState)

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                accounts = await web3.eth.getAccounts();
                userAddress = accounts[0];
                setAccount(userAddress);

                window.ethereum.on('accountsChanged', async (accounts: any) => {
                    accounts = await web3.eth.getAccounts();
                    userAddress = accounts[0];
                    setAccount(userAddress);
                });

                window.ethereum.on('disconnect', () => {
                    console.log("Disconnected");
                    setAccount(null);
                })

            } catch (err) {
                console.log(err)
            }
        }

        fetchAccount().catch(console.error);
    }, [])


    const connectWallet = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            typeof window !== "undefined" && window.ethereum.request({ method: "eth_requestAccounts" }).catch((err: any) => {
                if (err.code === 4001) {
                    console.log("Please connect to metamask");
                } else {
                    console.log("Error", err)
                }
            })
        } else {
            console.log("No web 3 provider detected!")
        }
    }

    const disconnectWallet = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
            window.ethereum.request({
                method: "wallet_revokePermissions",
                params: [{
                    eth_accounts: {}
                }]
            }).then(() => {
                setAccount(null);
                console.log("Disconnected manually");
            }).catch((err: any) => {
                if (err.code === 4001) {
                    console.log('Please connect to metamask');
                } else {
                    console.log("Error", err);
                }
            });
        } else {
            console.log("No web 3 provider detected");
        }
    };


    return (
        <div>
            <Navbar {...args} style={{ background: "#3742fa" }}>
                <NavbarBrand href="/" className='text-white'>
                    <BiAnchor style={{ fontSize: 26 }} /> Trade Agreement
                </NavbarBrand>
                <Nav className='ms-auto'>
                    <NavItem>
                        {!account ? <><Button outline color='warning' onClick={connectWallet}>
                            <Image src="/metamask.webp" alt="" width={30} height={30} /> Connect Metamask
                        </Button></> : <>
                            <Dropdown isOpen={dropdownOpen} toggle={toggle} direction='down'>
                                <DropdownToggle color='warning' className='btn-outline'>
                                    <Image src="/metamask.webp" alt="" width={30} height={30} />
                                    <span className='ms-2'>{maskText(account)}</span>
                                </DropdownToggle>
                                <DropdownMenu className='w-100'>
                                    <DropdownItem header>Your profile <hr /></DropdownItem>
                                    <DropdownItem>
                                        {account ? <div onClick={disconnectWallet}>Disconnect</div> : <></>}
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

