import React from 'react';

type MyProps = {
    message: string;
};

type MyState = {
  count: number;
  message: string;
};

const inititalState = {
  count: 0,
  message: '',
};

export default class Test extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);

    this.state = inititalState;
  }

  render() {
    return (
      <div>
        <button
          onClick={
            () => this.setState({ message: 'efge' })
          }
        >
          Default
        </button>
        {this.props.message}
        <br />
        {this.state.message}
        <br />
        {this.state.count}
      </div>
    );
  }
}
