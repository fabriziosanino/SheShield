## API SERVER

- GET `/api/reports`
    - Get all the reports
    - Request body: _None_
    - Response code: `200 OK` (success)
    - Response body: Array of reports (id, type, description, lat, lng, position)

- POST `/api/reports`
    - Insert a new report
    - Request body: report(type, description, lat, lng, position)
    - Response code: `201 CREATED` (success)
    - Response body: The inserted report

- DELETE `/api/reports/:reportId`
    - Delete a report identified by :reportId
    - Request body:
    - Response code: `204` (success)
    - Response body: _None_

- GET `/api/users/psychologists`
    - Get all the psychologists
    - Request body: _None_
    - Response code: `200 OK` (success)
    - Response body: Array of psychologists (id, name, surname, type)

- GET `/api/users/patients/:psychologistId`
    - Get all the patients of the psychologist (:psychologistId )
    - Request body: _None_
    - Response code: `200 OK` (success)
    - Response body: Array of patients (id)

- GET `api/messages/:userId/:psychologistId`
    - Get all the messages exchanged between the user (:userId) and the psychologist (:psychologistId) ordered by timestamp
    - Request body: _None_
    - Response code: `200 OK` (success)
    - Response body: Array of messages (id, text, source, destination)

- GET `api/nMessages/:userId/:psychologistId`
    - Get the number of messages exchanged between the user (:userId) and the psychologist (:psychologistId) ordered by timestamp
    - Request body: _None_
    - Response code: `200 OK` (success)
    - Response body: number of messages

- POST `/api/messages`
    - Insert a new message
    - Request body: message(source, destination, text)
    - Response code: `201 CREATED` (success)
    - Response body: The inserted message

- GET `/api/recentAddresses/:userId`
    - Get all the recent addresses searched by a specific user 
    - Request body: _None_
    - Response code: `200 OK` (success)
    - Response body: Array of recent addresses (id, address)

- POST `/api/recentAddresses`
    - Insert a recently searched address for the specific user
    - Request body: address(address, userId)
    - Response code: `201 CREATED` (success)
    - Response body: The recent address

- GET `/api/savedAddresses/:userId`
    - Get all the saved addresses (Home, Work, and the custom ones) of a specific user 
    - Request body: _None_
    - Response code: `200 OK` (success)
    - Response body: Array of saved addresses (id, label, address)

- POST `/api/savedAddresses`
    - Insert a new saved address for the specific user
    - Request body: address(label, address, userId)
    - Response code: `201 CREATED` (success)
    - Response body: The inserted address

- PUT `/api/savedAddresses`
    - Edit a saved address for the specific user
    - Request body: address(label, address, userId)
    - Response code: `200 OK` (success)
    - Response body: The inserted address

- DELETE `/api/savedAddresses/:addressId`
    - Delete a savedAddress identified by :addressId
    - Request body:
    - Response code: `204` (success)
    - Response body: _None_

Note: the userId and psychologistId are retreived by the `req.params` object, no use of session has been implemented since the login functionality has been skipped. In a production stage, this must be changed (using `req.user` and express-session middleware) to avoid users faking their identity simply passing a different Id as parameter