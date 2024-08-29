const SERVER_URL = "http://localhost:3001/api/";

import axios from 'axios';

/**
 * Utility function per il parsing del json.
 */
function getJson(httpResponsePromise) {
  // Il server API ritorna sempre il JSON, in caso di errore il formato è {error: "Message"}
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // Il server restituisice sempre un JSON, anche vuoto {}. Mai null o un valore non json, altrimenti il metodo fallirà
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse server response" }));
        } else {
          // Analisi causa dell'errore
          response
            .json()
            .then((obj) => reject(obj)) // errore nel body della risposta
            .catch((err) => reject({ error: "Cannot parse server response" }));
        }
      })
      .catch((err) => reject({ error: "Cannot communicate" })); // errore di connessione
  });
}

async function getAddressFromCoordinates(lat, lng) {
  const apiKey = "AIzaSyA1V5q0PXE9kfL6ZqE6hYtEWu9dYjn-YTY";
  const result = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);

  return result;
}

function getAllReports() {
  return getJson(
    fetch(SERVER_URL + "reports", {
      credentials: "include"
    })
  ).then((json) => {
    return json.map((report) => {
      const rep = {
        id: parseInt(report.id),
        type: report.type,
        description: report.description === "" ? null : report.description,
        lat: report.lat,
        lng: report.lng,
        position: report.position,
        timestamp: report.timestamp
      };
      return rep;
    });
  }).catch((error) => {
    console.log(error)
  });
}

function getReport(id) {
  return getJson(
    fetch(SERVER_URL + "reports/" + id, {
      credentials: "include"
    })
  ).then((report) => {
    const rep = {
      id: parseInt(report.id),
      type: report.type,
      description: report.description === "" ? null : report.description,
      lat: report.lat,
      lng: report.lng,
      position: report.position,
      timestamp: report.timestamp
    };
    return rep;
  }).catch((error) => {
    console.log(error)
  });
}

function deleteReport(reportId) {
  return getJson(
    fetch(SERVER_URL + "reports/" + reportId, {
      method: "DELETE",
      credentials: "include",
    })
  );
}

function insertReport(report) {
  return getJson(
    fetch(SERVER_URL + "reports", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(report)
    })
  );
}

function getRecentAddresses(userId) {
  return getJson(
    fetch(SERVER_URL + "recentAddresses/" + userId, {
      credentials: "include",
    })
  ).then((json) => {
    return json.map((sa) => {
      const recentAddress = {
        id: parseInt(sa.id),
        address: sa.address
      };
      return recentAddress;
    });
  });
}

function insertRecentAddress(recentAddress) {
  return getJson(
    fetch(SERVER_URL + "recentAddresses", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recentAddress),
    })
  ).then(() => {
    return true;
  });
}

function getSavedAddresses(userId) {
  return getJson(
    fetch(SERVER_URL + "savedAddresses/" + userId, {
      credentials: "include",
    })
  ).then((json) => {
    return json.map((sa) => {
      const savedAddress = {
        id: parseInt(sa.id),
        label: sa.label,
        address: sa.address === "" ? null : sa.address
      };
      return savedAddress;
    });
  });
}

function insertSavedAddress(savedAddress) {
  return getJson(
    fetch(SERVER_URL + "savedAddresses", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(savedAddress),
    })
  ).then(() => {
    return true;
  });
}

function updateSavedAddress(savedAddress) {
  return getJson(
    fetch(SERVER_URL + "savedAddresses", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(savedAddress),
    })
  ).then(() => {
    return true;
  })
}

function deleteSavedAddress(addressId) {
  return getJson(
    fetch(SERVER_URL + "savedAddresses/" + addressId, {
      method: "DELETE",
      credentials: "include",
    })
  );
}

function getPsychologists() {
  return getJson(
    fetch(SERVER_URL + "users/psychologists", {
      credentials: "include",
    })
  ).then((json) => {
    return json.map((p) => {
      const psychologists = {
        id: parseInt(p.id),
        name: p.name,
        surname: p.surname,
        role: p.role
      };
      return psychologists;
    });
  });
}

function getPatients(psychoId) {
  return getJson(
    fetch(SERVER_URL + "users/patients/" + psychoId, {
      credentials: "include",
    })
  ).then((json) => {
    return json.map((p) => {
      const patients = {
        id: parseInt(p.id)
      };
      return patients;
    });
  });
}

function getMessages(senderId, receiverId) {
  return getJson(
    fetch(SERVER_URL + "messages/" + senderId + "/" + receiverId, {
      credentials: "include",
    })
  ).then((json) => {
    return json.map((msg) => {
      const message = {
        id: msg.id,
        text: msg.text,
        source: msg.source,
        destination: msg.destination,
        timestamp: msg.timestamp
      };
      return message;
    });
  });
}

function getNMessages(senderId, receiverId) {
  return getJson(
    fetch(SERVER_URL + "nMessages/" + senderId + "/" + receiverId, {
      credentials: "include",
    })
  ).then((json) => json.nMsg);
}


function insertMessage(message) {
  return getJson(
    fetch(SERVER_URL + "messages", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
  ).then((msg) => {
    return true;
  });
}

function markMessagesAsRead(senderId, receiverId) {
  return getJson(
    fetch(SERVER_URL + "messages/" + senderId + "/" + receiverId + "/read", {
      method: "PUT",
      credentials: "include",
    })
  ).then((nUpdated) => {
    return true; 
  });
}

const API = {
  getAllReports,
  deleteReport,
  insertReport,
  getReport,
  getRecentAddresses,
  insertRecentAddress,
  getSavedAddresses,
  insertSavedAddress,
  updateSavedAddress,
  deleteSavedAddress,
  getAddressFromCoordinates,
  getPsychologists,
  getPatients,
  getMessages,
  getNMessages,
  insertMessage,
  markMessagesAsRead
};

export default API;