import React, { PureComponent } from 'react';
import {
  Button, Modal, Form,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import withAppState from '../../helper/ReduxHelper';
import { AppState } from '../../redux/Store';

import './ModalComponent.scss';

type ModalComponentProps = {
  edit: boolean,
  title: string,
}

type ModalComponentState = {
  show: boolean
}

class ModalComponent
  extends PureComponent <ModalComponentProps, ModalComponentState> {
  constructor(props: ModalComponentProps) {
    super(props);

    this.state = {
      show: false,
    };
  }

  showModal() {
    this.setState({
      show: true,
    });
  }

  closeModal() {
    this.setState({
      show: false,
    });
  }

  render() {
    if (this.props.edit) {
      return (
        <div className="edit-review">
          <FontAwesomeIcon className="edit-review-icon" icon={faPenToSquare} onClick={() => this.showModal()} />

          <Modal
            show={this.state.show}
            onHide={() => this.closeModal()}
            backdrop="static"
            keyboard={false}
            className="review-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="addReview.Rating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select aria-label="Select rating">
                    <option>Choose rating</option>
                    <option value="1">*</option>
                    <option value="2">**</option>
                    <option value="3">***</option>
                    <option value="4">****</option>
                    <option value="5">*****</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="addReview.Comment">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control as="textarea" rows={6} placeholder="I really liked..." />
                </Form.Group>

                <Button variant="primary" type="submit" className="submit-form">
                  {this.props.title}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      );
    }

    return (
      <div className="add-review">
        <Button variant="outline-primary" onClick={() => this.showModal()}>
          <FontAwesomeIcon icon={faPlus} />
          {' '}
          {this.props.title}
        </Button>

        <Modal
          show={this.state.show}
          onHide={() => this.closeModal()}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="addReview.Rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select aria-label="Select rating">
                  <option>Choose rating</option>
                  <option value="1">*</option>
                  <option value="2">**</option>
                  <option value="3">***</option>
                  <option value="4">****</option>
                  <option value="5">*****</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="addReview.Comment">
                <Form.Label>Comment</Form.Label>
                <Form.Control as="textarea" rows={6} placeholder="I really liked..." />
              </Form.Group>

              <Button variant="primary" type="submit" className="submit-form">
                {this.props.title}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default withAppState(ModalComponent, (state: AppState) => state);
