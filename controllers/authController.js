const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { userSignupSchema } = require('../validators/userSchema');
const { userLoginSchema } = require('../validators/loginSchema');
const { handleError } = require('../utils/errorHandler');

exports.signup = async (req, res) => {
  try {
    const validated = userSignupSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(validated.password, 10);
    const user = await prisma.user.create({
      data: { ...validated, password: hashedPassword },
    });
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.login = async (req, res) => {
  try {
    const validated = userLoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    if (!user || !(await bcrypt.compare(validated.password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    handleError(res, err);
  }
};
