import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Paper, Grid, Button } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

const StatsContainer = styled(Grid)`
  margin-bottom: 30px !important;
`;

const StatCard = styled(Paper)`
  padding: 20px;
  text-align: center;
  background-color: ${props => props.bgcolor || '#fff'} !important;
  color: ${props => props.color || '#333'};
`;

const StatNumber = styled.h2`
  font-size: 2.5rem;
  margin: 10px 0;
`;

const StatLabel = styled.p`
  font-size: 1.1rem;
  margin: 0;
`;

const ChartContainer = styled(Paper)`
  padding: 20px;
  margin-bottom: 30px;
`;

const ScheduleContainer = styled(Paper)`
  padding: 20px;
`;

const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  th {
    background-color: #f5f5f5;
  }
`;

const ActionButton = styled(Button)`
  margin: 10px !important;
`;

function Dashboard() {
  const navigate = useNavigate();

  const stats = {
    approved: 37,
    pending: 17,
    rejected: 10,
    appointments: 19
  };

  const chartData = {
    labels: ['Completed Services', 'Waiting Services'],
    datasets: [
      {
        data: [67, 33],
        backgroundColor: ['#4CAF50', '#f44336'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const scheduleData = [
    { day: 'Monday', morning: '8:30 - 12:30', afternoon: '2:00 - 5:00' },
    { day: 'Tuesday', morning: '8:30 - 12:30', afternoon: '2:00 - 5:00' },
    { day: 'Wednesday', morning: '8:30 - 12:30', afternoon: '2:00 - 5:00' },
    { day: 'Thursday', morning: '8:30 - 12:30', afternoon: '2:00 - 5:00' },
    { day: 'Friday', morning: '8:30 - 12:30', afternoon: '2:00 - 5:00' },
  ];

  return (
    <DashboardContainer>
      <Title>Welcome</Title>
      
      <StatsContainer container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={3}>
            <StatNumber>{stats.approved}</StatNumber>
            <StatLabel>Approved Applications</StatLabel>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={3}>
            <StatNumber>{stats.pending}</StatNumber>
            <StatLabel>Pending Applications</StatLabel>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={3}>
            <StatNumber>{stats.rejected}</StatNumber>
            <StatLabel>Rejected Applications</StatLabel>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard elevation={3}>
            <StatNumber>{stats.appointments}</StatNumber>
            <StatLabel>Appointments</StatLabel>
          </StatCard>
        </Grid>
      </StatsContainer>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ChartContainer elevation={3}>
            <h2>Service Status</h2>
            <div style={{ height: '300px' }}>
              <Pie data={chartData} options={chartOptions} />
            </div>
          </ChartContainer>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ScheduleContainer elevation={3}>
            <h2>Schedule</h2>
            <ScheduleTable>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Morning (8:30 LT - 12:30 LT)</th>
                  <th>Afternoon (2:00 LT - 5:00 LT)</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((row) => (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    <td>{row.morning}</td>
                    <td>{row.afternoon}</td>
                  </tr>
                ))}
              </tbody>
            </ScheduleTable>
          </ScheduleContainer>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid item>
          <ActionButton
            variant="contained"
            color="primary"
            onClick={() => navigate('/resident-registration')}
          >
            Register Resident
          </ActionButton>
        </Grid>
        <Grid item>
          <ActionButton
            variant="contained"
            color="secondary"
            onClick={() => navigate('/requests')}
          >
            View Requests
          </ActionButton>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
}

export default Dashboard; 