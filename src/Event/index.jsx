import React, { Component } from 'react';
import Event from './Event'
import {
    NotificationContainer
} from 'react-notifications';


//Import style
import '../asset/style/card.css'
import 'react-notifications/lib/notifications.css';

class EventIndex extends Component {
    render() {
        return (
            <div>
                <br />
                <br />
                <Event />
                <NotificationContainer />
            </div>
        );
    }
}

export default EventIndex;