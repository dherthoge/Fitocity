import React from 'react'
import Card from 'react-bootstrap/Card';

const MealCard = ({ meals }) => {
    return (
        meals.map((meal) => {
            return (
                <Card style={{ width: '18rem', 'marginRight': '6%', 'marginBottom': '10%' }}>
                    <Card.Body>
                        <Card.Title>{meal.title}</Card.Title>
                        <Card.Subtitle style={{ 'marginBottom': '10px'}}>{new Date(meal.date).toDateString()}</Card.Subtitle>
                        <hr style={{ 'marginTop': '5px', 'marginBottom': '5px' }}/>
                        <Card.Text style={{ 'marginBottom': '5px'}}>Calories: {meal.calories} cal</Card.Text>
                        <hr style={{ 'marginTop': '5px', 'marginBottom': '5px' }}/>
                        <Card.Text style={{ 'marginBottom': '5px'}}>Fat: {meal.fat} g</Card.Text>
                        <hr style={{ 'marginTop': '5px', 'marginBottom': '5px' }}/>
                        <Card.Text style={{ 'marginBottom': '5px'}}>Protein: {meal.protein} g</Card.Text>
                        <hr style={{ 'marginTop': '5px', 'marginBottom': '5px' }}/>
                        <Card.Text style={{ 'marginBottom': '5px'}}>Carbs: {meal.carbs} g</Card.Text>
                        <hr style={{ 'marginTop': '5px', 'marginBottom': '5px' }}/>
                        <Card.Text>Comments</Card.Text>
                        <Card.Text>{meal.comments}</Card.Text>
                    </Card.Body>
                </Card>
            )
        })
    );
}

export default MealCard