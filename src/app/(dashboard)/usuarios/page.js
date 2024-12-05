'use client';
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import TablaUsuarios from './TablaUsuarios';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';

export default function UsuariosPage() {
    const router = useRouter();
    const permissions = usePermissions();
    const canCreate = permissions.checkEntity('USER', 'CREATE');

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 500 }}>
                    Gestión de Usuarios
                </Typography>
                
                {canCreate && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/usuarios/register')}
                    >
                        Agregar Usuario
                    </Button>
                )}
            </Box>

            <TablaUsuarios />
        </Box>
    );
}
