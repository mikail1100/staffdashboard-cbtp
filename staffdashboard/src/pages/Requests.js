import React, { useState } from 'react';
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
  Chip,
  Avatar,
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';

const PageContainer = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
`;

const StyledTableCell = styled(TableCell)`
  &.MuiTableCell-head {
    background-color: #4B6455;
    color: white;
  }
`;

const StyledChip = styled(Chip)`
  &.complete {
    background-color: #4CAF50 !important;
    color: white;
  }
  
  &.pending {
    background-color: #FFC107 !important;
  }
  
  &.rejected {
    background-color: #f44336 !important;
    color: white;
  }
`;

const ViewButton = styled(Button)`
  text-transform: none !important;
`;

function Requests() {
  const [requests] = useState([
    {
      id: 1,
      picture: '/path-to-image.jpg',
      serviceType: 'Birth Certificate',
      customerName: 'Alison Jhon',
      status: 'complete',
    },
    {
      id: 2,
      picture: '/path-to-image.jpg',
      serviceType: 'Death Certificate',
      customerName: 'Simone Curdis',
      status: 'pending',
    },
    {
      id: 3,
      picture: '/path-to-image.jpg',
      serviceType: 'Divorce Certificate',
      customerName: 'Samantha Jhonson',
      status: 'complete',
    },
    {
      id: 4,
      picture: '/path-to-image.jpg',
      serviceType: 'Marriage Certificate',
      customerName: 'Dibora Jules',
      status: 'pending',
    },
    {
      id: 5,
      picture: '/path-to-image.jpg',
      serviceType: 'Adoption Certificate',
      customerName: 'Alison Jhon',
      status: 'complete',
    },
  ]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const handleView = (id) => {
    console.log('Viewing request:', id);
    // Add view logic here
  };

  return (
    <PageContainer>
      <Title>All Requests</Title>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Picture</StyledTableCell>
              <StyledTableCell>Service Type</StyledTableCell>
              <StyledTableCell>Customer Name</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Avatar src={request.picture} alt={request.customerName} />
                </TableCell>
                <TableCell>{request.serviceType}</TableCell>
                <TableCell>{request.customerName}</TableCell>
                <TableCell>
                  <StyledChip
                    label={getStatusLabel(request.status)}
                    className={request.status}
                  />
                </TableCell>
                <TableCell align="center">
                  <ViewButton
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => handleView(request.id)}
                  >
                    View
                  </ViewButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}

export default Requests; 