import React from 'react';
import Scheduler from 'devextreme-react/scheduler';

//Import style
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

function SchedulerComponent(props) {

  return (
    <div>
      <Scheduler
        dataSource={props.dataSource}
        views={props.views}
        defaultCurrentView="month"
        className={props.className}
        defaultCurrentDate={new Date()}
        height={460}
        startDayHour={7}
        editing={false}
        showAllDayPanel={false}
        startDateExpr={props.startDateExpr}
        textExpr={props.textExpr}
      />
    </div>
  );
}

export default SchedulerComponent;