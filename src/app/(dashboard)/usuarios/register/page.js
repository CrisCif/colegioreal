'use client';

import UserRegisterForm from './UserRegisterForm';
import { Container } from '@mui/material';

export default function RegisterUserPage() {
    return (
        <Container maxWidth="lg" className="py-8">
            <UserRegisterForm />
        </Container>
    );
}
