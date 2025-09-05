import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import type { Tag } from "./App";
import { useLocalStorage } from "./useLocalStorage";

type EditTagsModalProps = {
    show: boolean
    availableTags: Tag[]
    handleClose: () => void
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string, label: string) => void
}

export function EditTagsModal({ 
    availableTags, 
    handleClose, 
    show,
    onDeleteTag,
    onUpdateTag 
}: EditTagsModalProps) {

    const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const [theme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light')

    return <>
        <Modal show={show} onHide={handleClose} data-theme={theme}>
            <Modal.Header>
                <Row className="align-items-center w-100">
                    <Col>
                        <Modal.Title>Edit Tags</Modal.Title>
                    </Col>
                    <Col xs="auto">
                        <Button onClick={handleClose}>
                            &times;
                        </Button>
                    </Col>
                </Row>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {availableTags.map(tag => (
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control 
                                        type="text" 
                                        value={tag.label} 
                                        onChange={e => onUpdateTag(
                                            tag.id,
                                            e.target.value
                                        )}
                                        />
                                </Col>
                                <Col xs="auto">
                                    <Button 
                                        variant="outline-danger"
                                        onClick={() => onDeleteTag(tag.id)}
                                    >
                                        &times;
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    </>
}