import React, { useState, useEffect } from "react";
import Modal from "antd/es/modal/Modal";
function ModalInstructions({ isModalOpen, setIsModalOpen }) {
  const handleCancel = () => setIsModalOpen(false);
  const handleOk = () => handleCancel();

  const outerBullets = [
    "Nonterminals should be separated from their derivations by -> or →, ex:",
    "Multiple symbols should be separated by blank spaces, ex:",
    "Each set of rules must be in a newline and must not break into a new line, or optionally multiple sets of rules can be placed at same line as long as all of them, with the exception of the last one, are terminated by a semicolon (;), ex:",
    "Multiple derivations can be stated in the same line using the ''|'' separator",
    "For Epsilon derivations use ε, ϵ or leave the derivation empty:",
  ];

  const innerBullets = [
    ["A -> B", "B → y"],
    [
      "X → yOne yTwo y3",
      "yTwo → W thisIsConsideredAsingleSymbol",
      "W → those are considered five symbols",
    ],
    ["A → y w B", "B → C y; C → w"],
    ["A → w y | k | f"],
    ["A → B | ε", "B → | K", "B → j | ϵ", "K →"],
  ];

  return (
    <>
      <Modal
        title="Instructions"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ul>
          {outerBullets.map((outerBullet, index) => (
            <li>
              {outerBullet}
              <ul>
                {innerBullets[index].map((innerBullet) => (
                  <li>{innerBullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}

export default ModalInstructions;
