import React from 'react'
import Card from 'react-bootstrap/Card';

const SleepCard = ({ sleeps }) => {

    const formatDate = (date) => {
      const dateAmOrPm = date.getHours() / 12 > 1 ? 'PM' : 'AM';

      let dateHour = date.getHours();
      if (dateHour === 0) dateHour = 12;
      else if (dateHour > 12) dateHour -= 12;

      let dateSecond = date.getSeconds().toString();
      if (dateSecond.length === 1) dateSecond = '0' + dateSecond;

      let dateMinute = date.getMinutes().toString();
      if (dateMinute.length === 1) dateMinute = '0' + dateMinute;

      return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}  ${dateHour}:${dateMinute}:${dateSecond} ${dateAmOrPm}`;
    }

    return (
        sleeps.map((sleep) => {
            const startDateStr = formatDate(new Date(sleep.startDate));            
            const endDateStr = formatDate(new Date(sleep.endDate));
            
            return (
                <Card style={{ width: '18rem', 'marginRight': '6%', 'marginBottom': '10%' }}>
                    <Card.Body>
                        <Card.Title>{sleep.title}</Card.Title>
                        <Card.Subtitle style={{ 'marginBottom': '10px'}}>{new Date(sleep.date).toDateString().replace(' ', ', ')}</Card.Subtitle>
                        <hr style={{ 'marginTop': '5px', 'marginBottom': '5px' }}/>
                        <Card.Text style={{ 'marginBottom': '5px'}}>
                            Start:  {startDateStr}
                        </Card.Text>
                        <hr style={{ 'marginTop': '5px', 'marginBottom': '5px' }}/>
                        <Card.Text style={{ 'marginBottom': '5px'}}>
                            End:  {endDateStr}
                        </Card.Text>
                        <hr style={{ 'marginTop': '5px', 'marginBottom': '5px' }}/>
                        <Card.Text>Comments</Card.Text>
                        <Card.Text>{sleep.comments}</Card.Text>
                    </Card.Body>
                </Card>
            )
        })
    );
}

export default SleepCard