import React from 'react';
import { Container } from '@mui/material';

export default function UsuariosLayout({ children }) {
    return (
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            {children}
        </Container>
    );
}
