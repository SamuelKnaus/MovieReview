import { Credentials } from '../models/Credentials';
import { HttpError } from '../models/HttpError';
import { MasonDoc } from '../models/MasonDoc';
import { Token } from '../models/Token';
import store from '../redux/Store';
import history from './History';

const baseUrl = 'http://127.0.0.1:5000';

/**
  This helper class is used for any kind of http requests
  It contains several public static methods that can be used to run the requests
  That way we enable consistent behaviour and error handling for all http requests
*/
export default class Fetch {
  /**
  * This method is used to perform the login using the identity provider
  * @param loginUrl the absolute url to the login endpoint of the IP
  * @param body the credentials object containing the user data used to perform the login
  * @param responseHandler a callback which is executed if the login was successful
  * @param errorHandler a callback which is executed if the login failed for any reason
  */
  public static login(
    loginUrl: string,
    body: Credentials,
    responseHandler: (serverResponse: Token) => void,
    errorHandler: (serverResponse: HttpError) => void,
  ) {
    let resp: Response;
    fetch(loginUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => {
      resp = response;
      return response.json();
    }).then((responseJson) => {
      if (resp.status === 200) {
        responseHandler(responseJson);
      } else {
        const errorJson: HttpError = { message: 'Invalid crdentials' };
        errorHandler(errorJson);
      }
    }).catch(() => {
      const errorJson: HttpError = { message: 'Could not reach the authentication server' };
      errorHandler(errorJson);
    });
  }

  /**
  * This method is used to perform a request to the view function of the backend
  * That way the initial hypermedia documention of the API is retrieved
  * @param responseHandler a callback which is executed if the request was successful
  * @param errorHandler a callback which is executed if the request failed for any reason
  */
  public static getBasicUrls(
    responseHandler: (serverResponse: MasonDoc) => void,
    errorHandler: (serverResponse: HttpError) => void,
  ) {
    const path = '/';

    this.getRequest(
      path,
      responseHandler,
      errorHandler,
    );
  }

  /**
  * This generic method is used to perform a http get request
  * @param path the relative path of the GET endpoint
  * @param responseHandler a callback which is executed if the request was successful
  * @param errorHandler a callback which is executed if the request failed for any reason
  */
  public static getRequest(
    path: string,
    responseHandler: (serverResponse: any) => void,
    errorHandler: (serverResponse: HttpError) => void,
  ) {
    this.handleJsonResponse(
      fetch(baseUrl + path, {
        method: 'GET',
        headers: {
          Authorization: store.getState().authenticationToken ?? '',
        },
      }),
      responseHandler,
      errorHandler,
    );
  }

  /**
  * This generic method is used to perform a http post request
  * @param path the relative path of the POST endpoint
  * @param postObject the request body
  * @param responseHandler a callback which is executed if the request was successful
  * @param errorHandler a callback which is executed if the request failed for any reason
  */
  public static postRequest(
    path: string,
    postObject: any,
    responseHandler: (serverResponse: any) => void,
    errorHandler: (serverResponse: HttpError) => void,
  ) {
    this.handleJsonResponse(
      fetch(baseUrl + path, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: store.getState().authenticationToken ?? '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postObject),
      }),
      responseHandler,
      errorHandler,
    );
  }

  /**
  * This generic method is used to perform a http put request
  * @param path the relative path of the PUT endpoint
  * @param putObject the request body
  * @param responseHandler a callback which is executed if the request was successful
  * @param errorHandler a callback which is executed if the request failed for any reason
  */
  public static putRequest(
    path: string,
    putObject: any,
    responseHandler: (serverResponse: any) => void,
    errorHandler: (serverResponse: HttpError) => void,
  ) {
    this.handleJsonResponse(
      fetch(baseUrl + path, {
        method: 'PUT',
        headers: {
          Authorization: store.getState().authenticationToken ?? '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(putObject),
      }),
      responseHandler,
      errorHandler,
    );
  }

  /**
  * This generic method is used to perform a http delete request
  * @param path the relative path of the DELETE endpoint
  * @param responseHandler a callback which is executed if the request was successful
  * @param errorHandler a callback which is executed if the request failed for any reason
  */
  public static deleteRequest(
    path: string,
    responseHandler: (serverResponse: any) => void,
    errorHandler: (serverResponse: HttpError) => void,
  ) {
    this.handleJsonResponse(
      fetch(baseUrl + path, {
        method: 'DELETE',
        headers: {
          Authorization: store.getState().authenticationToken ?? '',
        },
      }),
      responseHandler,
      errorHandler,
    );
  }

  private static handleJsonResponse(
    fetch: Promise<Response>,
    responseHandler: (serverResponse: any) => void,
    errorHandler: (serverResponse: any) => void,
  ) {
    let resp: Response;
    fetch
      .then((response) => {
        resp = response;
        return response.json();
      })
      .then((responseJson) => {
        if (resp.status === 401) {
          history.push('/login');
          errorHandler(responseJson);
        } else if (resp.status > 300) {
          errorHandler(responseJson);
        } else {
          responseHandler(responseJson);
        }
      })
      .catch(() => {
        if (!resp) {
          errorHandler({
            errorMessage: 'The server could not be reached',
          });
        } else if (resp.status === 201) {
          responseHandler(resp.headers.get('Location'));
        } else if (resp.status < 300) {
          responseHandler(null);
        } else {
          errorHandler({
            errorMessage: 'No JSON content found',
          });
        }
      });
  }
}
