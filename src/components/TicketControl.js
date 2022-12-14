import React from 'react';
import NewTicketForm from './NewTicketForm';
import EditTicketForm from './EditTicketForm';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail'; 
import PropTypes from "prop-types";
import { connect } from 'react-redux'; 
import { formatDistanceToNow } from 'date-fns';
import * as a from './../actions';

class TicketControl extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      // formVisibleOnPage: false,
      selectedTicket: null,
      editing: false 
    };  
  }

  componentDidMount() {
    this.waitTimeUpdateTimer = setInterval(() =>
      this.updateTicketElapsedWaitTime(),
    60000
    );
  }

  componentWillUnmount(){
    clearInterval(this.waitTimeUpdateTimer);
  }

  updateTicketElapsedWaitTime = () => {
    const { dispatch } = this.props;
    Object.values(this.props.mainTicketList).forEach(ticket => {
      const newFormattedWaitTime = formatDistanceToNow(ticket.timeOpen, {
        addSuffix: true
      });
      const action = a.updateTime(ticket.id, newFormattedWaitTime);
      dispatch(action);
    });
  }

  /* Handles mouse-click events. */
  handleClick = () => {  
    if (this.state.selectedTicket != null) {
      this.setState({
        selectedTicket: null,
        editing: false 
      });   {/* This first conditional enables the Method to handle returning to the Queue from the Ticket Detail page (and/or a component which is accessed via the Details page, like the Edit form). */} 
    } else {
      const { dispatch } = this.props;
      const action = a.toggleForm();
      dispatch(action);
    }
  }

  /* Handles the form submission process (for adding a new ticket to the list). */
  handleAddingNewTicketToList = (newTicket) => {   
    const { dispatch } = this.props;
    // const { id, names, location, issue } = newTicket; 
    const action = a.addTicket(newTicket);
    dispatch(action); 
    const action2 = a.toggleForm();
    dispatch(action2);
  }

  /* This method allows a given ticket to be Updated/Edited using the Edit form. */
  handleEditingTicketInList = (ticketToEdit) => {
    const { dispatch } = this.props;
    // const { id, names, location, issue } = ticketToEdit;
    const action = a.addTicket(ticketToEdit);
    dispatch(action);
    this.setState({
      editing: false,
      selectedTicket: null
    });
  }

  /* Handles deletion of a given ticket. */
  handleDeletingTicket = (id) => {
    const { dispatch } = this.props;
    const action = a.deleteTicket(id);
    dispatch(action);
    this.setState({selectedTicket: null});
  }

  /* Handles selection of a ticket with a given ID. */
  handleChangingSelectedTicket = (id) => {
    const selectedTicket = this.props.mainTicketList[id];
    this.setState({selectedTicket: selectedTicket});
  }

  /* Handles showing the Edit form for a given ticket. */ 
  handleEditClick = () => {
    console.log("handleEditClick reached!");
    this.setState({editing: true});
  }

  render(){
    let currentlyVisibleState = null;
    let buttonText = null; 
    
    if (this.state.editing ) {      
      currentlyVisibleState = <EditTicketForm ticket = {this.state.selectedTicket} onEditTicket = {this.handleEditingTicketInList} />  //Passes methods down to 'EditTicketForm' component as Props. 
      buttonText = "Return to Ticket List";
    } else if (this.state.selectedTicket != null) {
      currentlyVisibleState = 
      <TicketDetail 
        ticket = {this.state.selectedTicket} 
        onClickingDelete = {this.handleDeletingTicket} 
        onClickingEdit = {this.handleEditClick} />
      buttonText = "Return to Ticket List";
    }
    else if (this.props.formVisibleOnPage) {
      currentlyVisibleState = <NewTicketForm onNewTicketCreation={this.handleAddingNewTicketToList}  />;
      buttonText = "Return to Ticket List";
    } else {
      currentlyVisibleState = <TicketList ticketList={this.props.mainTicketList} onTicketSelection={this.handleChangingSelectedTicket} />;
      // Because a User will actually be clicking on the ticket in the Ticket component, we will need to pass our new 'handleChangingSelectedTicket' method as a Prop.
      buttonText = "Add Ticket";
    }

    return (
      <React.Fragment>
        {currentlyVisibleState}
        <button onClick={this.handleClick}>{buttonText}</button> { /* new code */ }
      </React.Fragment>
    );
  }
}


TicketControl.propTypes = {
  mainTicketList: PropTypes.object,
  formVisibleOnPage: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    mainTicketList: state.mainTicketList,
    formVisibleOnPage: state.formVisibleOnPage
  }
}

TicketControl = connect(mapStateToProps)(TicketControl);


export default TicketControl;