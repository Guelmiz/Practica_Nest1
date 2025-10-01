import {PrismaClient, Role } from '@prisma/client';

const db = new PrismaClient();

async function seedDatabase(): Promise<void> {
  console.log('🌱 Comenzando la carga inicial de datos...');

  // Lista de tenants a crear según referencia
  const listaTenants = [
    { id: 1, name: 'Tech Solutions' },
    { id: 2, name: 'Marketing Pro' },
    { id: 3, name: 'Consulting Exp' },
  ];

  for (const tenantItem of listaTenants) {
    // Upsert: crea el tenant si no existe, si existe no hace cambios
    const tenantCreado = await db.tenant.upsert({
      where: { id: tenantItem.id },
      update: {},
      create: {
        name: tenantItem.name,
        createdAt: new Date(),
        updated: new Date(), // 👈 coincide con tu schema (campo "updated")
      },
    });

    // Generar dos cuentas de usuario por cada tenant
    const cuentas = [
      {
        email: `admin_${tenantCreado.id}@example.com`,
        name: `Admin ${tenantCreado.name}`,
        password: 'admin123',
        telephone: '8888-0000',
        role: Role.ADMIN,
        tenantid: tenantCreado.id, // 👈 igual al schema
      },
      {
        email: `user_${tenantCreado.id}@example.com`,
        name: `User ${tenantCreado.name}`,
        password: 'user123',
        telephone: '8888-1111',
        role: Role.USER,
        tenantid: tenantCreado.id, // 👈 igual al schema
      },
    ];

    for (const cuenta of cuentas) {
      await db.user.upsert({
        where: { email: cuenta.email },
        update: {},
        create: cuenta,
      });
    }
  }

  console.log('✅ Datos iniciales insertados correctamente');
}

seedDatabase()
  .catch((error) => {
    console.error('❌ Ocurrió un error durante el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
