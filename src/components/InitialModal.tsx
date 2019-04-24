import * as React from "react";
import * as ReactModal from "react-modal";
import { firestore } from "../utils/firebase";

interface InitialModalProps {
  isOpen: boolean;
  initFunc: Function;
  setRoomId: Function;
  startLoading: Function;
  endLoading: Function;
  checkLoading: Function;
  roomId: string;
}

interface InitialModalState {
  roomId: string;
  errorText: string;
}

interface MessageInputEvent extends React.FormEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

export default class InitialModal extends React.Component<InitialModalProps, InitialModalState> {
  constructor(props: InitialModalProps) {
    super(props);
    this.state = {
      roomId: "",
      errorText: ""
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onNewRoom = this.onNewRoom.bind(this);
  }

  onChangeHandler(e: MessageInputEvent) {
    this.setState({ roomId: e.target.value });
  }

  onSubmit() {
    if (this.props.checkLoading()) {
      return;
    }

    this.props.startLoading();
    const ref = firestore.collection("rooms").doc(this.state.roomId);
    ref.get().then(doc => {
      if (doc.exists && !doc.data()!.isPlaying) {
        this.props.setRoomId(doc.id, false, 1);
        ref.set({ isPlaying: true });
      } else {
        alert("not found!");
      }
    });
    this.props.endLoading();
  }

  onNewRoom() {
    if (this.props.checkLoading()) {
      return;
    }
    this.props.startLoading();
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

    const initModal = (
      <ReactModal isOpen={isOpen} style={customStyles} className="init-modal">
        <h3 className="init-modal__heading">ゲームを始める</h3>
        <input className="init-modal__form" type="text" onChange={this.onChangeHandler} />
        <div className="init-modal__buttons">
          <div className="init-modal__button" onClick={this.onNewRoom}>
            新たに部屋を作る
          </div>
          <div className="init-modal__button" onClick={this.onSubmit}>
            IDから部屋を探す
          </div>
        </div>
      </ReactModal>
    );

    const waitModal = (
      <ReactModal isOpen={isOpen} style={customStyles} className="init-modal">
        <h3 className="init-modal__heading">対戦者待ち</h3>
        <p className="init-modal__text">
          <h4>{this.props.roomId}</h4>
          <br />
          を対戦者に教えて下さい！
        </p>
      </ReactModal>
    );

    return this.props.roomId ? waitModal : initModal;
  }
}
