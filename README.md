# PWP SPRING 2022
# Movie Review
## Group information
* Samuel Knaus (samuel.knaus@student.oulu.fi)
* Marius Diamant (marius.diamant@etudiant.univ-rennes1.fr)
* Jonah Siedler (st150456@stud.uni-stuttgart.de)
* Jawad Akhtar (syedjawadakhtar@gmail.com)

## Backend
### Description
The API code is located in the folder `MovieReview/backend`. It is a Python Flask application which uses Flask ALchemy as database system. The API represents the main application of the project. It is documented with Swagger in the file `backend/static/api_documentation.yml`. This documentation is also served by the application itself via the api path `/apidocs`.

### Setup
The dependencies are listed in the `MovieReview/backend/requirements.txt` file. If the noted libraries are not installed in your Python environment, install them using the following command: `pip install -r requirements.txt`.

We use Flask-SQLAlchemy in combination with SQLite3 to set up our database. The database design is given in `backend/database/models.py`. We use it in the `database_dummy_data.py` to set up an exemplary database. To test it, execute `python3 database_dummy_data.py`. The generated database can then be found as a file in the same folder (`movie-review.db`). There is no need to explicitly install SQLite since it is supported by Flask-SQLAlchemy natively.

When the databse was sucessfully set up, you can start the actual API code. Before doing so you have to set the environment variable `FLASK_APP` to the file `api.py`. Then you can simply execute the command `flask run` and the backend is started. You can access it via the URL `http://localhost:5000`. All the endpoints are available under the path `http://localhost:5000/api`. The URL is also printed in the console after the successfull startup process.

## Tests
All the API tests are included in the file `tests/resource_test.py`. To execute it, you simply have to execute `pytest tests/resource_test.py` from the backend folder. Obviously this requires the setup to be completed in advance.

## Identity Provider
### Description
Our third component is another Python Flask application. You can find the source code in the folder `MovieReview/authentication_provider`. It represents the Identity Provider (IP) of our applications ecosystem which means that all the user logic is maintained by it. A client has to login by using the endpoint served from the IP directly. The returned token can than be used as Authorization header for API requests and will be validated by the backend by using the given endpoint from the IP.

### Setup
The setup is similar to the setup of the backend.

All the dependencies are listed in the file `MovieReview/authentication_provider/requirements.txt` and can be installed via the command `pip install -r requirements.txt`.

Again there is the database setup file `database_dummy_data.py` which needs to be run in order to set up dummy users in the user database. The generated database file is named `user.db`.

To start the third component you need to set the value of the environment variable `FLASK_APP` to `api.py`. You also need to specify the port on which the application is run, otherwise you will not be able to run the backend and the IP at the same time. This can be done by setting the environment variable `FLASK_RUN_PORT`. The recommend port is 5001. If you want to use a different port you also need to change the value of the constant `THIRD_COMPONENT_URL` in the file `backend/constants.py` to the according value. Otherwise the backend will not be able to communicate with the Identity Provider.

## Client
### Description
The client is a React application written in Typescript. You can find the source code in the folder `MovieReview/frontend`.

### Dependencies
The dependencies are listed in the file `frontend/package.json`.
Since it is a React application we highly depend on multiple react typical modules. We also use multiple icons from Fontawesome (https://fontawesome.com/). The last dependency that should be mentioned is the npm module `react-jsonschema-form` (https://www.npmjs.com/package/@rjsf/core) which is used to automatically generate forms from json schemas. That way we can smoothly use the hypermedia documentation of POST and PUT endpoints to dynamically build up the form for the requests.

### Setup
To run the frontend you first need to install NodeJS. After doing so you need to install the dependencies by running the command `npm install` from the folder the `package.json` is located in, namely `MovieReview/frontend`. Then you can start the development server via the command `npm start`. The application will automatically be opened in your browser after the successfull compilation. The default url is `http://localhost:3000`. The frontend highly depends on the backend. If the API is not running the frontend will also not work properly. The backend url is specified in the file `frontend/src/helper/Fetch.ts` in the variable `baseUrl`. Further React specific information is provided in the file `frontend/README.md`.
