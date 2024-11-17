import React, { useState } from "react";
import firstFollow from "firstfollow";
import { Button, Table } from "antd";
import ModalComponent from "../Components/ModalComponent";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColumns] = useState();
  const [data, setData] = useState([]);

  const generateFirstFollowTable = (terminalProdRules, combinedGrammar) => {
    const { firstSet, followSet } = firstFollow(combinedGrammar);
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

      nonTerminalFirstSet.forEach(
        (keys) =>
          (filledColumns = {
            ...filledColumns,
            [keys]: `${nt} → ${concatRule}`,
          })
      );

      data.push(filledColumns);
    });
    setData([...data]);
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

  return (
    <>
      <div className="max-h-[100vh] p-3">
        <div className="flex flex-col gap-3">
          <h1 className="text-blue-600 text-2xl text-center">LL1 Parser</h1>
          <Button className="self-end" onClick={() => setIsModalOpen(true)}>
            Add Grammar
          </Button>

          <ModalComponent
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            generateFirstFollowTable={generateFirstFollowTable}
          />
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    </>
  );
}

export default Home;
