import { Col, Container, Row } from "reactstrap";
import Item from "./components/Item";
import { getData } from "./data/getData";

export default async function Home() {
  const { sellerAddress, buyerAccepted, depositMade, tradeCompeleted }: any = await getData();
  console.log("tradeCompeleted", tradeCompeleted)
  return (
    <>
      <Container>
        <Row className="mt-4">
          <Item sellerAddress={sellerAddress} buyerAccepted={buyerAccepted} depositMade={depositMade} tradeCompeleted={tradeCompeleted} />
        </Row>
      </Container>
    </>
  );
}
