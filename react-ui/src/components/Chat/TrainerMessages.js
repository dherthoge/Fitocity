import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { usePubNub } from 'pubnub-react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBTypography,
} from "mdb-react-ui-kit";
import axios from 'axios';
import './chat.css'
import Button from 'react-bootstrap/Button';
import SendIcon from '@material-ui/icons/Send';

function TrainerMessages() {
  const pubnub = usePubNub();
  const [channels] = useState([]);
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState('');
  const [list, setList] = useState([])
  const selector = useSelector(state => state.email)
  const [dataFromState, setDataFromState] = useState(selector)
  var fetchMessages = true

  const handleMessage = event => {
    const message = event.message;
    if (typeof message === 'string' || message.hasOwnProperty('text')) {
      const text = message.text || message;
      addMessage(messages => [...messages, text]);
    }
  };

  const sendMessage = message => {
    if (message) {
      pubnub
        .publish({ channel: channels[0], message })
        .then(() => setMessage(''));
    }
  };

  useEffect(() => {
    setDataFromState(selector)
    axios.get('/api/chat/trainerid', {params: {email: dataFromState}})
    .then((res) => {
        axios.get('/api/chat/trainerlist', { params: { chatWith: res.data.user } }).then((response) => {
          setList(response.data.list)
          console.log(response.data.list)
          channels[0] = response.data.list[0]._doc.conversationId
        }).catch((err) => {
          console.log(err)
        })
    }).catch((error) => {
      console.log(error)
    })
    
    pubnub.addListener({ message: handleMessage });
    pubnub.subscribe({ channels });
    if (fetchMessages) {
      pubnub.fetchMessages(
        {
          channels: [channels],
        },
        (status, response) => {
          if (response) {
            response.channels[channels].map((message, index) => {
              addMessage(messages => [...messages, message.message]);
            })
          }
          else {
            console.log("No chat")
          }
        }
      );
      fetchMessages = false
    }
  }, [pubnub, channels, fetchMessages]);

  const loadChat = (el) => {
    pubnub.removeListener({message: handleMessage})
    pubnub.unsubscribe({channels})
    addMessage([])
    channels[0] = el._doc.conversationId
    pubnub.addListener({ message: handleMessage });
    pubnub.subscribe({ channels });
    pubnub.fetchMessages(
      {
        channels: [el._doc.conversationId],
      },
      (status, response) => {
        if (response) {
          response.channels[channels].map((message, index) => {
            addMessage(messages => [...messages, message.message]);
          })
        }
        else {
          console.log("No chat")
        }
      }
    );
  }


  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
      <MDBRow>
        <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
          <h5 className="font-weight-bold mb-3 text-center text-lg-start">
            Member
          </h5>

          <MDBCard>
            <MDBCardBody>
              <MDBTypography listUnStyled className="mb-0">
                {list.map((el) => {
                  return (
                  <li onClick={() => loadChat(el)}
                    className="p-2 border-bottom listitemchat"
                    style={{ backgroundColor: "#eee",'cursor':'pointer' }}
                  >
                      <div className="d-flex flex-row">
                        <img
                          src={el.profileImage}
                          alt="avatar"
                          className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                          width="60"
                        />
                        <div className="pt-1">
                          <p className="fw-bold mb-0">{el.fullName}</p>
                        </div>
                      </div>
                  </li>
                  )
                })}
              </MDBTypography>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="6" lg="7" xl="8">
          <div style={pageStyles}>
            <div style={chatStyles}>
              <div style={headerStyles}>Chat</div>
              <div style={listStyles}>
                {messages.map((message, index) => {
                  return (
                    <div key={`message-${index}`} style={messageStyles}>
                      {message}
                    </div>
                  );
                })}
              </div>
              <div style={footerStyles}>
                <input
                  type="text"
                  style={inputStyles}
                  placeholder="Type your message"
                  value={message}
                  onKeyPress={e => {
                    if (e.key !== 'Enter') return;
                    sendMessage(message);
                  }}
                  onChange={e => setMessage(e.target.value)}
                />
                <Button variant="primary"
                  style={buttonStyles}
                  onClick={e => {
                    e.preventDefault();
                    sendMessage(message);
                  }}
                >
                  <SendIcon></SendIcon>
                </Button>
              </div>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

const pageStyles = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100vh',
  height: '100%',
  width: '100%'
};

const chatStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: '50vh',
  width: '50%',
  height: '100%',
  width: '100%'
};

const headerStyles = {
  background: '#323742',
  color: 'white',
  fontSize: '1.4rem',
  padding: '10px 15px',
};

const listStyles = {
  alignItems: 'flex-start',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto',
  padding: '10px',
  maxHeight: '615px'
};

const messageStyles = {
  backgroundColor: '#eee',
  borderRadius: '5px',
  color: '#333',
  fontSize: '1.1rem',
  margin: '5px',
  padding: '8px 15px',
};

const footerStyles = {
  display: 'flex',
};

const inputStyles = {
  flexGrow: 1,
  fontSize: '1.1rem',
  padding: '10px 15px',
};

const buttonStyles = {
  fontSize: '1.1rem',
  padding: '10px 15px',
};
export default TrainerMessages