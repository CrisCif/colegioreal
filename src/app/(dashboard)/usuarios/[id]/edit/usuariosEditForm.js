'use client';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userValidationSchema } from '@/app/(dashboard)/usuarios/register/validations/userValidations';
import {
    Box,
    Grid,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    CircularProgress,
    Tabs,
    Tab,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useUsers } from "@/hooks/useUsers";

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

function UsuariosEditForm({ userId }) {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const { getUser, updateUser, isLoading, error } = useUsers();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(userValidationSchema),
        context: { isEditing: true },
        defaultValues: {
            nombre: '',
            apellido: '',
            email: '',
            rut: '',
            telefono: '',
            departamento: '',
            cargo: '',
            estado: 'activo',
            rol: '',
        }
    });

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await getUser(userId);
                reset({
                    nombre: userData.nombre || '',
                    apellido: userData.apellido || '',
                    email: userData.email || '',
                    rut: userData.rut || '',
                    telefono: userData.telefono || '',
                    departamento: userData.departamento || '',
                    cargo: userData.cargo || '',
                    estado: userData.estado || 'activo',
                    rol: userData.rol || '',
                });
            } catch (error) {
                enqueueSnackbar('Error al cargar los datos del usuario', { variant: 'error' });
            }
        };

        if (userId) {
            loadUserData();
        }
    }, [userId, getUser, reset, enqueueSnackbar]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const onSubmit = async (data) => {
        try {
            await updateUser(userId, data);
            enqueueSnackbar('Usuario actualizado exitosamente', { variant: 'success' });
            router.push('/usuarios');
        } catch (error) {
            enqueueSnackbar(error.message || 'Error al actualizar el usuario', { variant: 'error' });
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label="INFORMACIÓN PERSONAL" />
                        <Tab label="INFORMACIÓN LABORAL" />
                        <Tab label="PERMISOS Y ACCESOS" />
                    </Tabs>
                </Box>

                <CardContent>
                    <TabPanel value={activeTab} index={0}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="nombre"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nombre"
                                            fullWidth
                                            error={!!errors.nombre}
                                            helperText={errors.nombre?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="apellido"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Apellido"
                                            fullWidth
                                            error={!!errors.apellido}
                                            helperText={errors.apellido?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Email"
                                            fullWidth
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="rut"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="RUT"
                                            fullWidth
                                            error={!!errors.rut}
                                            helperText={errors.rut?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="telefono"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Teléfono"
                                            fullWidth
                                            error={!!errors.telefono}
                                            helperText={errors.telefono?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={activeTab} index={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="departamento"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.departamento}>
                                            <InputLabel>Departamento</InputLabel>
                                            <Select {...field} label="Departamento">
                                                <MenuItem value="academico">Académico</MenuItem>
                                                <MenuItem value="administrativo">Administrativo</MenuItem>
                                                <MenuItem value="direccion">Dirección</MenuItem>
                                            </Select>
                                            {errors.departamento && (
                                                <FormHelperText>{errors.departamento.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="cargo"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Cargo"
                                            fullWidth
                                            error={!!errors.cargo}
                                            helperText={errors.cargo?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="estado"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.estado}>
                                            <InputLabel>Estado</InputLabel>
                                            <Select {...field} label="Estado">
                                                <MenuItem value="activo">Activo</MenuItem>
                                                <MenuItem value="inactivo">Inactivo</MenuItem>
                                            </Select>
                                            {errors.estado && (
                                                <FormHelperText>{errors.estado.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={activeTab} index={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="rol"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.rol}>
                                            <InputLabel>Rol</InputLabel>
                                            <Select {...field} label="Rol">
                                                <MenuItem value="ADMIN">Administrador</MenuItem>
                                                <MenuItem value="TEACHER">Profesor</MenuItem>
                                                <MenuItem value="STAFF">Personal</MenuItem>
                                            </Select>
                                            {errors.rol && (
                                                <FormHelperText>{errors.rol.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
}

export default UsuariosEditForm;