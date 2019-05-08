# Vocabbie

## How to run the server
We built our application using React & Express. Our server can be ran by running `node index.js` from the main folder. Our server will run on port 8080 by default, unless an environment variable has been set. Our React application can be ran by running `npm start` from the `/client` folder and then visiting `http://localhost:3000`. 

For actual deployment, we compile  our React project by running `npm run build` in the `client` folder. Then, we simply need to run `node index.js`.

Be sure to run the following command before running the Node/Express server:
`export GOOGLE_APPLICATION_CREDENTIALS="/path/to/google/keys/file.json"`

We have currently deployed our server to AWS EC2 and are running it here: (http://ec2-3-88-66-199.compute-1.amazonaws.com/). We used a free service to also serve the site from http://vocabbie.tk

## Acknowledgements
- We borrowed the Flashcard UI from Matt Greenberg (https://codepen.io/mattgreenberg/pen/ggOpOr))
- We borrowed Passport code from several online tutorials (https://medium.freecodecamp.org/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e and https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669)

We would also like to acknowledge Rebecca Townsend, our mentor TA, and our professor, Stephen Rice, for his help. 