import * as Yup from 'yup';
import { validateRUT } from '@/utils/rutValidation';

// Constantes para enumeraciones
export const ROLES = ['Viewer', 'User', 'Admin'];
export const STAFF_TYPES = ['Docente', 'Administrativo', 'Directivo'];
export const DEPARTMENTS = ['Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Administración'];
export const CONTRACT_TYPES = ['Planta', 'Contrata', 'Honorarios'];
export const SUBJECTS = ['Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés', 'Educación Física'];
export const PERMISSIONS = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

export const userValidationSchema = Yup.object().shape({
    // Información Personal
    firstName: Yup.string()
        .required('Los nombres son obligatorios')
        .min(2, 'Debe tener al menos 2 caracteres')
        .max(50, 'No puede exceder 50 caracteres'),
    
    lastName: Yup.string()
        .required('Los apellidos son obligatorios')
        .min(2, 'Debe tener al menos 2 caracteres')
        .max(50, 'No puede exceder 50 caracteres'),
    
    email: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es obligatorio'),
    
    rut: Yup.string()
        .required('El RUT es obligatorio')
        .test('rut-valido', 'RUT inválido', validateRUT),

    // Roles y Permisos
    role: Yup.string()
        .oneOf(ROLES, 'Rol inválido')
        .required('Debe seleccionar un rol'),
    
    permisos: Yup.array()
        .of(Yup.string().oneOf(PERMISSIONS))
        .nullable(),

    // Información Profesional
    staffType: Yup.string()
        .oneOf(STAFF_TYPES)
        .nullable(),
    
    subjectsTeaching: Yup.array()
        .of(Yup.string().oneOf(SUBJECTS))
        .nullable(),
    
    position: Yup.string()
        .max(100)
        .nullable(),
    
    department: Yup.string()
        .oneOf(DEPARTMENTS)
        .nullable(),
    
    especialidad: Yup.string()
        .max(100)
        .nullable(),
    
    registroSecreduc: Yup.string()
        .max(50)
        .nullable(),
    
    mencionesExtra: Yup.array()
        .of(Yup.string())
        .nullable(),

    // Información de Contacto
    phoneNumber: Yup.string()
        .matches(/^(\+?56)?(\d{9})$/, 'Número de teléfono inválido')
        .nullable(),
    
    birthDate: Yup.date()
        .max(new Date(), 'La fecha no puede ser futura')
        .nullable(),
    
    address: Yup.string()
        .max(200)
        .nullable(),
    
    comuna: Yup.string()
        .max(100)
        .nullable(),
    
    region: Yup.string()
        .max(100)
        .nullable(),
    
    emergencyContact: Yup.object().shape({
        name: Yup.string().max(100).nullable(),
        relation: Yup.string().max(50).nullable(),
        phone: Yup.string()
            .matches(/^(\+?56)?(\d{9})$/, 'Número de teléfono inválido')
            .nullable()
    }).nullable(),

    // Información Laboral
    tipoContrato: Yup.string()
        .oneOf(CONTRACT_TYPES)
        .nullable(),
    
    horasContrato: Yup.number()
        .min(0)
        .max(44)
        .nullable(),
    
    fechaIngreso: Yup.date()
        .max(new Date())
        .nullable(),
    
    bieniosReconocidos: Yup.number()
        .min(0)
        .nullable(),
    
    evaluacionDocente: Yup.string()
        .max(200)
        .nullable(),

    // Estado y Configuración
    isActive: Yup.boolean()
        .default(true)
        .nullable(),
    
    configuracionNotificaciones: Yup.object()
        .nullable(),

    // Contraseña
    password: Yup.string()
        .required('La contraseña es obligatoria')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales'
        ),
    
    confirmPassword: Yup.string()
        .required('Debe confirmar la contraseña')
        .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
});

export const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    rut: '',
    role: 'Viewer',
    permisos: [],
    staffType: null,
    subjectsTeaching: [],
    position: null,
    department: null,
    especialidad: null,
    registroSecreduc: null,
    mencionesExtra: [],
    phoneNumber: null,
    birthDate: null,
    address: null,
    comuna: null,
    region: null,
    emergencyContact: null,
    tipoContrato: null,
    horasContrato: null,
    fechaIngreso: null,
    bieniosReconocidos: null,
    evaluacionDocente: null,
    isActive: true,
    configuracionNotificaciones: null,
    password: '',
    confirmPassword: ''
};
