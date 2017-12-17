import React from 'react';
import TextTruncate from 'react-text-truncate';

import './Post.css';

const post = (props) => (
    <article className="Post card" onClick={props.clicked}>
        <div className="card-block">
            <h6 className="card-title mb-2 text-muted">{props.author}</h6>
            <TextTruncate className="card-text" line={2} truncateText="…" text={props.text} />
        </div>
    </article>
);

export default post;