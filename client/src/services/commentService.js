import callWebApi from "src/helpers/webApiHelper";

export const addComment = async request => {
    const response = await callWebApi({
        endpoint: "/api/comments",
        type: "POST",
        request
    });
    return response.json();
};

export const getComment = async id => {
    const response = await callWebApi({
        endpoint: `/api/comments/${id}`,
        type: "GET"
    });
    return response.json();
};

export const likeComment = async (commentId, isLike) => {
    const response = await callWebApi({
        endpoint: "/api/comments/react",
        type: "PUT",
        request: {
            commentId,
            isLike
        }
    });
    return response.json();
};
