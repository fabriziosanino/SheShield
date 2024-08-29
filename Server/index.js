'use strict';

const SERVER_IP = "localhost";

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const dao = require("./dao");

/*** init express and set-up the middlewares ***/
const app = new express();
app.use(morgan("dev"));
app.use(express.json());

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
    origin: "http://" + SERVER_IP + ":5173",
    credentials: true,
};
app.use(cors(corsOptions));

app.get("/api/reports", (req, res) => {
    dao
        .listActiveReports()
        .then((reports) => {
            res.json(reports);
        })
        .catch((err) => {
            res.status(500).json({ error: "Internal server error" });
        })
});

app.post("/api/reports", (req, res) => {
    dao
        .insertActiveReport(req.body)
        .then((result) => {
            res.status(201).json(result);
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get("/api/reports/:reportId", (req, res) => {
    dao
        .getReport(req.params.reportId)
        .then((result) => {
            res.status(201).json(result);
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.delete("/api/reports/:reportId", (req, res) => {
    dao
        .deleteReport(req.params.reportId)
        .then(nRowsDeleted => {
            res.status(200).json({rowsDeleted: nRowsDeleted});
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get("/api/users/psychologists", (req, res) => {
    dao
        .getPsychologists()
        .then((psychologists) => {
            res.json(psychologists);
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get("/api/users/patients/:psychologistId", (req, res) => {
    dao
        .getPatients(req.params.psychologistId)
        .then((patients) => {
            res.json(patients);
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get("/api/messages/:senderId/:receiverId", (req, res) => {
    dao
        .getMessages(req.params.senderId, req.params.receiverId)
        .then((messages) => {
            res.json(messages)
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get("/api/nMessages/:senderId/:receiverId", (req, res) => {
    dao
        .getnMessages(req.params.senderId, req.params.receiverId)
        .then((nMsg) => {
            res.json({nMsg: nMsg})
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.put("/api/messages/:senderId/:receiverId/read", (req, res) => {
    dao
        .markMessagesAsRead(req.params.senderId, req.params.receiverId)
        .then((nRowsUpdated) => {
            res.json({ nRowsUpdated: nRowsUpdated })
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.post("/api/messages", (req, res) => {
    dao
        .insertMessage(req.body)
        .then((result) => {
            res.status(201).json(result);
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get("/api/recentAddresses/:userId", (req, res) => {
    dao
        .getRecentAddresses(req.params.userId)
        .then((recentAddresses) => {
            res.json(recentAddresses)
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.post("/api/recentAddresses", (req, res) => {
    dao
        .insertRecentAddress(req.body)
        .then((result) => {
            res.status(201).json(result);
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get("/api/savedAddresses/:userId", (req, res) => {
    dao
        .getSavedAddresses(req.params.userId)
        .then((savedAddresses) => {
            res.json(savedAddresses)
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.post("/api/savedAddresses", (req, res) => {
    dao
        .insertSavedAddress(req.body)
        .then((result) => {
            res.status(201).json(result);
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.put("/api/savedAddresses", (req, res) => {
    dao
        .updateSavedAddress(req.body)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

app.delete("/api/savedAddresses/:addressId", (req, res) => {
    dao
        .deleteSavedAddress(req.params.addressId)
        .then(nRowsDeleted => {
            res.status(200).json({nRowsDeleted: nRowsDeleted});
        })
        .catch(() => {
            res.status(500).json({ error: "Internal server error" });
        });
});

// activate the server
const port = 3001;
app.listen(port, SERVER_IP, () => {
    console.log(`Server listening at http://${SERVER_IP}:${port}`);
});