import { HttpError } from '../models/HttpError';

const baseUrl = 'http://127.0.0.1:5000';

export default class Fetch {
  public static getBasicUrls(
    responseHandler: (serverResponse: any) => void,
    errorHandler: (serverResponse: HttpError) => void,
  ) {
    const path = '/';
    this.handleJsonResponse(
      this.getRequest(path),
      path,
      responseHandler,
      errorHandler,
    );
  }

  public static getMovieList(
    path: string,
    responseHandler: (serverResponse: any) => void,
    errorHandler: (serverResponse: HttpError) => void,
  ) {
    this.handleJsonResponse(
      this.getRequest(path),
      path,
      responseHandler,
      errorHandler,
    );
  }

  private static getRequest(url: string) {
    return fetch(baseUrl + url, {
      method: 'GET',
    });
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
          // TODO navigate to login page
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
