import { Card } from "react-bootstrap";
import {Topic as TopicModel} from "../models/topics.model";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";
import styles from "../styles/topics.module.css";
import styleUtils from "../styles/utils.module.css";


interface TopicProps {
    topic: TopicModel  
    onTopicClicked: (topic: TopicModel) => void
    onDeleteTopicClicked: (topic: TopicModel) => void
    className?: string
}

const Topic = ({ topic, onTopicClicked, onDeleteTopicClicked, className } : TopicProps) => {
    const {
        title,
        text,
        createdAt,
        updatedAt
    } = topic;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }

    return (
        <Card 
        className={`${styles.topicCard} ${className}`}
        onClick={() => onTopicClicked(topic)}>
            <Card.Body>
                <Card.Title className={styleUtils.flexCenter}>
                    {title}
                    <MdDelete
                        className="text-muted ms-auto"
                        onClick={(e) => {
                            onDeleteTopicClicked(topic);
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    {text}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )

}

export default Topic;