import * as React from "react";
import { Route, Switch } from 'react-router-dom';
import Sender from "./Sender";
import Content from "./Content";
import Links from "./Links";
import Attachments from "./Attachments";
import MainPrueba from "./MainPrueba";



export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  componentDidMount() {
    this.setState({
      listItems: []
    });
  }

  click = async () => {
    var item = Office.context.mailbox.item;
    console.log(item.subject);
  };

  render() {
    const { title, isOfficeInitialized } = this.props;
    //init office -> loading
    if (!isOfficeInitialized) {
      return (
        <div>El complemento no ha cargado completamente.</div>
      );
    }

    //routing path to components
    return (
      <div className="ms-welcome">
        <Switch>
          <Route exact path="/" component={MainPrueba}/>
          <Route path="/sender" component={Sender}/>
          <Route path="/content" component={Content}/>
          <Route path="/links" component={Links}/>
          <Route path="/attachments" component={Attachments}/>
        </Switch>
      </div>
    );
  }
}