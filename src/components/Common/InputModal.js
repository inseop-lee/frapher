import React from "react";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";

function InputModal({ isOpen, onSubmit, onClose, data }) {
  const refMap = {};
  const inputArray = data ? data.inputArray : [];
  const title = data ? data.title : "";
  const type = data ? data.type : "";
  inputArray.forEach(input => (refMap[input.id] = React.createRef()));

  const handleSubmit = e => {
    e.preventDefault();
    const result = {};
    Object.keys(refMap).forEach(id => {
      result[refMap[id].current.attributes.id.value] =
        refMap[id].current.attributes.type.value === "checkbox"
          ? refMap[id].current.checked
          : refMap[id].current.value;
    });
    onSubmit(e, type, result);
  };

  const handleClose = e => {
    onClose(e);
  };

  return (
    <Modal show={isOpen} onHide={handleClose}>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>{title}</Modal.Header>
        <Modal.Body>
          {inputArray.map(input => (
            <Form.Group as={Row} key={input.id}>
              {input.type === "checkbox" ? (
                <Col sm="12">
                  <Form.Check
                    custom
                    id={input.id}
                    type={input.type}
                    label={input.title}
                    ref={refMap[input.id]}
                  />
                </Col>
              ) : (
                <>
                  <Form.Label column sm="3" htmlFor={input.id}>
                    {input.title}
                  </Form.Label>
                  <Col sm="9">
                    {!input.value && input.type === "text" && (
                      <Form.Control
                        type={input.type}
                        id={input.id}
                        name={input.id}
                        placeholder={input.placeholder}
                        defaultValue={input.defaultValue}
                        ref={refMap[input.id]}
                      />
                    )}
                    {input.value && (
                      <Form.Control value={input.value} readOnly />
                    )}
                    {input.type === "select" && (
                      <Form.Control
                        type={input.type}
                        id={input.id}
                        name={input.id}
                        ref={refMap[input.id]}
                      >
                        {input.options.map(option => (
                          <option key={input.id + "_" + option}>
                            {option}
                          </option>
                        ))}
                      </Form.Control>
                    )}
                  </Col>
                </>
              )}
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Submit</Button>
          <Button variant="danger" onClick={onClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default InputModal;
