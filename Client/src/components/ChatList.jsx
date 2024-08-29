import { faUser, faUserMd, faChevronRight, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';

import API from '../API';
import { useNavigate } from 'react-router';

function ChatList(props) {
  const [patients, setPatients] = useState([]);
  const [psychologists, setPsychologists] = useState([]);

  const [currentViewedMessages, setCurrentViewedMessages] = useState([]);
  const [dirty, setDirty] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (dirty) {
      if (props.user.role == 'psychologist') {
        const promises = [];

        API.getPatients(props.user.id)
          .then((pts) => {
            setPatients(pts);
            pts.forEach(p => {
              const promise = new Promise((resolve) => {
                API.getNMessages(props.user.id, p.id)
                  .then((nMsg) => {
                    resolve({ patient: p.id, psycho: props.user.id, nMessages: nMsg[0].nMsg });
                  });
              });

              promises.push(promise);
            });

            Promise.all(promises)
              .then((result) => {
                setCurrentViewedMessages([]);
                result.forEach(el => {
                  setCurrentViewedMessages(old => { return old.concat(el); });
                });
                setDirty(false);
                setTimeout(() => setDirty(true), 5000); /* Getting new messages every 5 seconds */
              });
          });
      } else {
        const promises = [];

        API.getPsychologists()
          .then((psychos) => {
            setPsychologists(psychos);
            psychos.forEach(p => {
              const promise = new Promise((resolve) => {
                API.getNMessages(props.user.id, p.id)
                  .then((nMsg) => {
                    resolve({ patient: props.user.id, psycho: p.id, nMessages: nMsg[0].nMsg });
                  });
              });

              promises.push(promise);
            });

            Promise.all(promises)
              .then((result) => {
                setCurrentViewedMessages([]);
                result.forEach(el => {
                  setCurrentViewedMessages(old => { return old.concat(el); });
                });
                setDirty(false);
                setTimeout(() => setDirty(true), 5000); /* Getting new messages every 5 seconds */
              });
          });
      }
    }
  }, [dirty]);

  const handleClick = (info) => {
    props.setChosenChatInfo(info);
    navigate('/ChatMessages');
  }

  return (
    <div className="chat-container">
      <h1 style={{ padding: "4%", textAlign: "center" }}>Chats</h1>
      <ul style={{ padding: "4%", paddingTop: "0%" }}>
        {
          props.user.role == 'psychologist' ?
            patients[0] ?
              patients.map((p) => {
                return (
                  <li key={p.id} onClick={() => handleClick({ id: p.id, name: 'User' })}>
                    <div className="div-li-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faUser} size='2xl' style={{ padding: '3%' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '3%' }}>
                          <div style={{ padding: '3%', width: 'max-content' }}>
                            <b>USER #{p.id}</b>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "end" }}>
                        <div
                          hidden={!currentViewedMessages.filter((currentCouple) => props.user.id == currentCouple.psycho && p.id == currentCouple.patient && currentCouple.nMessages > 0)[0]}
                          style={{ backgroundColor: "grey", paddingLeft: "50%", paddingRight: "50%", paddingTop: "25%", paddingBottom: "25%", borderRadius: "50%", marginRight: "5%" }}>
                          {
                            currentViewedMessages.filter((currentCouple) => props.user.id == currentCouple.psycho && p.id == currentCouple.patient && currentCouple.nMessages > 0)[0]
                              ? currentViewedMessages.filter((currentCouple) => props.user.id == currentCouple.psycho && p.id == currentCouple.patient && currentCouple.nMessages > 0)[0].nMessages
                              : null
                          }
                        </div>
                        <FontAwesomeIcon icon={faArrowRight} size='2x' style={{ padding: '3%' }} />
                      </div>
                    </div>
                  </li>
                );
              })
              : <div style={{ textAlign: 'center', marginTop: '50%' }}>No users have contacted you yet</div>
            :
            psychologists.map((p) => {
              return (
                <li key={p.id} onClick={() => handleClick({ id: p.id, name: p.surname + " " + p.name, role: p.role })}>
                  <div className="div-li-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FontAwesomeIcon icon={faUserMd} size='2xl' style={{ padding: '3%' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '3%' }}>
                        <div style={{ padding: '3%', borderBottom: '1px solid #ccc', width: 'max-content' }}>
                          <b>{p.surname} {p.name}</b>
                        </div>
                        <div style={{ padding: '3%' }}>{p.role}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "end" }}>
                      {<div
                        hidden={!currentViewedMessages.filter((currentCouple) => props.user.id == currentCouple.patient && p.id == currentCouple.psycho && currentCouple.nMessages > 0)[0]}
                        style={{ backgroundColor: "grey", paddingLeft: "50%", paddingRight: "50%", paddingTop: "25%", paddingBottom: "25%", borderRadius: "50%", marginRight: "5%" }}>
                        {
                          currentViewedMessages.filter((currentCouple) => props.user.id == currentCouple.patient && p.id == currentCouple.psycho && currentCouple.nMessages > 0)[0]
                            ? currentViewedMessages.filter((currentCouple) => props.user.id == currentCouple.patient && p.id == currentCouple.psycho && currentCouple.nMessages > 0)[0].nMessages
                            : null
                        }
                      </div>}
                      <FontAwesomeIcon icon={faChevronRight} size='2x' style={{ padding: '3%' }} />
                    </div>
                  </div>
                </li>
              );
            })
        }
      </ul>
    </div>
  );
}

export { ChatList }