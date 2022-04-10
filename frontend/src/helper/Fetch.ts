import { HttpError } from '../models/HttpError';
import history from './History';

const baseUrl = 'http://127.0.0.1:5000';

export default class Fetch {
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
      }),
      path,
      responseHandler,
      errorHandler,
    );
  }

  private static postRequest(url: string, postObject: any) {
    return fetch(baseUrl + url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postObject),
    });
  }

  private static handleJsonResponse(
    fetch: Promise<Response>,
    path: string,
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
        console.log(error);
      });
  }
}
