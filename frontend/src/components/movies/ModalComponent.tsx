import React, { PureComponent, ReactElement } from 'react';
import Form from '@rjsf/core';
import moment from 'moment';
import {
  Modal, Container, Spinner,
} from 'react-bootstrap';
import withAppState from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';

import './ModalComponent.scss';
import { Review } from '../../models/Review';
import Fetch from '../../helper/Fetch';
import { MasonControls } from '../../models/MasonDoc';

type ModalComponentProps = {
  title: string,
  button: ReactElement
  successHandler: (review?: Review) => void,
  getMasonDocUrl?: string
  getMasonDocKey?: 'edit'|'moviereviewmeta:delete'
  submitUrl?: string,
  schema?: any,
  httpMethod?: string,
  review?: Review
}

type ModalComponentState = {
  loading: boolean,
  show: boolean
  schema?: any,
  submitUrl?: string,
  httpMethod?: string,
  errorMessage?: string
}

class ModalComponent
  extends PureComponent <ModalComponentProps, ModalComponentState> {
  constructor(props: ModalComponentProps) {
    super(props);

    this.state = {
      show: false,
      loading: false,
    };
  }

  private handlePostResponse(serverResponse: string, body: Review) {
    const reviewWithMasonControls = body;
    const masonControls: MasonControls = {
      self: {
        title: 'self',
        href: new URL(serverResponse).pathname,
      },
    };
    reviewWithMasonControls['@controls'] = masonControls;
    this.handleSuccess(reviewWithMasonControls);
  }

  private fetchMasonDocSuccessHandler = (serverResponse: Review) => {
    const masonDoc = serverResponse['@controls'][this.props.getMasonDocKey ?? 'edit'];

    this.setState({
      loading: false,
      submitUrl: masonDoc?.href,
      schema: masonDoc?.schema,
      httpMethod: masonDoc?.method,
    });
  };

  private fetchErrorHandler = () => {
    this.setState({
      errorMessage: 'Failed to execute the action',
      loading: false,
    });
  };

  private showModal = () => {
    this.setState({
      show: true,
      loading: true,
    });
    this.initModalContent();
  };

  private closeModal = () => {
    this.setState({
      show: false,
      errorMessage: undefined,
      loading: false,
    });
  };

  private handleSuccess = (review?: Review) => {
    this.props.successHandler(review);
    this.closeModal();
  };

  private initModalContent() {
    if (this.props.schema && this.props.submitUrl) {
      this.setState({
        loading: false,
        submitUrl: this.props.submitUrl,
        schema: this.props.schema,
        httpMethod: this.props.httpMethod,
      });
    } else {
      Fetch.getRequest(
        this.props.getMasonDocUrl ?? '',
        this.fetchMasonDocSuccessHandler,
        this.fetchErrorHandler,
      );
    }
  }

  private postReview(body: Review) {
    Fetch.postRequest(
      this.state.submitUrl ?? '',
      body,
      (serverResponse) => this.handlePostResponse(serverResponse, body),
      this.fetchErrorHandler,
    );
  }

  private putReview(body: Review) {
    Fetch.putRequest(
      this.state.submitUrl ?? '',
      body,
      () => this.handleSuccess(body),
      this.fetchErrorHandler,
    );
  }

  private deleteReview() {
    Fetch.deleteRequest(
      this.state.submitUrl ?? '',
      this.handleSuccess,
      this.fetchErrorHandler,
    );
  }

  render() {
    let body: JSX.Element;
    if (this.state.loading) {
      body = (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      );
    } else if (this.state.errorMessage) {
      body = (
        <span>
          {this.state.errorMessage}
        </span>
      );
    } else {
      body = (
        <Form
          formData={this.props.review}
          schema={this.state.schema ?? {}}
          uiSchema={
            {
              comment: {
                'ui:widget': 'textarea',
                'ui:rows': 6,
              },
              rating: {
                'ui:autofocus': true,
              },
              author: {
                classNames: 'hidden',
                'ui:disabled': true,
              },
              date: {
                classNames: 'hidden',
                'ui:disabled': true,
              },
              movie_id: {
                classNames: 'hidden',
                'ui:disabled': true,
              },
            }
          }
          onSubmit={(element) => {
            const { formData } = element;
            if (formData && formData.date) {
              formData.date = moment().format();
            }
            switch (this.state.httpMethod) {
              case 'POST':
                this.postReview(formData);
                break;
              case 'PUT':
                this.putReview(formData);
                break;
              case 'DELETE':
                this.deleteReview();
                break;
              default:
                break;
            }
          }}
        />
      );
    }

    return (
      <div className="review-modal">
        <Container
          className="button-container"
          onClick={this.showModal}
        >
          {this.props.button}
        </Container>

        <Modal
          show={this.state.show}
          onHide={this.closeModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body
            className="review-modal-body"
          >
            {body}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default withAppState(ModalComponent, (state: AppState) => state);
