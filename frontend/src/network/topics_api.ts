import { Topic } from "../models/topics.model";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function fetchTopics(): Promise<Topic[]> {
    const response = await fetchData("/api/topics", { method: "GET"});
    return response.json();
}

export interface TopicInput {
    title: string,
    text?: string
}

export async function createTopic(topic: TopicInput): Promise<Topic> {
    const response = await fetchData("/api/topics",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(topic)
        });
        return response.json(); 
}

export async function updateTopic(topicId: string, topic: TopicInput): Promise<Topic> {
    const response = await fetchData("/api/topics/" + topicId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(topic)
        }
    );
    return response.json();
}

export async function deleteTopic(topicId: string) {
    await fetchData("/api/topics/" + topicId, {method: "DELETE"});
}
