import { useEffect } from 'react';

const evaluatePasswordStrength = (password: string) => {
    // Inicializamos la fuerza de la contraseña con los valores predeterminados (débil)
    let strength = {
        label: 'weak',
        color: 'bg-red-500',
        width: '33%',
    };

    // Definimos algunos criterios para mejorar la evaluación de la contraseña
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    // Asignamos una puntuación en función de los criterios de seguridad
    let score = 0;
    if (isLongEnough) score += 1; // 1 punto si tiene al menos 8 caracteres
    if (hasLowerCase) score += 1; // 1 punto si tiene minúsculas
    if (hasUpperCase) score += 1; // 1 punto si tiene mayúsculas
    if (hasNumbers) score += 1; // 1 punto si tiene números
    if (hasSpecialChars) score += 1; // 1 punto si tiene caracteres especiales

    // Determinamos la fortaleza de la contraseña según la puntuación obtenida
    if (score <= 2) {
        strength = {
            label: 'weak',
            color: 'bg-red-500',
            width: '33%',
        };
    } else if (score === 3 || score === 4) {
        strength = {
            label: 'medium',
            color: 'bg-yellow-500',
            width: '66%',
        };
    } else if (score === 5) {
        strength = {
            label: 'strong',
            color: 'bg-green-500',
            width: '100%',
        };
    }

    return strength;
};

const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const strength = evaluatePasswordStrength(password);

    // Llama a la evaluación cada vez que cambia la contraseña
    useEffect(() => {
        evaluatePasswordStrength(password);
    }, [password]);

    return (
        <div className="w-full mt-2">
            {/* Barra de progreso */}
            <div className="relative w-full h-2 rounded-lg bg-gray-200 overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ease-in-out ${strength.color}`}
                    style={{ width: strength.width }}
                />
            </div>

            {/* Texto de fortaleza */}
            <p
                className={`mt-2 text-sm font-semibold ${
                    strength.label === 'weak'
                        ? 'text-red-500'
                        : strength.label === 'medium'
                        ? 'text-yellow-500'
                        : 'text-green-500'
                }`}
            >
                {strength.label === 'weak'
                    ? 'Contraseña débil'
                    : strength.label === 'medium'
                    ? 'Contraseña media'
                    : 'Contraseña fuerte'}
            </p>
        </div>
    );
};

export default PasswordStrengthIndicator;
