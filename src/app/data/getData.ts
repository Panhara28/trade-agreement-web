import Web3 from "web3";
import contractABI from './../abi/index.json';
import { revalidatePath } from "next/cache";

export async function getData() {

    const contractAddress = process.env.NEXT_PUBLIC_SC_ADDRESS;
    const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/9d79d174fd6043f5913d0aba37f3e031'));
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const sellerAddress: string = await contract.methods.sellerAddress().call();
    const buyerAccepted: boolean = await contract.methods.buyerAccepted().call();
    const depositMade: boolean = await contract.methods.depositMade().call();
    const tradeCompeleted: boolean = await contract.methods.tradeCompeleted().call();
    revalidatePath('/')
    return { sellerAddress, buyerAccepted, depositMade, tradeCompeleted }
}