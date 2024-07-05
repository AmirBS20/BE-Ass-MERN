import React, { useEffect, useState } from 'react';
import { Topic as TopicModel } from "../models/topics.model";
import * as TopicsAPI from "../network/topics_api";
import Topic from "../components/topics.component";
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import styles from "../styles/topicspage.module.css";
import styleUtils from "../styles/utils.module.css";
import { FaPlus } from "react-icons/fa";
import CreateEditTopicDialog from '../components/createedittopic.component';
import LogoutButton from '../components/logoutbutton.component';

export default function Topics() {
  const [topics, setTopics] = useState<TopicModel[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [showTopicsLoadingError, setShowTopicsLoadingError] = useState(false);
  const [showCreateTopicDialog, setShowCreateTopicDialog] = useState(false);
  const [topicToEdit, setTopicToEdit] = useState<TopicModel | null>(null);

  useEffect(() => {
    async function loadTopics() {
      try {
        setShowTopicsLoadingError(false);
        setTopicsLoading(true);
        const topics = await TopicsAPI.fetchTopics();
        setTopics(topics);
      } catch (error) {
        console.error(error);
        setShowTopicsLoadingError(true);
      } finally {
        setTopicsLoading(false);
      }
    }
    loadTopics();
  }, []);

  async function deleteTopic(topic: TopicModel) {
    try {
      await TopicsAPI.deleteTopic(topic._id);
      setTopics(topics.filter(existingTopic => existingTopic._id !== topic._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const topicsGrid =
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.topicGrid}`}>
      {topics.map(topic => (
        <Col key={topic._id}>
          <Topic
            topic={topic}
            className={styles.topic}
            onTopicClicked={(topic) => setTopicToEdit(topic)}
            onDeleteTopicClicked={deleteTopic}
          />
        </Col>
      ))}
    </Row>;

  return (
    <Container>
      <Button
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowCreateTopicDialog(true)}>
        <FaPlus />
        Contribute
      </Button>
      <LogoutButton />
      {topicsLoading && <Spinner animation="border" variant="primary" />}
      {showTopicsLoadingError && <p>You may refresh the page, as an error occurred.</p>}
      {!topicsLoading && !showTopicsLoadingError &&
        <>
          {topics.length > 0
            ? topicsGrid
            : <p>No topic has been created yet.</p>}
        </>
      }

      {showCreateTopicDialog &&
        <CreateEditTopicDialog
          onDismiss={() => setShowCreateTopicDialog(false)}
          onTopicSaved={(newTopic) => {
            setTopics([...topics, newTopic]);
            setShowCreateTopicDialog(false);
          }}
        />
      }

      {topicToEdit &&
        <CreateEditTopicDialog
          topicToEdit={topicToEdit}
          onDismiss={() => setTopicToEdit(null)}
          onTopicSaved={(updatedTopic) => {
            setTopics(topics.map(existingTopic => existingTopic._id === updatedTopic._id ? updatedTopic : existingTopic));
            setTopicToEdit(null);
          }}
        />
      }
    </Container>
  );
}
