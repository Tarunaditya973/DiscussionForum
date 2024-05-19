import React from "react";

const PostItem = ({ post }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{post.content}</h5>
        <p className="card-text">Author: {post.author.name}</p>
        <p className="card-text">
          Created At: {new Date(post.createdAt).toLocaleString()}
        </p>
        <div className="card-text">
          <h6>Comments:</h6>
          <ul className="list-group">
            {post.comments.map((comment) => (
              <li key={comment._id} className="list-group-item">
                {comment.content} - {comment.author.name}
              </li>
            ))}
          </ul>
        </div>
        {post.media.length > 0 && (
          <div className="card-text">
            <h6>Media:</h6>
            {post.media.map((media, index) => (
              <div key={index}>
                <p>Type: {media.type}</p>
                <p>URL: {media.url}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;
