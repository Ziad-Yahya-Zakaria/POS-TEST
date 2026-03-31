import bcrypt from 'bcryptjs'

const passwordRounds = 10

export async function hashPassword(rawPassword) {
  return bcrypt.hash(rawPassword, passwordRounds)
}

export async function verifyPassword(rawPassword, passwordHash) {
  return bcrypt.compare(rawPassword, passwordHash)
}

export function serializeUser(user) {
  if (!user) {
    return null
  }

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    status: user.status,
    role: user.role
      ? {
          id: user.role.id,
          code: user.role.code,
          name: user.role.name,
        }
      : null,
    branch: user.branch
      ? {
          id: user.branch.id,
          code: user.branch.code,
          name: user.branch.name,
        }
      : null,
    employee: user.employee
      ? {
          id: user.employee.id,
          employeeCode: user.employee.employeeCode,
          fullName: `${user.employee.firstName} ${user.employee.lastName}`.trim(),
          nfcCardCode: user.employee.nfcCardCode,
        }
      : null,
  }
}
