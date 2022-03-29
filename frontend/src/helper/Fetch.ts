const baseUrl = 'http://localhost:5001';

export interface ServerResponse <T> {
    payload?: T;
    exception: Exception;
    path: string;
}

interface Exception {
  name: string;
  description: string;
  stackTrace: string;
  path?: string;
}

export default class Fetch {
  public static getBasicUrls(
    responseHandler: (serverResponse: ServerResponse<boolean>) => void,
    errorHandler: (serverResponse: ServerResponse<boolean>) => void,
  ) {
    const path = '/';
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
    responseHandler: (serverResponse: ServerResponse<any>) => void,
    errorHandler: (serverResponse: ServerResponse<any>) => void,
  ) {
    fetch
      .then((response) => response.json())
      .then((responseJson) => {
        // tslint:disable-next-line:no-console
        console.log(responseJson);
        if (responseJson.status === '401' || responseJson.status === '403') {
          // TODO navigate to login page
          errorHandler(responseJson);
        } else if (responseJson.status > 300) {
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