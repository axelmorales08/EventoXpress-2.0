
const bcrypt = require('bcrypt');
const {
    db,
    Gender,
    TypeUser,
    Category,
    TypeVenue,
    TypePaymentMethods,
    User,
    Venue,
    PaymentsMethods,
    OwnerAuthorization,
    SecurityMeasures,
    UserFavorites,
    VenueAssistance,
    Ticket
} = require('../models');


// ==================== Datos ====================


const genders = [
    { id: 1, gender_name: 'Femenino' },
    { id: 2, gender_name: 'Masculino' },
    { id: 3, gender_name: 'Otro' },
    { id: 4, gender_name: 'Prefiero no decirlo' }
];


const typeUsers = [
    { id: 1, name: 'administrador' },
    { id: 2, name: 'organizador' },
    { id: 3, name: 'consumidor' }
];


const categories = [
    { id: 1, name: 'Música' },
    { id: 2, name: 'Deportes' },
    { id: 3, name: 'Teatro' },
    { id: 4, name: 'Exposiciones' },
    { id: 5, name: 'Festivales' },
    { id: 6, name: 'Fiestas y Celebraciones' },
    { id: 7, name: 'Gastronomía' },
    { id: 8, name: 'Conferencias y Charlas' }
];


const typeVenues = [
    { id: 1, name: 'Presencial' },
    { id: 2, name: 'Virtual' }
];


const typePaymentMethods = [
    { id: 1, name: 'Tarjeta de crédito' },
    { id: 2, name: 'Tarjeta de débito' },
    { id: 3, name: 'PayPal' }
];


// Las contraseñas están en texto plano acá y se hashean al insertar
const users = [
    { id: 1, type_users_id: 1, gender_id: 2, full_name: 'Yoshikage Kira', user_name: 'kirayoshikage', dni: '12323456', email: 'kira@gmail.com', birthdate: '1980-01-30', phone: '1122334455', photo: null, password: 'mer_pass', created_at: '2025-10-27 10:00:00' },
    { id: 2, type_users_id: 2, gender_id: 2, full_name: 'Joseph Joestar', user_name: 'josephjoestar', dni: '12374738', email: 'ningendurayo@gmail.com', birthdate: '1986-09-05', phone: '1147589123', photo: null, password: 'ker_pass', created_at: '2025-10-27 10:00:00' },
    { id: 3, type_users_id: 3, gender_id: 2, full_name: 'Dio Brando', user_name: 'diobrando', dni: '12374739', email: 'zawarudo@gmail.com', birthdate: '1986-09-05', phone: '1147589124', photo: null, password: 'konodioda', created_at: '2025-10-27 10:00:00' },
    { id: 4, type_users_id: 3, gender_id: 2, full_name: 'Funny Valentine', user_name: 'D4C', dni: '43214455', email: 'doyjaan@gmail.com', birthdate: '1970-06-05', phone: '1476920811', photo: null, password: 'lovetrain', created_at: '2025-10-28 12:00:00' },
    { id: 5, type_users_id: 3, gender_id: 2, full_name: 'Diavolo', user_name: 'boss', dni: '12276731', email: 'kingcrimson@gmail.com', birthdate: '1989-11-09', phone: '1682378483', photo: null, password: 'yu_pass', created_at: '2025-11-03 15:30:00' }
];


const venues = [
    { id: 1, type_venue_id: 1, category_id: 3, user_id: 2, province: 'Buenos Aires', locality: 'CABA', address: 'Av. Corrientes 1234', description: 'Teatro con capacidad para 500 personas.', beginning: '2026-08-01', ending: '2026-08-31', image: null, name: 'Teatro Corrientes', suitable_for_all_audiences: true, created_at: '2026-07-29 12:00:00' },
    { id: 2, type_venue_id: 2, category_id: 8, user_id: 2, province: 'Buenos Aires', locality: 'CABA', address: 'Av. Santa Fe 5678', description: 'Conferencia virtual sobre tecnología.', beginning: '2026-09-15', ending: '2026-09-15', image: null, name: 'Tech Conference Online', suitable_for_all_audiences: true, created_at: '2026-07-29 12:00:00' },
    { id: 3, type_venue_id: 1, category_id: 1, user_id: 2, province: 'Buenos Aires', locality: 'CABA', address: 'Av. Callao 91011', description: 'Concierto de rock en vivo.', beginning: '2026-10-05', ending: '2026-10-05', image: null, name: 'Rock Night Live', suitable_for_all_audiences: false, created_at: '2026-07-29 12:00:00' }
];


const paymentsMethods = [
    { id: 1, types_payment_methods_id: 1, user_id: 3, responsible: 'Diavolo', number: '1234567890123456', expiration: '2028-12-31', CVV: '123' },
    { id: 2, types_payment_methods_id: 2, user_id: 4, responsible: 'd4c', number: '9876543210987654', expiration: '2027-06-30', CVV: '456' },
    { id: 3, types_payment_methods_id: 3, user_id: 5, responsible: 'boss', number: '1111222233334444', expiration: '2026-03-31', CVV: '789' }
];


const ownerAuthorizations = [
    { id: 1, venue_id: 1, owner_name: 'Joseph Joestar', owner_dni: '12374738', phone: '1147589123', residential_address: 'Av. Siempreviva 742, CABA', document: 'autorizacion_teatro.pdf' },
    { id: 2, venue_id: 3, owner_name: 'Joseph Joestar', owner_dni: '12374738', phone: '1147589123', residential_address: 'Av. Siempreviva 742, CABA', document: 'autorizacion_rock.pdf' }
];


const securityMeasures = [
    { id: 1, venue_id: 1, description: 'Seguridad básica', amount_security_personnel: 2, amount_extinguishers: 3, emergency_exits: true, amount_emergency_exits: 2 },
    { id: 2, venue_id: 2, description: 'Seguridad avanzada', amount_security_personnel: 4, amount_extinguishers: 5, emergency_exits: true, amount_emergency_exits: 3 },
    { id: 3, venue_id: 3, description: 'Seguridad mínima', amount_security_personnel: 1, amount_extinguishers: 2, emergency_exits: false, amount_emergency_exits: 0 }
];


const userFavorites = [
    { id: 1, venue_id: 1, user_id: 3 },
    { id: 2, venue_id: 3, user_id: 3 },
    { id: 3, venue_id: 2, user_id: 4 },
    { id: 4, venue_id: 1, user_id: 5 }
];


const venueAssistance = [
    { id: 1, venue_id: 1, user_id: 3 },
    { id: 2, venue_id: 2, user_id: 4 },
    { id: 3, venue_id: 3, user_id: 5 }
];


const tickets = [
    { id: 1, venue_id: 1, name: 'Entrada General', price: 15000.00, amount: 300 },
    { id: 2, venue_id: 1, name: 'Palco VIP', price: 25000.00, amount: 200 },
    { id: 3, venue_id: 2, name: 'Acceso Estándar', price: 0.00, amount: 1000 },
    { id: 4, venue_id: 2, name: 'Acceso Premium con Certificado', price: 5000.00, amount: 200 },
    { id: 5, venue_id: 3, name: 'Campo General', price: 20000.00, amount: 400 },
    { id: 6, venue_id: 3, name: 'Platea Preferencial', price: 35000.00, amount: 100 }
];


// ==================== Helpers ====================

/**
 * Inserta los registros solo si la tabla está vacía (así no se duplican
 * datos cada vez que se levanta el servidor) y después reajusta la
 * secuencia del id, porque en PostgreSQL insertar ids explícitos
 * NO avanza el autoincrement.
 */
const seedTable = async (Model, rows, transaction) => {
    const name = Model.name;


    if ((await Model.count({ transaction })) > 0) {
        console.log(`  - ${name}: ya tiene datos, se omite`);
        return;
    }


    await Model.bulkCreate(rows, { transaction });


    const table = Model.getTableName();
    const tableName = typeof table === 'string' ? table : table.tableName;
    const quoted = db.getQueryInterface().quoteIdentifier(tableName);


    await db.query(
        `SELECT setval(pg_get_serial_sequence(:seq, 'id'), (SELECT COALESCE(MAX(id), 1) FROM ${quoted}))`,
        { replacements: { seq: quoted }, transaction }
    );


    console.log(`  - ${name}: ${rows.length} registros insertados`);
};


// ==================== Seeder principal ====================

const seedDatabase = async () => {
    const transaction = await db.transaction();


    try {
        console.log('Ejecutando seeders...');


        // 1. Catálogos (no dependen de nadie)
        await seedTable(Gender, genders, transaction);
        await seedTable(TypeUser, typeUsers, transaction);
        await seedTable(Category, categories, transaction);
        await seedTable(TypeVenue, typeVenues, transaction);
        await seedTable(TypePaymentMethods, typePaymentMethods, transaction);


        // 2. Usuarios (dependen de Gender y TypeUser)
        const usersHashed = await Promise.all(
            users.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 10) }))
        );
        await seedTable(User, usersHashed, transaction);


        // 3. Venues (dependen de User, TypeVenue y Category)
        await seedTable(Venue, venues, transaction);


        // 4. Tablas que dependen de User y/o Venue
        await seedTable(PaymentsMethods, paymentsMethods, transaction);
        await seedTable(OwnerAuthorization, ownerAuthorizations, transaction);
        await seedTable(SecurityMeasures, securityMeasures, transaction);
        await seedTable(UserFavorites, userFavorites, transaction);
        await seedTable(VenueAssistance, venueAssistance, transaction);
        await seedTable(Ticket, tickets, transaction);


        await transaction.commit();
        console.log('Seeders ejecutados correctamente.');
    } catch (error) {
        await transaction.rollback();
        console.error('Error al ejecutar los seeders:', error);
        throw error;
    }
};



module.exports = seedDatabase;
module.exports.seedDatabase = seedDatabase;

