import { Button, Form, Input, Modal, Space } from "antd";
import React from "react";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

function ModalComponent({
  isModalOpen,
  setIsModalOpen,
  generateFirstFollowTable,
}) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (body) => {
    const { grammar } = body;

    const combineProdRulesForFirstFollow = grammar.reduce(
      (acc, { rule }) => acc + rule + ";",
      ""
    );

    const terminalProdRules = {};
    grammar.forEach(({ rule }) => {
      const prodRules = rule.split("->");
      const nonTerminal = prodRules[0].trim();

      terminalProdRules[nonTerminal] = prodRules
        .slice(1)
        .map((rule) => rule.trim());
    });

    generateFirstFollowTable(terminalProdRules, combineProdRulesForFirstFollow);

    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Define Grammar"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Parse Grammar"
      >
        <Form onFinish={handleFinish} form={form}>
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
                    Add Production Rule
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
}

export default ModalComponent;
