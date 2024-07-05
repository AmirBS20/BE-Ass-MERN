import { Topic } from "../models/topics.model";
import { TopicInput} from "../network/topics_api";
import {useForm} from "react-hook-form";
import * as TopicsAPI from "../network/topics_api"
import { Button, Form, Modal } from "react-bootstrap";

interface CreateEditTopicDialogProps {
    topicToEdit?: Topic
    onDismiss: () => void
    onTopicSaved: (topic: Topic) => void 
}

const CreateEditTopicDialog = ({topicToEdit, onDismiss, onTopicSaved }: CreateEditTopicDialogProps) => {

    const { register, handleSubmit, formState : { errors, isSubmitting}} = useForm<TopicInput>({
        defaultValues: {
            title: topicToEdit?.title || "", 
            text: topicToEdit?.text || ""
        }
    });

    async function onSubmit(input: TopicInput) {
        try {
            let topicResponse: Topic;
            if (topicToEdit) {
                topicResponse = await TopicsAPI.updateTopic(topicToEdit._id, input);
            } else {
                topicResponse = await TopicsAPI.createTopic(input);
            }
            onTopicSaved(topicResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
        <Modal.Header closeButton>
            <Modal.Title>
                {topicToEdit ? "Edit my topic" : "Contribute"}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form id="createEditTopicForm" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label >Title</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Title"
                    isInvalid={!!errors.title}
                    {...register("title", { required: "Required"})}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.title?.message}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Text"
                    {...register("text")}
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button
            type="submit"
            form="createEditTopicForm"
            disabled={isSubmitting}
            >
                Save
            </Button>
        </Modal.Footer>
    </Modal>

    );
}

export default CreateEditTopicDialog;