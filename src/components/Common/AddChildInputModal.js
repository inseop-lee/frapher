import React, { useState, useEffect } from "react"
import { Modal, ModalBody, ModalFooter, ModalHeader, Input, Button, Label, FormGroup, Col } from "reactstrap"

function AddChildInputModal({ isOpen, parentId, onSubmit, addChildNode }) {
    const [modal, setModal] = useState(isOpen);
    const toggle = () => { setModal(!modal) }
    useEffect(() => { setModal(isOpen) }, [isOpen]);
    const [id,setId] = useState("");
    const [itemType,setItemType] = useState("control");
    const title = "Create New Child Node";
    const inputArray = [
        {title:"Node ID", id:"nodeId", name:"nodeId",type:"text",placeholder:"Input Node ID", value:parentId},
        {title:"Child ID",id:"childId", name:"childId",type:"text",placeholder:"Enter New Child ID"},
        {title:"Type",id:"childType", name:"childType", type:"select", options:["control","http"], defaultValue:"control"}
    ]
    
    const handleSubmit = (e) => {
        e.preventDefault();
        addChildNode(parentId,id,itemType);
        onSubmit();
    }
    return (
        <Modal isOpen={modal} toggle={toggle}>
            <form onSubmit={handleSubmit}>
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
                                        onChange={(e) => setId(e.target.value)}
                                    />}
                                {input.value && <Input value={input.value} readOnly />}
                                {input.type === "select" && 
                                    <Input type={input.type} id={input.id} name={input.id} onChange={(e) => setItemType(e.target.value)}>
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

export default AddChildInputModal;