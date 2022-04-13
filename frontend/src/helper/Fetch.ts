import { Credentials } from '../models/Credentials';
import { HttpError } from '../models/HttpError';
import store from '../redux/Store';
import history from './History';

const baseUrl = 'http://127.0.0.1:5000';

export default class Fetch {
  public static login(
    loginUrl: string,
    body: Credentials,
    responseHandler: (serverResponse: any) => void,
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

  public static getBasicUrls(
    responseHandler: (serverResponse: any) => void,
    errorHandler: (serverResponse: HttpError) => void,
  ) {
    const path = '/';

    this.getRequest(
      path,
      responseHandler,
      errorHandler,
    );
  }

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
        if (resp.status === 401 || resp.status === 403) {
          history.push('/login');
          errorHandler(responseJson);
        } else if (resp.status > 300) {
          errorHandler(responseJson);
        } else {
          responseHandler(responseJson);
        }
      })
      .catch((error) => {
        errorHandler({
          errorMessage: 'No JSON content found',
        });
      });
  }
}
