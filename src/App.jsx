import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Input, Button, Form, Space, Table } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import firstFollow from "firstfollow";
import "./App.css";

function App() {
  const [columns, setColumns] = useState();
  const [data, setData] = useState([]);

  const click = (obj) => {
    console.log("obj", obj);

    const prod = {};
    const myGrammar =
      "E  -> T E' ; E'  -> + T E' | ε ; T  -> F T' ; T'  -> * F T' | ε ; F  -> id | ( E )";
    const { firstSet, followSet } = firstFollow(myGrammar);
    const nonTerminals = Object.keys(followSet);
    const firstKeys = Object.keys(firstSet);
    const terminals = [];
    firstKeys?.forEach((symbol) =>
      !nonTerminals?.includes(symbol) ? terminals.push(symbol) : null
    );
    console.log(firstSet);
    nonTerminals.forEach((nt) => {
      const followObj = followSet[nt];
      for (const key in followObj) {
        followObj[key] = `${nt} → ε`;
        followObj["$"] = `${nt} → ε`;
      }
      followSet[nt] = followObj;
    });

    console.log(followSet);

    console.log("terminals", terminals);

    console.log("non-terminals", nonTerminals);

    nonTerminals.forEach((nt) => {
      console.log("nt", nt);

      const nonTerminalFirstSet = Object.keys(firstSet[nt]);
      const epsilonFound = nonTerminalFirstSet.includes("");
      let filledColumns = { nonTerminal: nt };
      if (epsilonFound) {
        filledColumns = { ...filledColumns, ...followSet[nt] };
      }
      const concatRule = "";
      // obj[nt].forEach((rule) => concatRule + rule);
      // console.log(filledColumns);
      nonTerminalFirstSet.forEach(
        (keys) =>
          (filledColumns = {
            ...filledColumns,
            [keys]: `${nt} → ${concatRule}`,
          })
      );

      data.push(filledColumns);
      console.log("concat Rule", concatRule);

      // console.log(Object.keys(firstSet[nt]).includes("")?);
    });
    setData([...data]);

    // yahan masti kre ga bcz data Index ko Terminal rakhna F capital letter
    const columnTerminals = terminals?.map((terminal) => ({
      title: terminal,
      dataIndex: terminal,
      key: terminal,
    }));
    setColumns([
      { dataIndex: "nonTerminal", key: "nonTerminal" },
      ...columnTerminals,
      { title: "$", dataIndex: "$", key: "$" },
    ]);
  };

  const handleFinish = (body) => {
    const { grammar } = body;
    // for (const key in body) {
    //   console.log(body[key].split(" ")[0]);
    // }
    const changedGrammar = [];
    const obj = {};
    grammar.forEach(({ rule }, index) => {
      // console.log(rule, index);
      const prodRules = rule.split(/[->|]/);
      const nonTerminal = prodRules[0].trim();

      obj[nonTerminal] = prodRules.slice(2);
    });
    console.log(obj);

    // console.log(obj["F"].forEach((string)=>string.includes("id")));
    click(obj);
  };

  return (
    <>
      <Button onClick={click}>Click me</Button>
      <Form onFinish={handleFinish}>
        {/* <Form.Item name={"field1"}>
          <Input></Input>
        </Form.Item>
        <Form.Item name={"field2"}>
          <Input></Input>
        </Form.Item> */}
        <Form.List name="grammar">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "flex",
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "rule"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing Grammar",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Grammar" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button htmlType="submit" onClick={() => setData([])}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={data} />
    </>
  );
}

export default App;
