import React from 'react'
import Card from 'react-bootstrap/Card';
import { Player } from 'video-react';

const VideoCard = ({ videos }) => {

    return (
        videos.map((video) => {
            return (
                <Card style={{ width: '18rem', 'marginRight': '6%', 'marginBottom': '10%' }}>
                    <Card.Body>
                        <Card.Title>{video.title}</Card.Title>
                        <Player
                            playsInline
                            src={video.url}
                        />
                    </Card.Body>
                </Card>)
        })
    );
}

export default VideoCard