'use client'
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Container, Paper, Typography, Avatar, Box, Chip, Button,
    Grid, Card, CardContent, Tabs, Tab, IconButton,
    LinearProgress, Divider, CircularProgress, Alert
} from '@mui/material';
import {
    Person, Email, AdminPanelSettings, Security,
    Edit, ArrowBack, CheckCircle, Warning,
    AccessTime, History, Error
} from '@mui/icons-material';
import ProtectedResource from '@/components/auth/ProtectedResource';
import { useUsers } from '@/hooks/useUsers';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>{children}</Box>
            )}
        </div>
    );
}

export default function UserDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const [tabValue, setTabValue] = useState(0);
    const { data, isLoading, isError } = useUsers({
        filters: {
            id: parseInt(id)
        }
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!isLoading && data) {
            const usersArray = Array.isArray(data.data) ? data.data : [];
            const userData = usersArray.find((item) => item.id === parseInt(id));
            if (userData) setUser(userData);
        }
    }, [data, id, isLoading]);

    if (isLoading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    );

    if (isError) return (
        <Alert severity="error">
            Error al cargar los datos del usuario
        </Alert>
    );

    if (!user) return (
        <Alert severity="warning">
            Usuario no encontrado
        </Alert>
    );

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
                <IconButton
                    onClick={() => router.back()}
                    sx={{ position: 'absolute', top: 16, left: 16 }}
                >
                    <ArrowBack />
                </IconButton>

                <ProtectedResource allowedRoles={['ADMIN']}>
                    <IconButton
                        onClick={() => router.push(`/usuarios/${id}/editar`)}
                        sx={{ position: 'absolute', top: 16, right: 16 }}
                    >
                        <Edit />
                    </IconButton>
                </ProtectedResource>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 3 }}>
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: 'primary.main',
                            fontSize: '2rem'
                        }}
                    >
                        {user.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ ml: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            {user.name}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {user.email}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <Chip
                                icon={<AdminPanelSettings />}
                                label={user.role}
                                color="primary"
                                sx={{ mr: 1 }}
                            />
                            <Chip
                                icon={user.status === 'Activo' ? <CheckCircle /> : <Warning />}
                                label={user.status}
                                color={user.status === 'Activo' ? 'success' : 'warning'}
                            />
                        </Box>
                    </Box>
                </Box>

                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab icon={<Person sx={{ mr: 1 }} />} label="Información General" />
                    <Tab icon={<Security sx={{ mr: 1 }} />} label="Permisos" />
                    <Tab icon={<History sx={{ mr: 1 }} />} label="Historial" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Información de Cuenta
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ '& > div': { mb: 2 } }}>
                                        <Box display="flex" alignItems="center">
                                            <Person sx={{ mr: 1 }} />
                                            <Typography variant="body1">
                                                <strong>Nombre:</strong> {user.name}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <Email sx={{ mr: 1 }} />
                                            <Typography variant="body1">
                                                <strong>Email:</strong> {user.email}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <AdminPanelSettings sx={{ mr: 1 }} />
                                            <Typography variant="body1">
                                                <strong>Rol:</strong> {user.role}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography variant="body1">
                                                <strong>Último acceso:</strong> {new Date(user.lastLogin).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Permisos del Usuario
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {user.permissions.map((permission, index) => (
                                    <Chip
                                        key={index}
                                        label={permission}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Historial de Actividad
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {user.activityLog.map((activity, index) => (
                                <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <History sx={{ mr: 1 }} />
                                    <Typography variant="body1">
                                        {activity.action} - {new Date(activity.timestamp).toLocaleString()}
                                    </Typography>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </TabPanel>
            </Paper>
        </Container>
    );
}
