import { Col, Container, Row } from "reactstrap";
import Item from "./components/Item";

export default function Home() {
  return (
    <>
      <Container>
        <Row className="mt-4">
          <Col md={4}>
            <Item />
          </Col>
        </Row>
      </Container>
    </>
  );
}
