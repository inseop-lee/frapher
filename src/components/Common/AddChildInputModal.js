import React, { useState, useEffect } from "react"
import { Form, Modal, Button,   Col } from "react-bootstrap"

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
                <Modal.Header toggle={toggle}>
                    {title}
                </Modal.Header>
                <Modal.Body>
                    {inputArray.map(input => (
                        <Form.Group row key={input.id}>
                            <Form.Label for={input.id} sm={3}>{input.title}</Form.Label>
                            <Col sm={9}>
                                {!input.value && input.type === "text" &&
                                    <Form.Control
                                        type={input.type}
                                        id={input.id}
                                        name={input.id}
                                        placeholder={input.placeholder}
                                        onChange={(e) => setId(e.target.value)}
                                    />}
                                {input.value && <Form.Control value={input.value} readOnly />}
                                {input.type === "select" && 
                                    <Form.Control type={input.type} id={input.id} name={input.id} onChange={(e) => setItemType(e.target.value)}>
                                        {input.options.map(option => (<option key={input.id+'_'+option}>{option}</option>))}
                                    </Form.Control>}
                            </Col>
                        </Form.Group>
                    ))}

                </Modal.Body>
                <Modal.Footer>
                <Button type="submit" color="primary">
                        Add
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </Modal.Footer>
                    

            </form>
        </Modal>
    );
}

export default AddChildInputModal;