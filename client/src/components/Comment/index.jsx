import React from "react";
import PropTypes from "prop-types";
import { Comment as CommentUI, Label, Icon } from "semantic-ui-react";
import moment from "moment";
import { getUserImgLink } from "src/helpers/imageHelper";

import styles from "./styles.module.scss";

const Comment = ({ comment, likeComment }) => {
    const { id, body, createdAt, user, likeCount, dislikeCount } = comment;
    const date = moment(createdAt).fromNow();
    return (
        <CommentUI className={styles.comment}>
            <CommentUI.Avatar src={getUserImgLink(user.image)} />
            <CommentUI.Content>
                <CommentUI.Author as="a">{user.username}</CommentUI.Author>
                <CommentUI.Metadata>{date}</CommentUI.Metadata>
                <CommentUI.Text>{body}</CommentUI.Text>
                <Label
                    basic
                    size="small"
                    as="a"
                    className={styles.toolbarBtn}
                    onClick={() => likeComment(id, true)}
                >
                    <Icon name="thumbs up" />
                    {likeCount}
                </Label>
                <Label
                    basic
                    size="small"
                    as="a"
                    className={styles.toolbarBtn}
                    onClick={() => likeComment(id, false)}
                >
                    <Icon name="thumbs down" />
                    {dislikeCount}
                </Label>
            </CommentUI.Content>
        </CommentUI>
    );
};

Comment.propTypes = {
    comment: PropTypes.objectOf(PropTypes.any).isRequired,
    likeComment: PropTypes.func.isRequired
};

export default Comment;
