'use client';

import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle, Col, FormGroup, Input } from "reactstrap";
import Web3 from "web3";
import contractABI from '../abi/index.json';

export default function Item() {
    const [item, setItem] = useState({ itemName: "", amount: 0 });
    const [onOwnerAddressStatus, setOnOwnerAddressStatus] = useState(false);
    const [account, setAccount] = useState(null);
    const [onStatusBuy, setOnStatusBuy] = useState(false);
    const web3: any = new Web3(window.ethereum);
    const contractAddress = process.env.NEXT_PUBLIC_SC_ADDRESS;
    const contract = new web3.eth.Contract(contractABI, contractAddress)
    let accounts;
    let userAddress: any;

    useEffect(() => {

        const getAddressOwner = async () => {
            accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];
            const checkIfTheOwner = await contract.methods?.getAddressOwner(userAddress).call();

            try {
                setOnOwnerAddressStatus(checkIfTheOwner)
            } catch (error) {
                console.log(error);
            }
        }

        const fetchAccount = async () => {
            try {
                accounts = await web3.eth.getAccounts();
                userAddress = accounts[0];
                setAccount(userAddress);

                window.ethereum.on('accountsChanged', async (accounts: any) => {
                    accounts = await web3.eth.getAccounts();
                    userAddress = accounts[0];
                    setAccount(userAddress);
                    getAddressOwner().catch(console.error);

                })

                window.ethereum.on('disconnect', () => {
                    console.log('disconnect');
                    setAccount(null);
                    setOnOwnerAddressStatus(false);
                })
            } catch (error) {
                console.log(error)
            }
        }

        fetchAccount().catch(console.error);
    }, [])

    const onWantToBuy = () => {
        setOnStatusBuy(true)
        setItem({ itemName: "cars", amount: 0.0001 });
    }

    const onDeposit = () => {

    }

    const RenderLimbo = () => {
        return (
            <>
                <Card>
                    <CardBody>
                        <CardTitle tag="h5">
                            Lamborghini
                        </CardTitle>
                        <CardSubtitle
                            className="mb-2 text-muted"
                            tag="h6"
                        >
                            Haracan
                        </CardSubtitle>
                    </CardBody>
                    <img
                        alt="Card cap"
                        src="lamborghini-huracan.webp"
                        width="100%"
                    />
                    <CardBody>
                        <CardText>
                            The best lamborghini and speedy car in the universe
                        </CardText>
                        {
                            onStatusBuy ?
                                <>
                                    <FormGroup className="row">
                                        <Col md={9}>
                                            <Input type="number" value={item.amount} />
                                        </Col>
                                        <Col md={3}>
                                            <Button onClick={onDeposit}>Deposit</Button>
                                        </Col>
                                    </FormGroup>
                                </>
                                :
                                <>
                                    <Button color="primary" onClick={onWantToBuy}>
                                        Trade
                                    </Button>
                                </>
                        }

                    </CardBody>
                </Card>
            </>
        )
    }

    const RenderSeller = () => {
        return (
            <>
                <h3>Seller</h3>
                <p>Seller Address: {userAddress}</p>
                <hr />
                <Button>Accept Trade</Button>
            </>
        );
    }
    console.log("onOwnerAddressStatus", onOwnerAddressStatus)
    return (
        <>
            {onOwnerAddressStatus ? <RenderSeller /> : <RenderLimbo />}
        </>
    )
}