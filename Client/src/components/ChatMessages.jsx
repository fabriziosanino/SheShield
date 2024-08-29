import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserMd, faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

import '../App.css';
import API from '../API';

const ChatMessages = (props) => {
  const messagesEndRef = useRef(null);
  const [newMessage, setNewmessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [dirty, setDirty] = useState(true);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const readMessages = () => {
    API.markMessagesAsRead(props.user.id, props.chosenChatInfo.id)
      .then(() => {
        //WORK DONE
      })
  }

  useEffect(() => {
    scrollToBottom();
    readMessages();
  }, []);


  useEffect(() => {
    if (dirty) {
      API.getMessages(props.user.id, props.chosenChatInfo.id)
        .then((newmsgs) => {
          if(newmsgs.length != messages.length){
            setMessages(newmsgs);

            readMessages();

            //Wait for the new message
            setTimeout(() => {
              scrollToBottom();
            }, 10);
          }
          setDirty(false);
          setTimeout(() => setDirty(true), 1000); /* Getting new messages every second */
        });
    }
  }, [dirty]);

  const handleMessageComposition = (e) => {
    setNewmessage(e.target.value);
  }

  const handleClick = () => {
    if(newMessage != ''){
      let message = {
        text: newMessage,
        from: parseInt(props.user.id),
        to: parseInt(props.chosenChatInfo.id)
      };
      API.insertMessage(message)
      .then(() => {
        setDirty(true);
        setNewmessage('');
      })
      .catch(() => {
        console.log("err");
      });
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header-container"> 
        <div className="chat-header-component">
          <div onClick={()=> {props.setChosenChatInfo(''); navigate('/Chat');}} style={{ padding: "4%", cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faArrowLeft} /*size='2x'*//>
          </div>  
          {
          props.user.role == 'user' ? 
            <div className="chat-header-component">
              <FontAwesomeIcon icon={faUserMd} size='3x' style={{margin: "4%"}}/> 
              <div>
                {props.chosenChatInfo.name}
                <br/>
                {props.chosenChatInfo.role}
              </div>
            </div>
            : 
            <div className="chat-header-component">
              <FontAwesomeIcon icon={faUser} size='2xl' style={{margin: "4%"}}/> 
              <div>
              {props.chosenChatInfo.name}
              </div>
            </div>
          }
        </div>  
      </div>
      <div className="chat" >
        {
        messages.length > 0 ?
          messages.map((message, index) => (
            <div style={{display: 'flex'}} key={index}>
              {
                message.source != props.user.id ?
                <>
                  <FontAwesomeIcon icon={props.user.role == 'user' ? faUserMd : faUser} style={{margin: "4%"}}/> 
                  <div
                    key={index}
                    className={`message ${message.source == props.user.id ? 'sent' : 'received'}`}
                    style={{flex:1}}
                  >
                    <div className="message-content">
                      <p>{message.text}</p>
                      <span className="message-date">{message.timestamp}</span>
                    </div>
                  </div>
                  
                </>
                : 
                <>
                  <div
                    className={`message ${message.source == props.user.id ? 'sent' : 'received'}`}
                    style={{flex:1}}
                  >
                    <div className="message-content">
                      <p>{message.text}</p>
                      <span className="message-date">{message.timestamp}</span>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={props.user.role == 'user' ? faUser : faUserMd} style={{margin: "4%"}}/> 
                </>
              }
            </div>
          ))
        : <div style={{alignSelf: 'center', marginTop: '20%'}}>No messages here</div>
        }
        <span ref={messagesEndRef}></span>
      </div>
      <div style={{display: "flex", alignItems: 'center', borderBottom: '1px solid grey'}}>
        <input type="text" style={{flex: 'auto', color: "white"}} placeholder="New message..." className="message-input" value={newMessage} onChange={(e) => handleMessageComposition(e)}/>
        <FontAwesomeIcon className={newMessage == '' ? 'fa-disabled' : ''} icon={faPaperPlane} size='2x' style={{margin: "4%"}} onClick={handleClick}/> 
      </div>
    </div>
  );
};

export { ChatMessages };
