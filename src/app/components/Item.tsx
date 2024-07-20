'use client';

import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle, Col, FormGroup, Input } from "reactstrap";
import Web3 from "web3";
import contractABI from '../abi/index.json';
import { useSDK } from "@metamask/sdk-react";

type Props = {
    sellerAddress?: string;
    buyerAccepted?: boolean;
    depositMade?: boolean;
    tradeCompeleted?: boolean;
}

export default function Item({ sellerAddress, buyerAccepted, depositMade, tradeCompeleted }: Props) {
    const { sdk, connected, connecting, account } = useSDK();

    const [item, setItem] = useState({ itemName: "", amount: 0 });
    const [onOwnerAddressStatus, setOnOwnerAddressStatus] = useState(false);
    const [onSellerAddress, setOnSellerAddress]: any = useState("");
    const [onBuyerAccept, setOnBuyerAccept] = useState<boolean | undefined>(buyerAccepted);
    const [onDepositMade, setOnDepositMade] = useState<boolean | undefined>(depositMade);
    const [onTradeComplete, setOnTradeComplete] = useState<boolean | undefined>(tradeCompeleted);

    let web3: any;
    let contract: any;

    if (typeof window !== 'undefined') {
        web3 = new Web3(window.ethereum);
        const contractAddress = process.env.NEXT_PUBLIC_SC_ADDRESS;
        contract = new web3.eth.Contract(contractABI, contractAddress);
    }

    let accounts: any;
    let userAddress: any;

    console.log("tradeCompeleted", tradeCompeleted);

    useEffect(() => {
        const fetchAccount = async () => {

            try {
                accounts = await web3.eth.getAccounts();
                userAddress = accounts[0];
                setOnSellerAddress(sellerAddress);
                setOnTradeComplete(tradeCompeleted);

                window.ethereum.on('accountsChanged', async (accounts: any) => {
                    accounts = await web3.eth.getAccounts();
                    userAddress = accounts[0];
                    setOnSellerAddress(sellerAddress);
                    setOnTradeComplete(tradeCompeleted);
                });

                window.ethereum.on('disconnect', () => {
                    console.log('disconnect');
                });
            } catch (error) {
                console.log(error);
            }

        }

        fetchAccount();
    }, [sellerAddress]);

    const acceptTrade = async () => {
        const accounts = await web3.eth.getAccounts();
        try {
            await contract.methods.acceptTradeAsBuyer().send({ from: accounts[0] });
            setOnBuyerAccept(true); // Update the state variable here
        } catch (err) {
            console.log("Error", err);
        }
    }

    const onDeposit = async () => {
        const accounts = await web3.eth.getAccounts();
        try {
            await contract.methods.deposit().send({ from: accounts[0], value: web3.utils.toWei('0.0001', 'ether') });
            setOnDepositMade(true); // Update the state variable here
        } catch (err) {
            console.log("Error", err);
        }
    }

    const onSellerAcceptTrade = async () => {
        const accounts = await web3.eth.getAccounts();
        try {
            await contract.methods.acceptTradeAsSeller().send({ from: accounts[0] });
            setOnTradeComplete(true); // Update the state variable here
        } catch (err) {
            console.log("Error", err);
        }
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
                        <CardText>Price: <b>0.0001</b> ETH</CardText>
                        <CardText>
                            The best lamborghini and speedy car in the universe
                        </CardText>
                        {
                            onTradeComplete ? <>
                                <Button color="success">The Trade Has Completed</Button>
                            </> : onBuyerAccept ?
                                <>
                                    <FormGroup className="row">
                                        <Col md={12}>
                                            {onDepositMade ? <Button color="warning">Deposit has been made</Button> : <Button onClick={onDeposit}>Pay for it</Button>}
                                        </Col>
                                    </FormGroup>
                                </>
                                :
                                <>
                                    <Button color="primary" onClick={acceptTrade}>
                                        Accept The Trade
                                    </Button>
                                </>
                        }
                    </CardBody>
                </Card>
            </>
        )
    }

    function SellerScreen() {
        return (
            <>
                <h4>Seller Accept Trade</h4>
                <hr />
                {onDepositMade ? onTradeComplete ? <><Button color="success" >The Trade Has Completed</Button></> : <><Button color="primary" onClick={onSellerAcceptTrade}>Accept</Button></> : <Button color="warning">The deposit hasn`t made yet!</Button>}
            </>
        )
    }

    return (
        <>
            {account?.toLocaleLowerCase() === onSellerAddress.toLocaleLowerCase() ? <Col md={6}><SellerScreen /></Col> : <Col md={4}><RenderLimbo /></Col>}
        </>
    )
}
