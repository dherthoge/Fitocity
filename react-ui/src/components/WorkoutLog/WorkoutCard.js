import React from 'react'
import Card from 'react-bootstrap/Card';

const WorkoutCard = ({ workouts }) => {

    return (
        workouts.map((workout) => {
            return (
                <Card style={{ width: '18rem', 'marginRight': '6%', 'marginBottom': '10%' }}>
                    <Card.Body>
                        <Card.Title>{workout.title}</Card.Title>
                        <Card.Subtitle style={{ 'marginBottom': '10px'}}>{new Date(workout.date).toDateString()}</Card.Subtitle>
                        <hr style={{ 'marginTop': '5px', 'marginBottom': '5px' }}/>
                        <Card.Text style={{ 'marginBottom': '5px'}}>Intensity: {workout.intensity}</Card.Text>
                        <hr style={{ 'marginTop': '5px', 'marginBottom': '5px' }}/>
                        <Card.Text style={{ 'marginBottom': '5px'}}>Category: {workout.category}</Card.Text>
                        <hr style={{ 'marginTop': '5px', 'marginBottom': '5px' }}/>
                        <Card.Text>Comments</Card.Text>
                        <Card.Text>{workout.comments}</Card.Text>
                    </Card.Body>
                </Card>)
        })
    );
}

export default WorkoutCard