'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userValidationSchema } from './validations/userValidations';
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
    Checkbox,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { useUsers } from "@/hooks/useUsers";
import dayjs from 'dayjs';

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

function UserRegisterForm() {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const { createUser, isLoading } = useUsers();

    const { control, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: yupResolver(userValidationSchema),
        context: { isEditing: false },
        defaultValues: {
            // Información Personal
            firstName: '',
            lastName: '',
            email: '',
            rut: '',
            
            // Roles y Permisos
            role: 'User',
            permisos: [],

            // Información Profesional
            staffType: '',
            subjectsTeaching: [],
            position: '',
            department: '',
            especialidad: '',
            registroSecreduc: '',
            mencionesExtra: [],

            // Información de Contacto
            phoneNumber: '',
            birthDate: null,
            address: '',
            comuna: '',
            region: '',
            emergencyContact: {
                name: '',
                relation: '',
                phone: ''
            },

            // Información Laboral
            tipoContrato: '',
            horasContrato: null,
            fechaIngreso: null,
            bieniosReconocidos: null,
            evaluacionDocente: null,

            // Estado y Configuración
            isActive: true,
            configuracionNotificaciones: {
                email: true,
                sms: false
            },

            // Contraseña
            password: '',
            confirmPassword: ''
        }
    });

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const onSubmit = async (data) => {
        try {
            // Preparar datos para envío
            const userPayload = {
                // Información Personal
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                rut: data.rut,
                
                // Roles y Permisos
                role: data.role,
                permisos: data.permisos || [],

                // Información Profesional
                staffType: data.staffType,
                subjectsTeaching: data.subjectsTeaching || [],
                position: data.position,
                department: data.department,
                especialidad: data.especialidad,
                registroSecreduc: data.registroSecreduc,
                mencionesExtra: data.mencionesExtra || [],

                // Información de Contacto
                phoneNumber: data.phoneNumber,
                birthDate: data.birthDate ? dayjs(data.birthDate).toDate() : null,
                address: data.address,
                comuna: data.comuna,
                region: data.region,
                emergencyContact: data.emergencyContact ? {
                    name: data.emergencyContact.name,
                    relation: data.emergencyContact.relation,
                    phone: data.emergencyContact.phone
                } : null,

                // Información Laboral
                tipoContrato: data.tipoContrato,
                horasContrato: data.horasContrato,
                fechaIngreso: data.fechaIngreso ? dayjs(data.fechaIngreso).toDate() : null,
                bieniosReconocidos: data.bieniosReconocidos,
                evaluacionDocente: data.evaluacionDocente,

                // Estado y Configuración
                isActive: data.isActive,
                configuracionNotificaciones: data.configuracionNotificaciones,

                // Contraseña
                password: data.password
            };

            await createUser(userPayload);
            enqueueSnackbar('Usuario creado exitosamente', { variant: 'success' });
            router.push('/usuarios');
        } catch (error) {
            enqueueSnackbar(error.message || 'Error al crear el usuario', { variant: 'error' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label="Información Personal" />
                        <Tab label="Roles y Permisos" />
                        <Tab label="Información Profesional" />
                        <Tab label="Información de Contacto" />
                        <Tab label="Información Laboral" />
                        <Tab label="Estado" />
                        <Tab label="Contraseña" />
                    </Tabs>
                </Box>

                <CardContent>
                    {/* Información Personal */}
                    <TabPanel value={activeTab} index={0}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="firstName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nombres"
                                            fullWidth
                                            error={!!errors.firstName}
                                            helperText={errors.firstName?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="lastName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Apellidos"
                                            fullWidth
                                            error={!!errors.lastName}
                                            helperText={errors.lastName?.message}
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
                                            label="Correo Electrónico"
                                            type="email"
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
                        </Grid>
                    </TabPanel>

                    {/* Roles y Permisos */}
                    <TabPanel value={activeTab} index={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.role}>
                                            <InputLabel>Rol</InputLabel>
                                            <Select {...field} label="Rol">
                                                <MenuItem value="Viewer">Visualizador</MenuItem>
                                                <MenuItem value="User">Usuario</MenuItem>
                                                <MenuItem value="Admin">Administrador</MenuItem>
                                            </Select>
                                            {errors.role && (
                                                <FormHelperText>{errors.role.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="permisos"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControl fullWidth>
                                            <InputLabel>Permisos</InputLabel>
                                            <Select
                                                multiple
                                                value={value || []}
                                                onChange={onChange}
                                                renderValue={(selected) => selected.join(', ')}
                                                label="Permisos"
                                            >
                                                {['CREATE', 'READ', 'UPDATE', 'DELETE'].map((permiso) => (
                                                    <MenuItem key={permiso} value={permiso}>
                                                        <Checkbox checked={(value || []).includes(permiso)} />
                                                        {permiso}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Información Profesional */}
                    <TabPanel value={activeTab} index={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="staffType"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.staffType}>
                                            <InputLabel>Tipo de personal</InputLabel>
                                            <Select {...field} label="Tipo de personal">
                                                <MenuItem value="academico">Académico</MenuItem>
                                                <MenuItem value="administrativo">Administrativo</MenuItem>
                                            </Select>
                                            {errors.staffType && (
                                                <FormHelperText>{errors.staffType.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="subjectsTeaching"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControl fullWidth>
                                            <InputLabel>Asignaturas que imparte</InputLabel>
                                            <Select
                                                multiple
                                                value={value || []}
                                                onChange={onChange}
                                                renderValue={(selected) => selected.join(', ')}
                                                label="Asignaturas que imparte"
                                            >
                                                {['Matemáticas', 'Lenguaje', 'Ciencias'].map((asignatura) => (
                                                    <MenuItem key={asignatura} value={asignatura}>
                                                        <Checkbox checked={(value || []).includes(asignatura)} />
                                                        {asignatura}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Información de Contacto */}
                    <TabPanel value={activeTab} index={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Teléfono"
                                            fullWidth
                                            error={!!errors.phoneNumber}
                                            helperText={errors.phoneNumber?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            label="Fecha de nacimiento"
                                            fullWidth
                                            error={!!errors.birthDate}
                                            helperText={errors.birthDate?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Información Laboral */}
                    <TabPanel value={activeTab} index={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="tipoContrato"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.tipoContrato}>
                                            <InputLabel>Tipo de contrato</InputLabel>
                                            <Select {...field} label="Tipo de contrato">
                                                <MenuItem value="contrato1">Contrato 1</MenuItem>
                                                <MenuItem value="contrato2">Contrato 2</MenuItem>
                                            </Select>
                                            {errors.tipoContrato && (
                                                <FormHelperText>{errors.tipoContrato.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="horasContrato"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Horas de contrato"
                                            fullWidth
                                            error={!!errors.horasContrato}
                                            helperText={errors.horasContrato?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Estado */}
                    <TabPanel value={activeTab} index={5}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    {...field}
                                                    checked={field.value}
                                                />
                                            }
                                            label="Activo"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="configuracionNotificaciones.email"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    {...field}
                                                    checked={field.value}
                                                />
                                            }
                                            label="Notificaciones por email"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Contraseña */}
                    <TabPanel value={activeTab} index={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Contraseña"
                                            type="password"
                                            fullWidth
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Confirmar Contraseña"
                                            type="password"
                                            fullWidth
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                </CardContent>

                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Crear Usuario'}
                    </Button>
                </Box>
            </Card>
        </form>
    );
}

export default UserRegisterForm;
