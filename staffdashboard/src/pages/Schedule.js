import React from 'react';
import styled from 'styled-components';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';

const PageContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

const ScheduleContainer = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`;

const StyledTableCell = styled(TableCell)`
  &.MuiTableCell-head {
    background-color: #4B6455;
    color: white;
    font-weight: bold;
  }
`;

const TimeSlot = styled.div`
  padding: 8px;
  margin: 4px 0;
  background-color: ${props => props.isBooked ? '#f5f5f5' : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.isBooked ? '#f5f5f5' : '#e8f5e9'};
  }
`;

function Schedule() {
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = {
    morning: '8:30 LT - 12:30 LT',
    afternoon: '2:00 LT - 5:00 LT',
  };

  const schedule = weekDays.map(day => ({
    day,
    morning: {
      time: timeSlots.morning,
      appointments: Math.floor(Math.random() * 3), // Simulated data
    },
    afternoon: {
      time: timeSlots.afternoon,
      appointments: Math.floor(Math.random() * 3), // Simulated data
    },
  }));

  const handleTimeSlotClick = (day, period) => {
    console.log(`Clicked ${period} slot on ${day}`);
    // Add appointment handling logic here
  };

  return (
    <PageContainer>
      <Title>Schedule</Title>
      
      <ScheduleContainer elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Day</StyledTableCell>
                <StyledTableCell>Morning ({timeSlots.morning})</StyledTableCell>
                <StyledTableCell>Afternoon ({timeSlots.afternoon})</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.map((day) => (
                <TableRow key={day.day}>
                  <TableCell component="th" scope="row">
                    {day.day}
                  </TableCell>
                  <TableCell>
                    <TimeSlot
                      isBooked={day.morning.appointments >= 2}
                      onClick={() => handleTimeSlotClick(day.day, 'morning')}
                    >
                      {day.morning.appointments >= 2 ? (
                        'Fully Booked'
                      ) : (
                        `${day.morning.appointments} appointments`
                      )}
                    </TimeSlot>
                  </TableCell>
                  <TableCell>
                    <TimeSlot
                      isBooked={day.afternoon.appointments >= 2}
                      onClick={() => handleTimeSlotClick(day.day, 'afternoon')}
                    >
                      {day.afternoon.appointments >= 2 ? (
                        'Fully Booked'
                      ) : (
                        `${day.afternoon.appointments} appointments`
                      )}
                    </TimeSlot>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ScheduleContainer>

      <Paper elevation={3} style={{ padding: '20px' }}>
        <h2>Legend</h2>
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <div>
            <TimeSlot>Available</TimeSlot>
          </div>
          <div>
            <TimeSlot isBooked>Fully Booked</TimeSlot>
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
          onClick={() => console.log('Add new appointment')}
        >
          Add New Appointment
        </Button>
      </Paper>
    </PageContainer>
  );
}

export default Schedule; 