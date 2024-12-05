'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Grid,
    Paper,
    Typography,
    Tabs,
    Tab,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useUsers } from '@/hooks/useUsers';
import { useSnackbar } from 'notistack';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`user-tabpanel-${index}`}
            aria-labelledby={`user-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const { getUser, updateUser } = useUsers();
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        rol: '',
        departamento: '',
        cargo: '',
        telefono: '',
        estado: 'activo'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser(params.id);
                setFormData({
                    nombre: userData.nombre || '',
                    apellido: userData.apellido || '',
                    email: userData.email || '',
                    rol: userData.rol || '',
                    departamento: userData.departamento || '',
                    cargo: userData.cargo || '',
                    telefono: userData.telefono || '',
                    estado: userData.estado || 'activo'
                });
            } catch (error) {
                setError('Error al cargar los datos del usuario');
                enqueueSnackbar('Error al cargar los datos del usuario', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchUser();
        }
    }, [params.id, getUser, enqueueSnackbar]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.nombre || !formData.apellido || !formData.email) {
            setError('Por favor complete todos los campos obligatorios');
            return false;
        }
        if (!formData.rol) {
            setError('Por favor seleccione un rol');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        try {
            await updateUser(params.id, formData);
            enqueueSnackbar('Usuario actualizado exitosamente', { variant: 'success' });
            router.push('/usuarios');
        } catch (error) {
            setError(error.message || 'Error al actualizar el usuario');
            enqueueSnackbar('Error al actualizar el usuario', { variant: 'error' });
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 2, width: '100%' }}>
            <Typography variant="h5" gutterBottom>
                Editar Usuario
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="INFORMACIÓN PERSONAL" />
                    <Tab label="INFORMACIÓN LABORAL" />
                    <Tab label="PERMISOS Y ACCESOS" />
                </Tabs>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Teléfono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Departamento</InputLabel>
                                <Select
                                    name="departamento"
                                    value={formData.departamento}
                                    onChange={handleInputChange}
                                    label="Departamento"
                                >
                                    <MenuItem value="academico">Académico</MenuItem>
                                    <MenuItem value="administrativo">Administrativo</MenuItem>
                                    <MenuItem value="direccion">Dirección</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Cargo"
                                name="cargo"
                                value={formData.cargo}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    label="Estado"
                                >
                                    <MenuItem value="activo">Activo</MenuItem>
                                    <MenuItem value="inactivo">Inactivo</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Rol</InputLabel>
                                <Select
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleInputChange}
                                    label="Rol"
                                >
                                    <MenuItem value="ADMIN">Administrador</MenuItem>
                                    <MenuItem value="TEACHER">Profesor</MenuItem>
                                    <MenuItem value="STAFF">Personal</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </TabPanel>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon />}
                    >
                        Guardar Cambios
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}
