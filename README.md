# PWP SPRING 2022
# Movie Review
## Group information
* Samuel Knaus (samuel.knaus@student.oulu.fi)
* Marius Diamant (marius.diamant@etudiant.univ-rennes1.fr)
* Jonah Siedler (st150456@stud.uni-stuttgart.de)
* Jawad Akhtar (syedjawadakhtar@gmail.com)

## Setup
The dependencies are listed in the `MovieReview/backend/requirements.txt` file. If the noted libraries are not installed in your Python environment, install them using the following command: `pip install -r requirements.txt`.

We use Flask-SQLAlchemy in combination with SQLite3 to set up our database. The database design is given in `backend/api.py`. We use it in the `database_dummy_data.py` to set up an exemplary database. To test it, execute `python3 database_dummy_data.py`. The generated database can then be found as a file in the same folder (`movie-review.db`). There is no need to explicitly install SQLite since it is supported by Flask-SQLAlchemy natively.

When the databse was sucessfully set up, you can start the actual APi code. Before doing so you have to set the environment variable `FLASK_APP` to the file `api.py`. Then you can simply execute the command `flask run` and the backend is started. You can access it via the URL `http://localhost:5000`. All the endpoints are available under the path `http://localhost:5000/api`. The URL is also printed in the console after the successfull startup process.

## Tests
All the API tests are included in the file `tests/resource_test.py`. To execute it, you simply have to execute `pytest tests/resource_test.py` from the backend folder. Obviously this requires the setup to be completed in advance.
