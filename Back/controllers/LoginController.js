import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAILS = process.env.ADMIN_EMAILS.split(',');

const authController = {
  register: async (req, res) => {
    try {
      console.log('Controlador de registro iniciado');
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }

      // Determinar el rol basado en el email
      const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';

      // Crear nuevo usuario
      const user = await User.create({
        name,
        email,
        password,
        role
      });

      // Generar token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Guardar token en la base de datos
      user.token = token;
      await user.save();

      console.log('Usuario registrado exitosamente:', user.email);
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        role: user.role
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ 
        message: 'Error al registrar usuario', 
        error: error.message 
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generar nuevo token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Actualizar token en la base de datos
      user.token = token;
      await user.save();

      res.json({
        message: 'Login exitoso',
        token,
        role: user.role
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
  },

  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findOne({ where: { id: decoded.id, token } });

      if (!user) {
        return res.status(401).json({ message: 'Token inválido' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Error en verificación de token:', error);
      res.status(401).json({ message: 'Token inválido', error: error.message });
    }
  },
  
  // Nueva función para obtener todos los usuarios con rol "user"
  getAllUsers: async (req, res) => {
    try {
      // Verificar si el solicitante tiene permisos
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'No tienes permisos para acceder a esta información' });
      }
      
      // Buscar todos los usuarios con rol "user"
      const users = await User.findAll({
        where: { role: 'user' }
      });
      
      res.json({
        success: true,
        users
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        message: 'Error al obtener usuarios',
        error: error.message
      });
    }
  },
  
  // Función específica para Unity que incluye passwords (NO RECOMENDADO)
  getUsersForUnity: async (req, res) => {
    try {
      // Buscar todos los usuarios con rol "user" incluyendo el password hasheado
      const users = await User.findAll({
        where: { role: 'user' },
        attributes: ['id', 'name', 'email', 'password', 'role']
      });
      
      // ADVERTENCIA: Esta práctica es extremadamente insegura
      // No se puede "deshashear" una contraseña hasheada, ya que el hashing es un proceso de un solo sentido
      // Lo que se está enviando son las contraseñas hasheadas, que aunque mejor que texto plano,
      // sigue siendo una grave vulnerabilidad de seguridad
      
      const formattedUsers = users.map(user => ({
        id: user.id,
        username: user.name,
        email: user.email,
        password: user.password, // Contraseña hasheada, NO es posible deshashearla
        role: user.role
      }));
      
      res.json({
        success: true,
        users: formattedUsers
      });
    } catch (error) {
      console.error('Error al obtener usuarios para Unity:', error);
      res.status(500).json({
        message: 'Error al obtener usuarios para Unity',
        error: error.message
      });
    }
  }
};

export default authController;