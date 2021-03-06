import * as postService from "src/services/postService";
import * as commentService from "src/services/commentService";
import {
    ADD_POST,
    LOAD_MORE_POSTS,
    SET_ALL_POSTS,
    SET_EXPANDED_POST,
    SET_ALL_COMMENTS
} from "./actionTypes";

const setPostsAction = posts => ({
    type: SET_ALL_POSTS,
    posts
});

const setCommentsAction = comments => ({
    type: SET_ALL_COMMENTS,
    comments
});

const addMorePostsAction = posts => ({
    type: LOAD_MORE_POSTS,
    posts
});

const addPostAction = post => ({
    type: ADD_POST,
    post
});

const setExpandedPostAction = post => ({
    type: SET_EXPANDED_POST,
    post
});

export const loadPosts = filter => async dispatch => {
    const posts = await postService.getAllPosts(filter);
    dispatch(setPostsAction(posts));
};

export const loadMorePosts = filter => async (dispatch, getRootState) => {
    const {
        posts: { posts }
    } = getRootState();
    const loadedPosts = await postService.getAllPosts(filter);
    const filteredPosts = loadedPosts.filter(
        post => !(posts && posts.some(loadedPost => post.id === loadedPost.id))
    );
    dispatch(addMorePostsAction(filteredPosts));
};

export const applyPost = postId => async dispatch => {
    const post = await postService.getPost(postId);
    dispatch(addPostAction(post));
};

export const addPost = post => async dispatch => {
    const { id } = await postService.addPost(post);
    const newPost = await postService.getPost(id);
    dispatch(addPostAction(newPost));
};

export const toggleExpandedPost = postId => async dispatch => {
    const post = postId ? await postService.getPost(postId) : undefined;
    dispatch(setExpandedPostAction(post));
};

export const likePost = (postId, isLike) => async (dispatch, getRootState) => {
    const { diff } = await postService.likePost(postId, isLike);
    let { like, dislike } = diff;

    const mapLikes = post => ({
        ...post,
        likeCount: Number(post.likeCount) + like,
        dislikeCount: Number(post.dislikeCount) + dislike
    });

    const {
        posts: { posts, expandedPost }
    } = getRootState();
    const updated = posts.map(post =>
        post.id !== postId ? post : mapLikes(post)
    );

    dispatch(setPostsAction(updated));

    if (expandedPost && expandedPost.id === postId) {
        dispatch(setExpandedPostAction(mapLikes(expandedPost)));
    }
};

export const likeComment = (commentId, isLike) => async (
    dispatch,
    getRootState
) => {
    const { diff } = await commentService.likeComment(commentId, isLike);
    let { like, dislike } = diff;

    const mapComment = comment => ({
        ...comment,
        likeCount: Number(comment.likeCount) + like,
        dislikeCount: Number(comment.dislikeCount) + dislike
    });
};

export const addComment = request => async (dispatch, getRootState) => {
    const { id } = await commentService.addComment(request);
    const comment = await commentService.getComment(id);

    const mapComments = post => ({
        ...post,
        commentCount: Number(post.commentCount) + 1,
        comments: [...(post.comments || []), comment] // comment is taken from the current closure
    });

    const {
        posts: { posts, expandedPost }
    } = getRootState();
    const updated = posts.map(post =>
        post.id !== comment.postId ? post : mapComments(post)
    );

    dispatch(setPostsAction(updated));

    if (expandedPost && expandedPost.id === comment.postId) {
        dispatch(setExpandedPostAction(mapComments(expandedPost)));
    }
};
