import commentRepository from "../../data/repositories/comment.repository";
import commentReactionRepository from "../../data/repositories/comment-reaction.repository";

export const getComments = filter => commentRepository.getComments(filter);

export const create = (userId, comment) =>
    commentRepository.create({
        ...comment,
        userId
    });

export const getCommentById = id => commentRepository.getCommentById(id);

export const setCommentReaction = async (
    userId,
    { commentId, isLike = true }
) => {
    // define the callback for future use as a promise
    const updateOrDelete = react =>
        react.isLike === isLike
            ? commentReactionRepository.deleteById(react.id)
            : commentReactionRepository.updateById(react.id, { isLike });

    const reaction = await commentReactionRepository.getCommentReaction(
        userId,
        commentId
    );

    const result = reaction
        ? await updateOrDelete(reaction)
        : await commentReactionRepository.create({ userId, commentId, isLike });

    let diff = 0;

    if (reaction) {
        if (reaction.isLike) {
            diff = { like: -1, dislike: isLike ? 0 : 1 };
        } else {
            diff = { like: isLike ? 1 : 0, dislike: -1 };
        }
    } else {
        diff = { like: isLike ? 1 : 0, dislike: isLike ? 0 : 1 };
    }

    // the result is an integer when an entity is deleted
    return Number.isInteger(result)
        ? { diff }
        : {
              diff: {
                  ...commentReactionRepository.getCommentReaction(
                      userId,
                      commentId
                  ),
                  ...diff
              }
          };
};
