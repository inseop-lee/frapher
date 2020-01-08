import { cloneDeep, mapValues } from 'lodash'
import React from 'react';
import { Container, Row, Col } from 'reactstrap'
import { FlowChart } from "@mrblenny/react-flow-chart";
import * as actions from './container/actions'
import 'bootstrap/dist/css/bootstrap.css'

import './App.css';



class App extends React.Component {
    constructor(props) {
        super(props)
        const chart = {
            offset: {
                x: 0,
                y: 0
            },
            nodes: {
                node1: {
                    id: "node1",
                    type: "left-right",
                    position: {
                        x: 100,
                        y: 300
                    },
                    ports: {
                        port2: {
                            id: "port2",
                            type: "right"
                        }
                    }
                },
                node2: {
                    id: "node2",
                    type: "left-right",
                    position: {
                        x: 500,
                        y: 400
                    },
                    ports: {
                        port1: {
                            id: "port1",
                            type: "left"
                        },
                        port2: {
                            id: "port2",
                            type: "right"
                        }
                    }
                },
            },
            links: {
                link1: {
                    id: "link1",
                    from: {
                        nodeId: "node1",
                        portId: "port2"
                    },
                    to: {
                        nodeId: "node2",
                        portId: "port1"
                    },
                },
            },
            selected: {},
            hovered: {}
        };
        this.state = cloneDeep(chart)
    }

    NodeInnerCustom = ({ node, config }) => {
        
        return (
            <div style={{padding: "10px 10px"}}>{node.id}</div>
        )
    }



    render() {
        const chart = this.state
        const stateActions = mapValues(actions, (func) =>
            (...args) => this.setState(func(...args)));

        return (
            <Container id="container">
                <Row>
                    <Col md="8" id="section">
                        <FlowChart
                            chart={chart}
                            callbacks={stateActions}
                            Components={{
                                NodeInner: this.NodeInnerCustom,
                            }}
                        />
                    </Col>
                    <Col md="4" id="aside">
                        {chart.selected.type ?
                            <h1>{chart.selected.id}</h1> :
                            <h1>not selected</h1>}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;
