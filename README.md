# QuestionsDB

Front-end application to manage contest questions inside Firebase
with support of Firebase Authentication & Cloud Firestore database.

This project was used during the [KBTG TechJam 2018: Code Squad](https://www.techjam.tech/__tj200718/) contest.

## Set up the website

1. Create a new Firebase project and enable Firebase authentication with Google Account.
2. Set up Cloud Firestore database with [these rules (see below)](#Database-rules).
3. White-list users to allow them to access the web application by adding each user to the `users` collection in the Cloud Firestore via the web console, according to the [database fields structure (see below)](#Database-structure).

## Cloud Firestore database structure

### Database rules

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /questions/{question} {
    	allow read, write: if get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.activated == true 
    }
  }
}
```

### Database structure

- **collection:** "questions"
   - **document:** Question ID (uuidv4)  
      These questions are managed via the web application
      - **field:** "archived" (boolean)
      - **field:** "deleted" (boolean)
      - **field:** "createdAt" (datetime)
      - **field:** "updatedAt" (datetime)
      - **field:** "statement" (string)
      - **field:** "imageUrls" (array of strings)
      - **field:** "solution" (string)
      - **field:** "note" (string)
      - **field:** "format"
         - **subfield:** "choices" (boolean)
         - **subfield:** "ponder" (boolean)
         - **subfield:** "quickfire" (boolean)
         - **subfield:** "coding" (boolean)
      - **field:** "round"
         - **subfield:** "audition" (boolean)
         - **subfield:** "regional" (boolean)
         - **subfield:** "national" (boolean)
      - **field:** "region"
         - **subfield:** "south" (boolean)
         - **subfield:** "northeast" (boolean)
         - **subfield:** "north" (boolean)
         - **subfield:** "central" (boolean)
      - **tags:** "tags" (array of strings)
- **collection:** "users"
   - **document:** Google Account Email, e.g., "username@gmail.com"
      - **field:** "activated" (boolean)  
        Must be true to allow user with such email to access the website
