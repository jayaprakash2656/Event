import React, { Component } from 'react';
import {
  NotificationManager
} from 'react-notifications';
import {
  Button, CardTitle, CardText, CardDeck,
  CardSubtitle
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import IconButton from '@material-ui/core/IconButton';
import { Card, Row, Col } from 'reactstrap';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment'
//Import reusing component's
import DialogComp from './dialogComponent'
import SchedularComp from './schedulerComponent'

//Import links for Api
import links from '../apiLink.json'

//Import style
import './event.css'
// import { fi } from 'date-fns/esm/locale';
// import "react-datepicker/dist/react-datepicker.css";

const views = ['day', 'workWeek', 'month'];

class EventPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventDetails: [],
      isEvent: false,
      isEventEdit: false,
      comment: '',
      duration: '',
      destination: '',
      id: 0,
      deleteID: 0,
      isOpenAlert: false,
      errors: {},
      selectedDate: new Date()
    }
  }

  handleValidation(){
    let errors = {};
    let formIsValid = true;

    //Destination
    if(!this.state.destination){
       formIsValid = false;
       errors["destination"] = "Destination Cannot be empty";
    }

    //duration
    if(!this.state.duration){
      formIsValid = false;
      errors["duration"] = "Duration Cannot be empty";
   }

   //comment
   if(!this.state.comment){
    formIsValid = false;
    errors["comment"] = "Comment Cannot be empty";
 }

   this.setState({errors: errors});
   return formIsValid;
}

  handleCreateEvent = () => {
    this.setState({ isEvent: true }, () => {
    })
  }

  handleEditEvent = (row) => {
    this.setState({
      destination: row.destination,
      selectedDate: row.start,
      duration: row.duration,
      comment: row.comment,
      id: row.id,
      isEventEdit: true
    }, () => {
    })
  }

  handleTextfield = (name, val) => {
    this.setState({ [name]: val }, () => {
    })
  }

  handleDateChange = (date) => {
    this.setState({ selectedDate: date }, () => {
    });
  };

  onCloseModal = () => {
    this.setState({ isEvent: false, isEventEdit: false, comment: '', duration: '', destination: '', id: 0, selectedDate: new Date(), errors: {} })
  }

  //Displaying details of all the events
  AllEvent() {
    fetch(links.eventDetails, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(json => {
        if (json[0] === 200) {
            let sortedDates = json[1].sort(function (a, b) {
              if (a.start < b.start) {            // a comes first
                  return -1
              } else if (a.start < b.start) {     // b comes first
                  return 1
              } else {        // equal, so order is irrelevant
                  return 0      
              }
            })
            this.setState({eventDetails: sortedDates})
        }
      })
      .catch(error =>
        this.setState(
          {
            error,
            isLoading: false
          },
          NotificationManager.error("Server unexpectedly lost the connection. Please try after some time."),

        ),
      );
  }

  // Create events
  CreateEvent() {
    if(this.handleValidation()){
    fetch(links.eventDetails, {
      method: "POST",
      body:
        JSON.stringify({
          "destination": this.state.destination,
          "start": this.state.selectedDate,
          "duration": this.state.duration,
          "comment": this.state.comment,
        }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(json => {
        if (json[0] === 201) {
          this.setState({ isEvent: false })
          this.AllEvent();
          NotificationManager.success('Event added successfully');
        }
      })
      .catch(error =>
        this.setState(
          {
            error,
            isLoading: false
          },
          NotificationManager.error("Server unexpectedly lost the connection. Please try after some time."),

        ),
      );
        }
  }

  // Update events
  UpdateEvent() {
    if(this.handleValidation()){
    fetch(links.eventDetails + '/' + this.state.id + '/', {
      method: "PUT",
      body:
        JSON.stringify({
          "destination": this.state.destination,
          "start": this.state.selectedDate,
          "duration": this.state.duration,
          "comment": this.state.comment,
        }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(json => {
        if (json[0] === 200) {
          this.setState({ isEventEdit: false })
          this.AllEvent();
          NotificationManager.success('Event updated successfully');
        }
      })
      .catch(error =>
        this.setState(
          {
            error,
            isLoading: false
          },
          NotificationManager.error("Server unexpectedly lost the connection. Please try after some time."),

        ),
      );
        }
  }

  // Delete events
  DeleteEvent() {
    fetch(links.eventDetails + '/' + this.state.deleteID + '/', {
      method: "Delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(json => {
        if (json[0] === 200) {
          this.AllEvent();
          NotificationManager.success('Event deleted successfully');
          this.setState({isOpenAlert: false})
        }
      })
      .catch(error =>
        this.setState(
          {
            error,
            isLoading: false
          },
          NotificationManager.error("Server unexpectedly lost the connection. Please try after some time."),

        ),
      );
  }

  componentDidMount() {
    this.AllEvent()
  }
  render() {
    let addEvent;
    let dialogContent;
    let deleteEvent;

    deleteEvent = (
      <SweetAlert
					show={this.state.isOpenAlert}
					error
					showCancel
					confirmBtnText={<span>Ok</span>}
					confirmBtnBsStyle="primary"
					cancelBtnBsStyle="default"
					onOutsideClick={() => {
						this.setState({ isOpenAlert: true })
					  }}
					title={<span>Are you sure want to delete!</span>}
					onConfirm={() => {
						this.DeleteEvent()
					}}
					onCancel={() => {
						this.setState({ isOpenAlert: false, deleteID: 0 });
					}}
				>
					<label>
						You will not be able to recover this record!
					</label>
				</SweetAlert>
    )

    dialogContent = (
      <div>
        <Row className="rowstyl">
          <Col md="4">
            <TextField
              id="dest"
              margin="dense"
              label="Destination"
              value={this.state.destination}
              onChange={(e) => this.handleTextfield('destination', e.target.value)}
              variant="outlined"
              fullWidth
            />
            <span style={{color: "red"}}>{this.state.errors["destination"]}</span>
          </Col>
          <Col md="4">
            <TextField
              id="duration"
              margin="dense"
              type="number"
              value={this.state.duration}
              onChange={(e) => this.handleTextfield('duration', e.target.value)}
              label="Duration"
              variant="outlined"
              fullWidth
            />
            <span style={{color: "red"}}>{this.state.errors["duration"]}</span>
          </Col>
          <Col md="4">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                fullWidth
                style={{ marginTop: '2px' }}
                value={this.state.selectedDate}
                onChange={this.handleDateChange}
                label="Date"
                format="MMM. d, yyyy hh:mm a"
                inputVariant="outlined"
                margin="dense"
                animateYearScrolling={true}
                leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
                rightArrowIcon={<i className="zmdi zmdi-arrow-forward" />}
              />
            </MuiPickersUtilsProvider>
          </Col>
        </Row>
        <br />
        <Row>
          <Col md='12'>
            <TextField
              id="outlined-multiline-static"
              label="Comment"
              multiline
              rows={4}
              defaultValue="Default Value"
              value={this.state.comment}
              onChange={(e) => this.handleTextfield('comment', e.target.value)}
              variant="outlined"
              fullWidth={true}
            />
            <span style={{color: "red"}}>{this.state.errors["comment"]}</span>
          </Col>
        </Row>
        <br />
        <Row>
          <Col md='12'>
            <div className="d-flex">
              <div className="ml-auto">
                <Button onClick={() => this.state.isEvent ? this.CreateEvent() : this.UpdateEvent()}>
                  {this.state.isEvent ? 'Save' : 'Update'}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
    if (this.state.isEvent === true || this.state.isEventEdit === true) {
      addEvent = (
        <div>
          <DialogComp
            open={true}
            onClose={this.onCloseModal}
            onCloseTitle={this.onCloseModal}
            TitleName={this.state.isEvent ? 'Add Event' : 'Update Event'}
            DialogContent={dialogContent}
          />
        </div>
      )
    }
    return (
      <div>
        <Row
          style={{
            margin: "0px"
          }}>
          <Col md="6" style={{
            borderRight: '1px solid #ccc'
          }}>
            <div className="d-flex">
              <label className="label">Event Details</label>
              <div className="ml-auto">
                <IconButton style={{ outline: '0' }} title="Add Event"
                  onClick={() => this.handleCreateEvent()}>
                  <AddOutlinedIcon fontSize="large" />
                </IconButton>
              </div>
            </div>
            <CardDeck>
              <Row>
                {this.state.eventDetails ? this.state.eventDetails.map((val, index) => {
                  return (<Col md="6" key={index} className="cardStly">
                    <Card body outline color="secondary">
                      <CardTitle className="label">{val.destination}</CardTitle>
                      <CardSubtitle className="subTitle">{moment(val.start).format('MMM. D, yyyy')} | duration {val.duration}</CardSubtitle>
                      <CardText className="cardbodyContent">{val.comment}</CardText>
                      <div>
                        <IconButton style={{ outline: '0' }} title="Edit Event"
                          onClick={() => this.handleEditEvent(val)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton style={{ outline: '0' }} title="Delete Event"
                          onClick={() => 
                          this.setState({isOpenAlert : true, deleteID: val.id})}>
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </Card>
                  </Col>)
                }) : null}
              </Row>
            </CardDeck>
          </Col>
          <Col md='6'>
            <label className="Complabel">Detangled Engineering</label>
            <SchedularComp
              dataSource={this.state.eventDetails}
              views={views}
              className="schedulerStly"
              startDateExpr="start"
              textExpr="destination"
            />
          </Col>
          {addEvent}
          {deleteEvent}
        </Row>
      </div>
    );
  }
}
export default EventPage;
