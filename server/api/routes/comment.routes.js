import { Router } from "express";
import * as commentService from "../services/comment.service";

const router = Router();

router
    .get("/:id", (req, res, next) =>
        commentService
            .getCommentById(req.params.id)
            .then(comment => res.send(comment))
            .catch(next)
    )
    .post("/", (req, res, next) =>
        commentService
            .create(req.user.id, req.body) // user added to the request in the jwt strategy, see passport config
            .then(comment => res.send(comment))
            .catch(next)
    )
    .put("/react", (req, res, next) =>
        commentService
            .setCommentReaction(req.user.id, req.body) // user added to the request in the jwt strategy, see passport config
            .then(reaction => {
                if (
                    reaction.comment &&
                    reaction.comment.userId !== req.user.id
                ) {
                    // notify a user if someone (not himself) liked his post
                    req.io
                        .to(reaction.comment.userId)
                        .emit("like", "Your comment was liked!");
                }
                return res.send(reaction);
            })
            .catch(next)
    );

export default router;
