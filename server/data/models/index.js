import orm from "../db/connection";
import associate from "../db/associations";

const User = orm.import("./user");
const Post = orm.import("./post");
const PostReaction = orm.import("./post-reaction");
const CommentReaction = orm.import("./comment-reaction");
const Comment = orm.import("./comment");
const Image = orm.import("./image");

associate({
    User,
    Post,
    PostReaction,
    CommentReaction,
    Comment,
    Image
});

export {
    User as UserModel,
    Post as PostModel,
    PostReaction as PostReactionModel,
    CommentReaction as CommentReactionModel,
    Comment as CommentModel,
    Image as ImageModel
};
