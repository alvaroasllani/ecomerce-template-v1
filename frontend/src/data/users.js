// Usuarios de ejemplo para pruebas
export const sampleUsers = [
  {
    id: 1,
    fullName: "Juan Pérez",
    email: "juan@ejemplo.com",
    password: "123456",
    role: "customer", // Cliente normal
  },
  {
    id: 2,
    fullName: "María García",
    email: "maria@ejemplo.com",
    password: "123456",
    role: "customer",
  },
  {
    id: 3,
    fullName: "Carlos Rodríguez",
    email: "carlos@ejemplo.com",
    password: "123456",
    role: "customer",
  },
  {
    id: 4,
    fullName: "Ana Martínez",
    email: "ana@ejemplo.com",
    password: "123456",
    role: "customer",
  },
  {
    id: 5,
    fullName: "Demo User",
    email: "demo@ejemplo.com",
    password: "demo123",
    role: "customer",
  },
  {
    id: 6,
    fullName: "Administrador TechStore",
    email: "admin@techstore.com",
    password: "admin123",
    role: "admin", // Administrador
  }
];

// Función para validar credenciales
export const validateCredentials = (email, password) => {
  const user = sampleUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user;
};

// Función para verificar si el email ya existe
export const emailExists = (email) => {
  return sampleUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
};

// Función para registrar un nuevo usuario
export const registerUser = (userData) => {
  const newUser = {
    id: sampleUsers.length + 1,
    ...userData,
    role: "customer", // Por defecto, los nuevos usuarios son clientes
  };
  sampleUsers.push(newUser);
  return newUser;
};

