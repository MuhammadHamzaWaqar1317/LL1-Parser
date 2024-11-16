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

  const click = (terminalProdRules, myGrammar) => {
    const { firstSet, followSet } = firstFollow(myGrammar);
    const nonTerminals = Object.keys(followSet);
    const firstKeys = Object.keys(firstSet);
    const terminals = [];
    firstKeys?.forEach((symbol) =>
      !nonTerminals?.includes(symbol) ? terminals.push(symbol) : null
    );

    nonTerminals.forEach((nt) => {
      const followObj = followSet[nt];
      for (const key in followObj) {
        followObj[key] = `${nt} → ε`;
        followObj["$"] = `${nt} → ε`;
      }
      followSet[nt] = followObj;
    });

    nonTerminals.forEach((nt) => {
      const nonTerminalFirstSet = Object.keys(firstSet[nt]);
      const nonTerminalFollowSet = Object.keys(followSet[nt]);

      const createTableFirstSet = nonTerminalFirstSet.reduce(
        (acc, symbol, index) => {
          symbol = symbol == "" ? "ε" : symbol;
          if (index == nonTerminalFirstSet.length - 1) {
            return acc + symbol;
          }
          return acc + symbol + ",";
        },

        ""
      );

      const createTableFollowSet = nonTerminalFollowSet.reduce(
        (acc, symbol, index) =>
          index == nonTerminalFollowSet.length - 1
            ? acc + symbol
            : acc + symbol + ",",
        ""
      );

      const epsilonFound = nonTerminalFirstSet.includes("");
      let filledColumns = {
        nonTerminal: nt,
        firstSet: `{${createTableFirstSet}}`,
        followSet: `{${createTableFollowSet}}`,
      };
      if (epsilonFound) {
        filledColumns = { ...filledColumns, ...followSet[nt] };
      }

      const concatRule = terminalProdRules[nt].reduce(
        (acc, prodRules) => acc + prodRules,
        ""
      );

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
      { title: "First Set", dataIndex: "firstSet", key: "firstSet" },
      { title: "Follow Set", dataIndex: "followSet", key: "followSet" },
      ...columnTerminals,
      { title: "$", dataIndex: "$", key: "$" },
    ]);
  };

  const handleFinish = (body) => {
    const { grammar } = body;
    // for (const key in body) {
    //   console.log(body[key].split(" ")[0]);
    // }
    console.log(grammar);

    const myGrammar = grammar.reduce((acc, { rule }) => acc + rule + ";", "");
    console.log("myGrammar", myGrammar);

    const terminalProdRules = {};
    grammar.forEach(({ rule }, index) => {
      // console.log(rule, index);
      const prodRules = rule.split("->");
      const nonTerminal = prodRules[0].trim();

      terminalProdRules[nonTerminal] = prodRules
        .slice(1)
        .map((rule) => rule.trim());
    });
    console.log(terminalProdRules, "terminalProdRules handleFinish");

    // console.log(terminalProdRules["F"].forEach((string)=>string.includes("id")));
    click(terminalProdRules, myGrammar);
  };

  return (
    <>
      <Button onClick={click}>Click me</Button>
      <Form onFinish={handleFinish}>
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
