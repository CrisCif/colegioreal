'use client';
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    Typography,
    Box,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { useUsers } from '@/hooks/useUsers';

export default function TablaUsuarios() {
    const router = useRouter();
    const permissions = usePermissions();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const { 
        data: usuarios, 
        isLoading,
        deleteMutation
    } = useUsers();

    const canEdit = permissions.checkEntity('USER', 'UPDATE');
    const canDelete = permissions.checkEntity('USER', 'DELETE');
    const canView = permissions.checkEntity('USER', 'READ');

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!usuarios?.length) {
        return (
            <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    No hay usuarios registrados
                </Typography>               
            </Box>
        );
    }

    const handleEditUser = (userId) => {
        if (canEdit) {
            router.push(`/usuarios/${userId}/edit`);
        }
    };

    const handleViewUser = (userId) => {
        if (canView) {
            router.push(`/usuarios/${userId}`);
        }
    };

    const handleDeleteUserConfirmation = (user) => {
        if (canDelete) {
            setUserToDelete(user);
            setOpenDeleteDialog(true);
        }
    };

    const handleDeleteUser = async () => {
        if (userToDelete && canDelete) {
            try {
                await deleteMutation.mutateAsync(userToDelete.id);
                setOpenDeleteDialog(false);
                setUserToDelete(null);
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
            }
        }
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setUserToDelete(null);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.isActive ? 'Activo' : 'Inactivo'}</TableCell>
                                <TableCell align="right">
                                    {canView && (
                                        <Tooltip title="Ver Detalles">
                                            <IconButton
                                                onClick={() => handleViewUser(user.id)}
                                                color="primary"
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {canEdit && (
                                        <Tooltip title="Editar">
                                            <IconButton
                                                onClick={() => handleEditUser(user.id)}
                                                color="secondary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {canDelete && (
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                onClick={() => handleDeleteUserConfirmation(user)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmar Eliminación de Usuario"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`¿Está seguro que desea eliminar al usuario ${userToDelete?.firstName} ${userToDelete?.lastName}?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeleteUser}
                        color="error"
                        autoFocus
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
