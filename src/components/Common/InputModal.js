import React, { useState, useEffect } from "react"
import { Modal, ModalBody, ModalFooter, ModalHeader, Input, Button, Label, FormGroup, Col } from "reactstrap"

function InputModal({ isOpen, title, inputArray, onSubmit }) {
    const [modal, setModal] = useState(isOpen);
    const toggle = () => { setModal(!modal) }
    useEffect(() => { setModal(isOpen) }, [isOpen]);
    return (
        <Modal isOpen={modal} toggle={toggle}>
            <form onSubmit={onSubmit}>
                <ModalHeader toggle={toggle}>
                    {title}
                </ModalHeader>
                <ModalBody>
                    {inputArray.map(input => (
                        <FormGroup row key={input.id}>
                            <Label for={input.id} sm={3}>{input.title}</Label>
                            <Col sm={9}>
                                {!input.value && input.type === "text" &&
                                    <Input
                                        type={input.type}
                                        id={input.id}
                                        name={input.id}
                                        placeholder={input.placeholder}
                                    />}
                                {input.value && <Input value={input.value} readOnly />}
                                {input.type === "select" && 
                                    <Input type={input.type} id={input.id} name={input.id}>
                                        {input.options.map(option => (<option key={input.id+'_'+option}>{option}</option>))}
                                    </Input>}
                            </Col>
                        </FormGroup>
                    ))}

                </ModalBody>
                <ModalFooter>
                    <Button type="submit" color="primary">
                        Add
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
}

export default InputModal;