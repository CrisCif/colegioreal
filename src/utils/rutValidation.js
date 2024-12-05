export const validateRUT = (rut) => {
    if (!rut) return false;

    // Limpiar el RUT de puntos y guión
    const cleanRUT = rut.toString().replace(/[.-]/g, '');
    const body = cleanRUT.slice(0, -1);
    const dv = cleanRUT.slice(-1).toUpperCase();

    // Validar formato básico
    if (!/^\d{7,8}[0-9K]$/i.test(cleanRUT)) {
        return false;
    }

    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;

    // Suma ponderada
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    // Calcular dígito verificador esperado
    const expectedDV = 11 - (sum % 11);
    const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();

    return calculatedDV === dv;
};
