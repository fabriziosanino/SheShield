"use strict";

const db = require("./db");

exports.listActiveReports = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM reports";

        db.all(sql, [], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            const reports = rows.map((r) => ({
                id: r.id,
                type: r.type,
                description: r.description,
                lat: r.lat,
                lng: r.lng,
                position: r.position,
                timestamp: r.timestamp
            }));
            resolve(reports);
        })
    });
}

exports.insertActiveReport = (body) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO reports(type, description, lat, lng, position, timestamp) VALUES (?, ?, ?, ?, ?, ?)";
        const timestamp = Math.floor(Date.now()/1000);
        db.run(sql, [body.type, body.description, body.lat, body.lng, body.position, timestamp], function(err) {
            if(err) {
                reject(err);
            } else {
                let report = {
                    id: this.lastID,
                    type: body.type,
                    description: body.description,
                    lat: body.lat,
                    lng: body.lng,
                    position: body.position,
                    timestamp: timestamp
                };
                
                resolve(report);
            }
        }); 
    });
}

exports.getReport = (reportId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM reports WHERE id = ?";

        db.get(sql, [reportId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(row);
        })
    });
}

exports.deleteReport = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM reports WHERE id = ?";
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            } else {
                resolve(this.changes);
            }
        });
    });
};

exports.getPsychologists = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE role = 'psychologist'";
        db.all(sql, [], function (err, rows) {
            if (err) {
                reject(err);
                return;
            } else {
                const psychologists = rows.map((p) => ({
                    id: p.id,
                    name: p.name,
                    surname: p.surname,
                    role: p.role,
                }));

                resolve(psychologists);
            }
        });
    });
}

exports.getPatients = (psychoId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT DISTINCT users FROM(SELECT source AS users FROM messages WHERE destination = ? UNION SELECT destination AS users FROM messages WHERE source = ?)";
        db.all(sql, [psychoId, psychoId], function (err, rows) {
            if (err) {
                reject(err);
                return;
            } else {
                const patients = rows.map((p) => ({
                    id: p.users,   
                }));
                resolve(patients);
            }
        });
    });
}

exports.getMessages = (psyhcoId, userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM messages WHERE (source = ? AND destination = ?) OR (source = ? AND destination = ?) ORDER BY timestamp";
        db.all(sql, [psyhcoId, userId, userId, psyhcoId], function (err, rows) {
            if (err) {
                reject(err);
                return;
            } else {
                const messages = rows.map((m) => ({
                    id: m.id,
                    text: m.text,
                    source: m.source,
                    destination: m.destination,
                    timestamp: m.timestamp
                }));

                resolve(messages);
            }
        });
    });
}

exports.getnMessages = (senderId, receiverId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT count(*) as nMsg " +
                    "FROM messages " +
                    "WHERE source = ? AND destination = ? AND new = 1";
        db.all(sql, [receiverId, senderId], function (err, rows) {
            if (err) {
                reject(err);
                return;
            } 
            resolve(rows);
        });
    });
}

exports.markMessagesAsRead = (senderId, receiverId) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE messages " +
            "SET new = 0 " +
            "WHERE source = ? AND destination = ?";
        db.run(sql, [receiverId, senderId/*, receiverId, senderId*/], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
        });
    });
}

exports.insertMessage = (body) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO messages(text, source, destination, timestamp) VALUES (?, ?, ?, ?)";
        let now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        const timestamp = hour+":"+minute;
        db.run(sql, [body.text, body.from, body.to, timestamp], function (err) {
            if (err) {
                reject(err);
            } else {
                let message = {
                    id: this.lastID,
                    text: body.text,
                    source: body.from,
                    destination: body.to,
                    timestamp: timestamp
                };

                resolve(message);
            }
        });
    });
}

exports.getRecentAddresses = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM recents WHERE userId = ? ORDER BY id DESC";
        db.all(sql, [userId], function (err, rows) {
            if (err) {
                reject(err);
                return;
            } else {
                const recentAddresses = rows.map((a) => ({
                    id: a.id,
                    address: a.address
                }));
                resolve(recentAddresses);
            }
        });
    });
}

exports.insertRecentAddress = (body) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO recents(address, userId) VALUES (?, ?)";
        db.run(sql, [body.address, body.userId], function (err) {
            if (err) {
                reject(err);
            } else {
                let recentAddress = {
                    id: this.lastID,
                    address: body.address
                };
                resolve(recentAddress);
            }
        });
    });
}

exports.getSavedAddresses = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM addresses WHERE userId = ?";
        db.all(sql, [userId], function (err, rows) {
            if (err) {
                reject(err);
                return;
            } else {
                const savedAddresses = rows.map((a) => ({
                    id: a.id,
                    label: a.label,
                    address: a.address
                }));
                resolve(savedAddresses);
            }
        });
    });
}

exports.insertSavedAddress = (body) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO addresses(label, address, userId) VALUES (?, ?, ?)";
        db.run(sql, [body.label, body.address, body.userId], function (err) {
            if (err) {
                reject(err);
            } else {
                let savedAddress = {
                    id: this.lastID,
                    label: body.label,
                    address: body.address
                };
                resolve(savedAddress);
            }
        });
    });
}

exports.updateSavedAddress = (body) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE addresses SET label=?, address=? where id=?";
        db.run(sql, [body.label, body.address, body.id], function (err) {
            if (err) {
                reject(err);
            } else {
                let savedAddress = {
                    id: body.id,
                    label: body.label,
                    address: body.address
                };
                resolve(savedAddress);
            }
        });
    });
}

exports.deleteSavedAddress = (addressId) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM addresses WHERE id = ?";
        db.run(sql, [addressId], function (err) {
            if (err) {
                reject(err);
                return;
            } else {
                resolve(this.changes);
            }
        });
    });
};

