import { ChatList } from '../components/ChatList';
import { Container } from "react-bootstrap";
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

function Chat(props) {
  const navigate = useNavigate();

  useEffect(() => {
    props.chosenChatInfo != '' ? navigate('/ChatMessages') : null
  }, []);

  return (
    <Container fluid className="App">
      <ChatList
        user={props.user}
        setChosenChatInfo={props.setChosenChatInfo}
      />
    </Container>
  )
}

export { Chat };