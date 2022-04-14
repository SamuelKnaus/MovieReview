import React, { PureComponent, ReactElement } from 'react';
import Form from '@rjsf/core';
import {
  Modal, Container, Spinner,
} from 'react-bootstrap';
import withAppState from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';

import './ModalComponent.scss';
import { Review } from '../../models/Review';
import Fetch from '../../helper/Fetch';

type ModalComponentProps = {
  title: string,
  button: ReactElement
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

  fetchMasonDocSuccessHandler = (serverResponse: Review) => {
    const masonDoc = serverResponse['@controls'][this.props.getMasonDocKey ?? 'edit'];

    this.setState({
      loading: false,
      submitUrl: masonDoc?.href,
      schema: masonDoc?.schema,
      httpMethod: masonDoc?.method,
    });
  };

  fetchErrorHandler = () => {
    this.setState({
      errorMessage: 'Failed to execute the action',
      loading: false,
    });
  };

  showModal = () => {
    this.setState({
      show: true,
      loading: true,
    });
    this.initModalContent();
  };

  closeModal = () => {
    this.setState({
      show: false,
      errorMessage: undefined,
      loading: false,
    });
  };

  initModalContent() {
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

  postReview(body: Review) {
    Fetch.postRequest(
      this.state.submitUrl ?? '',
      body,
      this.closeModal,
      this.fetchErrorHandler,
    );
  }

  putReview(body: Review) {
    Fetch.putRequest(
      this.state.submitUrl ?? '',
      body,
      this.closeModal,
      this.fetchErrorHandler,
    );
  }

  deleteNewReview() {
    Fetch.deleteRequest(
      this.state.submitUrl ?? '',
      this.closeModal,
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
          onSubmit={(element) => {
            switch (this.state.httpMethod) {
              case 'POST':
                this.postReview(element.formData);
                break;
              case 'PUT':
                this.putReview(element.formData);
                break;
              case 'DELETE':
                this.deleteNewReview();
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
