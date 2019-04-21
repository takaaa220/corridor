import * as React from "react";
import * as ReactModal from "react-modal";

interface InitialModalProps {
  isOpen: boolean;
  initFunc: Function;
}

interface InitialModalState {
  roomId: string;
}

interface MessageInputEvent extends React.FormEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

export default class InitialModal extends React.Component<InitialModalProps, InitialModalState> {
  constructor(props: InitialModalProps) {
    super(props);
    this.state = {
      roomId: ""
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  onChangeHandler(e: MessageInputEvent) {
    this.setState({ roomId: e.target.value });
  }

  onSubmit() {
    console.log(this.state.roomId);
  }

  onSearch() {
    this.props.initFunc();
  }

  render() {
    const { isOpen } = this.props;
    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        height: "200px",
        width: "500px",
        borderRadius: "30px",
        position: "absolute"
      }
    };
    return (
      <ReactModal isOpen={isOpen} style={customStyles} className="init-modal">
        <h3 className="init-modal__heading">ゲームを始める</h3>
        <input className="init-modal__form" type="text" onChange={this.onChangeHandler} />
        <div className="init-modal__buttons">
          <div className="init-modal__button" onClick={this.onSearch}>
            新たに部屋を作る
          </div>
          <div className="init-modal__button" onClick={this.onSubmit}>
            IDから部屋を探す
          </div>
        </div>
      </ReactModal>
    );
  }
}
