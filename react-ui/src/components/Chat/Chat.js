// import {React,useEffect,useState} from "react";
// import { useSelector } from 'react-redux';
// import { Link, useNavigate } from "react-router-dom";
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css';
// import Button from '@material-ui/core/Button';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// //import './Chat.scss'
// import { LinearProgress } from '@material-ui/core';
// import ChatMessagesData from "./ChatMessages.json"


// const Chat=()=> {
//     let mfaRequired = localStorage.getItem('mfaRequired');
//   const navigate = useNavigate();
//   const selector = useSelector(state => state.email)
//   const role = useSelector(state => state.role)
//   const [userEmail, setUserEmail] = useState('')
//   const [userFullName, setUserFullName] = useState('')
//   const [userPhone, setUserPhone] = useState('')
//   const [userCity, setUserCity] = useState('')
//   const [userImage, setUserImage] = useState('')
//   const [mfaQrCodeUrl, setMfaQrCodeUrl] = useState('')
//   const [mfaSecret, setMfaSecret] = useState('')
//   const [dataFromState, setDataFromState] = useState(selector)
//   const [dataFromStateRole, setDataFromStateRole] = useState(role)
//   const [trainerDetails, setTrainerDetails] = useState('')
//   const [status, setStatus] = useState('todo')
//   const [videos, setVideos] = useState([])
//   const [varyingModal, setVaryingModal] = useState(false);
//   const [videoTitle, setVideoTitle] = useState('')
//   const [varyingUpload, setVaryingUpload] = useState(false)
//   const [hidden, setHidden] = useState(true)
//   const [chats,setChats]=useState([]);
//   // Auth token and refresh token state
//   const existingAuthtoken = localStorage.getItem('authToken') || '';
//   const [authToken] = useState(existingAuthtoken);

//   //const toast = useToast();

//   const fetchChats = async () => {
//     // console.log(user._id);
//     // try {
//     //   const { data } = await axios.get("/api/message/6372749b58eadcce62d32c19");
//     //   console.log(data);
//     //   setChats(data);
//     //   console.log(chats);
//     // } catch (error) {
//     //   console.log(error);
//     // }
//   };

//   useEffect(() => {
//     // axios.get("/api/message/6372749b58eadcce62d32c19")
//     // .then((res)=>{
//     //   console.log(res.data);
//     //   setChats(res.data);
//     //   console.log(chats);
//     // })
//     fetchChats();
//   },[authToken, dataFromState, mfaRequired, selector, setMfaQrCodeUrl, dataFromStateRole, role]); 


//     return (
//         // <div>
//         //    <h1>Hey</h1>
//         // </div>
//         <div class='container'>
//           <h1>Chat with trainer LKK</h1>
//             <div class='chatbox'>
//               <div class="chatbox__messages">
//                 <div class="chatbox__messages__user-message">
//                   <div class="chatbox__messages__user-message--ind-message">
//                     {ChatMessagesData.map((item)=>(
//                       <li key={item.id}>
//                         <p>{item.Name}</p>
//                         <p>{item.content}</p></li>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//           </div>
//           <form>
//             <input type="text" placeholder="Enter your message"/>
//           </form>
//         </div>
//         // <ul>
//         //     {ChatMessagesData.map((item) => (
//         //         <li key={item.id}>{item.content}</li>
//         //     ))}
//         // </ul>
//     )
// }

// export default Chat;
import React, { useState, useEffect } from 'react'
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
import { useLocation } from 'react-router-dom';
import './chat.css'
import Button from 'react-bootstrap/Button';
import SendIcon from '@material-ui/icons/Send';

function Chat() {
  const location = useLocation();
  const conversationId = location.state.conversationId
  const userId = location.state.userId
  const pubnub = usePubNub();
  const [channels] = useState([conversationId]);
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState('');
  const [list, setList] = useState([])
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
    axios.get('/api/chat/list', { params: { userId: userId } }).then((response) => {
      setList(response.data.list)
    }).catch((err) => {
      console.log(err)
    })
    pubnub.addListener({ message: handleMessage });
    pubnub.subscribe({ channels });
    if(fetchMessages) {
      pubnub.fetchMessages(
        {
          channels: [conversationId],
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
    channels[0] = el.conversationId
    pubnub.addListener({ message: handleMessage });
    pubnub.subscribe({ channels });
    pubnub.fetchMessages(
      {
        channels: [el.conversationId],
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
                {list.length > 0 ? list.map((el) => {
                  return (
                  <li onClick={() => loadChat(el)}
                    className="p-2 border-bottom listitemchat"
                    style={{ backgroundColor: "#eee",'cursor':'pointer' }}
                  >
                      <div className="d-flex flex-row">
                        <img
                          src={el.chatWith.profileImage}
                          alt="avatar"
                          className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                          width="60"
                        />
                        <div className="pt-1">
                          <p className="fw-bold mb-0">{el.chatWith.fullName}</p>
                        </div>
                      </div>
                  </li>
                  )
                }): ""}
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
export default Chat